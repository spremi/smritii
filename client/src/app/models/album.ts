//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


/**
 * Represents a folder containing albums and/or images.
 */
export interface Album {
  /**
   * Unique ID of the album.
   */
  id: string;

  /**
   * Sequence in which album is shown.
   */
  seq: number;

  /**
   * Name of the album.
   */
  name: string;
}

/**
 * Initializer for 'Album'.
 */
export const initAlbum = (
  argId?: string,
  argSeq?: number,
  argName?: string): Album => ({
    id: argId ? argId : '',
    seq: argSeq ? argSeq : -1,
    name: argName ? argName : '',
  });
