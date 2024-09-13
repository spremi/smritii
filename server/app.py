#
# smritii
#
# (c) Copyright 2024. Sanjeev Premi <spremi@ymail.com>
#
# BSD-3-Clause
#

from PIL import Image, ImageOps
from flask import Flask, abort, jsonify, render_template, request, send_file
from http import HTTPStatus
from pathlib import Path

import hashlib
import json
import os
import piexif

from .cache import Cache
from . import constants as const

BASE_ALBUM = ''
"""
Base directory of album
"""

BASE_META = ''
"""
Base directory for metadata
"""

DIR_THUMB = 'thumbs'
"""
Base (sub)directory for thumbnails
"""

THUMB_PREFIX = 'th_'
"""
Prefix for thumbnails
"""

THUMB_SIZE = (200, 200)
"""
Size of thumbnail
"""

THUMB_EXTN = '.jpg'
"""
Extension for thumbnails.
"""

DIR_INFO = 'info'
"""
Base (sub)directory for info.
"""

AlbumCache = Cache()
"""
Cache for directory listing.
This helps faster response to UI - without reading directories repeatedly.
"""


def create_app(config=None):
    """
    Factory method used by 'flask run'.
    """
    global BASE_ALBUM, BASE_META

    app = Flask(__name__)

    BASE_ALBUM = os.environ.get('BASE_ALBUM')
    BASE_META = os.environ.get('BASE_META')

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/image/<path:location>', methods=['GET'])
    def get_photo(location):
        """
        Returns image at specified location, if it exists.
        Else, return static error image.

        Ensures that final path is located under BASE_ALBUM.
        """
        global BASE_ALBUM

        full_path = os.path.abspath(os.path.join(BASE_ALBUM, location))

        if full_path.startswith(BASE_ALBUM) and os.path.isfile(full_path):
            return send_file(full_path)
        else:
            return send_file('static/images/404.png')

    @app.route('/thumb/<path:location>', methods=['GET'])
    def get_thumb(location):
        """
        Returns thumbnail for the image from metadata.
        If thumbnail doesn't exist, it creates one.
        For consistency, location refers to 'actual' image - not the thumbnail.
        """
        global BASE_ALBUM, BASE_META, DIR_THUMB
        global THUMB_SIZE, THUMB_EXTN

        arg_location = Path(location)

        item_path = os.path.abspath(os.path.join(BASE_ALBUM, location))

        #
        # Scrub incorrect urls early.
        #
        if not item_path.startswith(BASE_ALBUM) or not os.path.isfile(item_path):
            abort(HTTPStatus.BAD_REQUEST)

        arg_name = arg_location.name
        arg_stem = arg_location.stem
        arg_path = arg_location.parent

        thumb_name = THUMB_PREFIX + arg_stem + THUMB_EXTN

        thumb_path = os.path.abspath(os.path.join(BASE_META, DIR_THUMB, arg_path, thumb_name))

        if not thumb_path.startswith(BASE_META):
            return send_file('static/images/404.png')

        if os.path.isfile(thumb_path):
            return send_file(thumb_path)

        thumb_dir = os.path.dirname(thumb_path)
        os.makedirs(thumb_dir, exist_ok=True)

        _, extn = os.path.splitext(item_path)

        if extn in const.EXTN_IMAGE:
            im = Image.open(item_path)
            im = ImageOps.exif_transpose(im)
            im.thumbnail(THUMB_SIZE)
            im.save(thumb_path)

            return send_file(thumb_path)

        if extn in const.EXTN_AUDIO:
            return send_file('static/images/audio-thumb.png')

        if extn in const.EXTN_VIDEO:
            return send_file('static/images/video-thumb.png')

        return send_file('static/images/404.png')

    @app.route('/info/<path:location>', methods=['GET'])
    def get_info(location):
        """
        Returns information related to the image.
        It includes (if present) caption, exif data, copyright, etc.
        For consistency, location refers to 'actual' image - not the file containing.

        The information is cached on first access.
        (Can be refreshed via query param)
        """
        global BASE_ALBUM, BASE_META, DIR_INFO

        arg_location = Path(location)

        image_path = os.path.abspath(os.path.join(BASE_ALBUM, location))

        #
        # Weed out incorrect urls early.
        #
        if not image_path.startswith(BASE_ALBUM) or not os.path.isfile(image_path):
            abort(HTTPStatus.BAD_REQUEST)

        #
        # Should meta information be refreshed?
        #
        refresh = 0 if request.args.get('refresh') in (None, '', '0') else 1

        arg_name = arg_location.name
        arg_stem = arg_location.stem
        arg_path = arg_location.parent

        info_name = const.INFO_PREFIX + arg_stem + const.INFO_EXTN

        info_path = os.path.abspath(os.path.join(BASE_META, DIR_INFO, arg_path, info_name))

        if not info_path.startswith(BASE_META):
            return jsonify({'status': 'ERROR', 'exif': None})

        if os.path.isfile(info_path) and refresh == 0:
            return send_file(info_path)

        stat = os.stat(image_path)

        info_dir = os.path.dirname(info_path)
        os.makedirs(info_dir, exist_ok=True)

        info = {
            'caption': '',
            'data': {}
        }

        exif_data = {
            const.T_FILE_NAME: arg_name,
            const.T_FILE_SIZE: stat.st_size
        }

        im = Image.open(image_path)

        im_exif = im.info.get('exif')

        if im_exif:
            exif_dict = piexif.load(im_exif)

            if '0th' in exif_dict:
                for tag in exif_dict['0th']:
                    # print(f'= {tag} =')
                    tag_name = piexif.TAGS['0th'][tag]["name"]

                    if tag_name == 'Make':
                        exif_data[const.T_CAMERA_MAKE] = exif_dict['0th'][tag].decode('utf-8')

                    if tag_name == 'Model':
                        exif_data[const.T_CAMERA_MODEL] = exif_dict['0th'][tag].decode('utf-8')

                    if tag_name == 'Orientation':
                        v = exif_dict['0th'][tag]

                        exif_data[const.T_ORIENTATION] = const.ExifOrientation[v]

                    if tag_name == 'ResolutionUnit':
                        v = exif_dict['0th'][tag]

                        exif_data[const.T_RESOLUTION_UNIT] = const.ExifResolutionUnit.get(v, f'({v})')

                    if tag_name == 'XResolution':
                        v = exif_dict['0th'][tag]
                        r = v[0] / v[1]

                        exif_data[const.T_X_RESOLUTION] = f'{r:.0f}'

                    if tag_name == 'YResolution':
                        v = exif_dict['0th'][tag]
                        r = v[0] / v[1]

                        exif_data[const.T_Y_RESOLUTION] = f'{r:.0f}'

                    if tag_name == 'ImageDescription':
                        exif_data[const.T_DESCRIPTION] = exif_dict['0th'][tag].decode('utf-8').strip()

                if 'Exif' in exif_dict:
                    for tag in exif_dict['Exif']:
                        # print(f'= {tag} =')
                        tag_name = piexif.TAGS['Exif'][tag]["name"]

                        if tag_name == 'ExifVersion':
                            exif_data[const.T_EXIF_VERSION] = exif_dict['Exif'][tag].decode('utf-8')

                        if tag_name == 'PixelXDimension':
                            exif_data[const.T_IMAGE_WIDTH] = exif_dict['Exif'][tag]

                        if tag_name == 'PixelYDimension':
                            exif_data[const.T_IMAGE_HEIGHT] = exif_dict['Exif'][tag]

                        if tag_name == 'DateTimeOriginal':
                            exif_data[const.T_TS_ORIGINAL] = exif_dict['Exif'][tag].decode('utf-8')

                        if tag_name == 'FocalLength':
                            v = exif_dict['Exif'][tag]
                            r = v[0] / v[1]

                            exif_data[const.T_FOCAL_LENGTH] = f'{r:.1f} mm'

                        if tag_name == 'ISOSpeedRatings':
                            exif_data[const.T_ISO_SPEED] = exif_dict['Exif'][tag]

                        if tag_name == 'Flash':
                            v = exif_dict['Exif'][tag]

                            exif_data[const.T_FLASH] = const.ExifFlash.get(v, f'({v})')

                        if tag_name == 'ExposureMode':
                            v = exif_dict['Exif'][tag]

                            exif_data[const.T_EXPOSURE_MODE] = const.ExifExposureMode.get(v, f'({v})')

                        if tag_name == 'ExposureTime':
                            v = exif_dict['Exif'][tag]
                            r = v[0] / v[1]

                            exif_data[const.T_EXPOSURE_TIME] = f'{r:.8f}'

                        if tag_name == 'ExposureBiasValue':
                            v = exif_dict['Exif'][tag]
                            r = v[0] / v[1]

                            exif_data[const.T_EXPOSURE_BIAS] = f'{r:.1f} EV'

                        if tag_name == 'FNumber':
                            v = exif_dict['Exif'][tag]
                            r = v[0] / v[1]

                            exif_data[const.T_F_NUMBER] = f'{r:2.1f}'

                        if tag_name == 'MeteringMode':
                            v = exif_dict['Exif'][tag]

                            exif_data[const.T_METERING_MODE] = const.ExifMeteringMode.get(v, f'({v})')

                        if tag_name == 'LightSource':
                            v = exif_dict['Exif'][tag]

                            exif_data[const.T_LIGHT_SOURCE] = const.ExifLightSource[v]

                        if tag_name == 'WhiteBalance':
                            v = exif_dict['Exif'][tag]

                            exif_data[const.T_WHITE_BALANCE] = const.ExifWhiteBalance[v]

                        if tag_name == 'DigitalZoomRatio':
                            v = exif_dict['Exif'][tag]
                            r = v[0] / v[1]

                            exif_data[const.T_DIGITAL_ZOOM] = f'{r:2.1f}'

                        if tag_name == 'UserComment':
                            exif_data[const.T_USER_COMMENT] = exif_dict['Exif'][tag].decode('utf-8')

                if 'GPS' in exif_dict:
                    for tag in exif_dict['GPS']:
                        tag_name = piexif.TAGS['GPS'][tag]["name"]

                        if tag_name == 'GPSLatitudeRef':
                            exif_data[const.T_GPS_LATITUDE_REF] = exif_dict['GPS'][tag].decode('utf-8')

                        if tag_name == 'GPSLatitude':
                            v = exif_dict['GPS'][tag]

                            lat_deg = v[0][0] / v[0][1]
                            lat_min = v[1][0] / v[1][1]
                            lat_sec = v[2][0] / v[2][1]

                            exif_data[const.T_GPS_LATITUDE] = f'{lat_deg:.2f}/{lat_min:.2f}/{lat_sec:.3f}'

                        if tag_name == 'GPSLongitudeRef':
                            exif_data[const.T_GPS_LONGITUDE_REF] = exif_dict['GPS'][tag].decode('utf-8')

                        if tag_name == 'GPSLongitude':
                            v = exif_dict['GPS'][tag]

                            lon_deg = v[0][0] / v[0][1]
                            lon_min = v[1][0] / v[1][1]
                            lon_sec = v[2][0] / v[2][1]

                            exif_data[const.T_GPS_LONGITUDE] = f'{lon_deg:.2f}/{lon_min:.2f}/{lon_sec:.3f}'

                        if tag_name == 'GPSDateStamp':
                            exif_data[const.T_GPS_TS_DATE] = exif_dict['GPS'][tag].decode('utf-8').strip()

                        if tag_name == 'GPSTimeStamp':
                            v = exif_dict['GPS'][tag]

                            ts_hh = v[0][0] / v[0][1]
                            ts_mm = v[1][0] / v[1][1]
                            ts_ss = v[2][0] / v[2][1]

                            exif_data[const.T_GPS_TS_TIME] = f'{ts_hh:2.0f}:{ts_mm:2.0f}:{ts_ss:4.2f}'

                        if tag_name == 'GPSMapDatum':
                            exif_data[const.T_GPS_MAP_DATUM] = exif_dict['GPS'][tag].decode('utf-8').strip()

        info['data'] = exif_data

        with open(info_path, 'w') as f:
            json.dump(info, f, indent=2)

        return jsonify(info)

    @app.route('/data', methods=['POST'])
    def get_data():
        global BASE_ALBUM, BASE_META
        global AlbumCache

        data = request.get_json()

        if 'location' not in data:
            abort(HTTPStatus.BAD_REQUEST)

        if 'refresh' in data:
            refresh = 0 if data['refresh'] in (None, '', '0') else 1
        else:
            refresh = 0

        location = data['location']

        if location.startswith('/'):
            location = location[1:]

        #
        # Weed out incorrect paths early.
        #
        full_dir = os.path.abspath(os.path.join(BASE_ALBUM, location))

        if not (full_dir.startswith(BASE_ALBUM) and os.path.isdir(full_dir)):
            abort(HTTPStatus.NOT_FOUND)

        #
        # Attempt to fetch directory information exists in cache.
        #
        cache_key = f'{location}'
        cached_data = AlbumCache.get(cache_key)

        if cached_data and refresh == 0:
            albums = cached_data['albums']
            images = cached_data['images']

        else:
            dirs = []
            files = []

            for item in os.listdir(full_dir):
                item_full = os.path.join(full_dir, item)
                item_link = item_full.split(BASE_ALBUM, 1)[1]

                # Collect files with supported extensions
                if os.path.isfile(item_full):
                    if item.lower().endswith(const.EXTN_SUPPORTED):
                        files.append(item_link)

                # Collect directories (albums)
                elif os.path.isdir(item_full):
                    dirs.append(item_link)

            dirs.sort()
            files.sort()

            #
            # Add sequence number, MD5 hash to each directory, file
            # MD5 hash works as regeneratable unique id.
            #
            albums = []
            images = []

            for d, dir_name in enumerate(dirs):
                path = os.path.join(location, dir_name)

                enc_str = path.encode()
                enc_hash = hashlib.md5(enc_str).hexdigest()

                albums.append({
                    'id': enc_hash,
                    'seq': d,
                    'name': dir_name,
                })

            for f, file_name in enumerate(files):
                path = os.path.join(location, file_name)

                enc_str = path.encode()
                enc_hash = hashlib.md5(enc_str).hexdigest()

                images.append({
                    'id': enc_hash,
                    'seq': f,
                    'name': file_name,
                })

            #
            # Save list of albums & images in cache.
            #
            AlbumCache.set(location, {'albums': albums, 'images': images})

        return jsonify({
            'albums': albums,
            'images': images,
        })

    #
    # Return application object.
    #
    return app


#
# Entry point for 'regular' python application.
#
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
