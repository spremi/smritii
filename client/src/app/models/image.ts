//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { ImageInfo, initImageInfo } from '@models/image-info';

/**
 * Encapsulates information of an image.
 */
export interface Image {
  id: string;
  seq: number;
  name: string;
  info?: ImageInfo;
}

/**
 * Initializer for 'Image'.
 */
export const initImage = (
  argId?: string,
  argSeq?: number,
  argName?: string,
  argInfo?: ImageInfo): Image => ({
    id: argId ? argId : '',
    seq: argSeq ? argSeq : -1,
    name: argName ? argName : '',
    info: argInfo ? argInfo : initImageInfo()
  });
