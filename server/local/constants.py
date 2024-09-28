#
# smritii
#
# (c) Copyright 2024. Sanjeev Premi <spremi@ymail.com>
#
# BSD-3-Clause
#

EXTN_IMAGE = ('.jpg', '.jpeg', '.png', '.bmp')
"""
Supported image extensions
"""

EXTN_AUDIO = ('.mp3', '.wav', '.ogg', '.m4a', '.flac')
"""
Supported audio extensions
"""

EXTN_VIDEO = ('.mp4', '.avi', '.mov', '.wmv', '.mkv')
"""
Supported video extensions
"""

EXTN_SUPPORTED = EXTN_IMAGE + EXTN_AUDIO + EXTN_VIDEO
"""
All supported extensions
"""

INFO_PREFIX = 'inf_'
"""
Prefix for information file
"""

INFO_EXTN = '.json'
"""
Suffix for information file
"""

#
# Tag names for meta information stored for images.
#
T_EXIF_VERSION = 1
T_FILE_NAME = 2
T_FILE_SIZE = 3
T_IMAGE_WIDTH = 4
T_IMAGE_HEIGHT = 5
T_CAMERA_MAKE = 6
T_CAMERA_MODEL = 7
T_ORIENTATION = 8
T_RESOLUTION_UNIT = 9
T_X_RESOLUTION = 10
T_Y_RESOLUTION = 11
T_TS_ORIGINAL = 12
T_FOCAL_LENGTH = 13
T_APERTURE = 14
T_ISO_SPEED = 15
T_FLASH = 16
T_FLASH_BIAS = 17
T_EXPOSURE_MODE = 18
T_EXPOSURE_TIME = 19
T_EXPOSURE_BIAS = 20
T_F_NUMBER = 21
T_SHUTTER_SPEED = 22
T_METERING_MODE = 23
T_LIGHT_SOURCE = 24
T_WHITE_BALANCE = 25
T_IMAGE_QUALITY = 26
T_DIGITAL_ZOOM = 27
T_DESCRIPTION = 28
T_USER_COMMENT = 29
T_COPYRIGHT = 30
T_GPS_LATITUDE_REF = 31
T_GPS_LATITUDE = 32
T_GPS_LONGITUDE_REF = 33
T_GPS_LONGITUDE = 34
T_GPS_TS_DATE = 35
T_GPS_TS_TIME = 36
T_GPS_MAP_DATUM = 37

#
# Resolution units defined in EXIF standard.
#
ExifResolutionUnit = {
    1: 'Not defined',
    2: 'Inch',
    3: 'Centimeter',
}

#
# Different orientations sources defined in EXIF standard.
#
ExifOrientation = {
    1: 'Normal',
    2: 'Mirror Horizontal',
    3: 'Upside-down (rotated 180deg)',
    4: 'Mirror Vertical',
    5: 'Mirror Horizontal & Rotated 90deg counter-clockwise',
    6: 'Rotated 90deg counter-clockwise',
    7: 'Mirror Horizontal & Rotated 90deg clockwise',
    8: 'Rotated 90deg clockwise',
}

#
# Different light sources defined in EXIF standard.
#
ExifLightSource = {
    0: 'Unknown',
    1: 'Daylight',
    2: 'Fluorescent',
    3: 'Tungsten',
    4: 'Flash',
    9: 'Fine',
    10: 'Cloudy',
    11: 'Shade',
    12: 'Daylight Fluorescent',
    13: 'Day White Fluorescent',
    14: 'Cool White Fluorescent',
    15: 'White Fluorescent',
    17: 'Standard Light A',
    18: 'Standard Light B',
    19: 'Standard Light C',
    20: 'D55',
    21: 'D65',
    22: 'D75',
    23: 'D50',
    24: 'ISO',
    255: 'Other',
}

#
# Different metering modes defined in EXIF standard.
#
ExifMeteringMode = {
    0: 'Unknown',
    1: 'Average',
    2: 'Center Weighted Average',
    3: 'Spot',
    4: 'Multi Spot',
    5: 'Pattern',
    6: 'Partial',
    255: 'Other',
}

#
# Exposure modes defined in EXIF standard.
#
ExifExposureMode = {
    0: 'Auto',
    1: 'Manual',
    2: 'Auto Bracket',
}

#
# Different flash modes defined in EXIF standard.
#
ExifFlash = {
    0: 'Not used',
    1: 'Used',
}

#
# Different white balance modes defined in EXIF standard.
#
ExifWhiteBalance = {
    0: 'AUTO',
    1: 'MANUAL',
}

#
# Exposure programs defined in EXIF standard.
#
ExifExposureProgram = {
    0: 'Not defined',
    1: 'Manual',
    2: 'Normal Program',
    3: 'Aperture Priority',
    4: 'Shutter Priority',
    5: 'Creative Program',
    6: 'Action Program',
    7: 'Portrait Mode',
    8: 'Landscape Mode',
}
