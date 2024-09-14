//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//

import { Album } from '@models/album';
import { Image } from '@models/image';

/**
 * Encapsulates response from server to ViewRequest.
 */
export interface ViewResponse {
  /**
   * List of albums at specified location.
   */
  albums: Album[],

  /**
   * List of images at specified location.
   */
  images: Image[],
}
