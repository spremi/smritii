//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


/**
 * Encapsulates link to a specific album.
 * List of pebbles describe path to current album.
 */
export interface Pebble {
  tag: string;
  link: string;
}

/**
 * Initializer for 'Pebble'.
 */
export const initPebble = (
  argTag?: string,
  argLink?: string): Pebble => ({
    tag: argTag ? argTag : '',
    link: argLink ? argLink : '',
  });
