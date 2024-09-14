//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


/**
 * Defines labels for metadata returned from server.
 * Helps eliminate redundant strings in responses.
 */
export const InfoLabel: Record<string, string> = {
  '0': '',
  '1': 'Exif version',
  '2': 'File name',
  '3': 'File size',
  '4': 'Image width',
  '5': 'Image height',
  '6': 'Camera make',
  '7': 'Camera model',
  '8': 'Orientation',
  '9': 'Resolution unit',
  '10': 'X resolution',
  '11': 'Y resolution',
  '12': 'Original Timestamp',
  '13': 'Focal length',
  '14': 'Aperture',
  '15': 'ISO speed',
  '16': 'Flash',
  '17': 'Flash bias',
  '18': 'Exposure mode',
  '19': 'Exposure time',
  '20': 'Exposure bias',
  '21': 'F number',
  '22': 'Shutter speed',
  '23': 'Metering mode',
  '24': 'Light source',
  '25': 'White balance',
  '26': 'Image quality',
  '27': 'Digital zoom',
  '28': 'Description',
  '29': 'User comment',
  '30': 'Copyright',
  '31': 'GPS Latitude Ref',
  '32': 'GPS Latitude',
  '33': 'GPS Longitude Ref',
  '34': 'GPS Longitude',
  '35': 'GPS TS Date',
  '36': 'GPS TS Time',
  '37': 'GPS Map Datum',
};

/**
 * Define an object containing image information as key-value pairs.
 */
export interface InfoData {
  [key: string]: string;
}

/**
 * Encapsulates meta data associated with an image.
 */
export interface ImageInfo {
  caption: string;
  data: InfoData;
}

/**
 * Initializer for 'ImageInfo'.
 */
export const initImageInfo = (argCaption?: string): ImageInfo => ({
    caption: argCaption ? argCaption : '',
    data: {}
  });
