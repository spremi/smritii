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

import os

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
