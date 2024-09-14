//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


/**
 * Encapsulates request to server to fetch contents of an album.
 */
export interface ViewRequest {
  /**
   * Path to album from base.
   */
  location: string;

  /**
   * Force rescan onf the location, instead of getting a cached response.
   */
  refresh?: boolean;
}


/**
 * Initializer for 'ViewRequest'.
 */
export const initViewRequest = (
  argPath: string,
  argRefresh?: boolean
): ViewRequest => {
  const ret: ViewRequest = {
    location: argPath
  }

  if (argRefresh) {
    ret.refresh = argRefresh;
  }

  return ret;
};
