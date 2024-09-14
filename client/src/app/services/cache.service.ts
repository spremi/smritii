//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Injectable } from '@angular/core';

import { ImageInfo } from '@models/image-info';
import { ViewResponse } from '@models/view-response';

@Injectable({
  providedIn: 'root'
})

/**
 * Implements simple 'in-app' cache to reduce number of server requests.
 * Cache responses for:
 * - N location requests.
 * - M image blobs. (Do we need? ... beyond browser's own cache?)
 * - Z image information objects.
 */
export class CacheService {
  readonly N_LOCATIONS = 5;
  readonly M_IMAGES = 10;
  readonly Z_IMAGE_INFOS = 10;

  // Map preserves the order of insertion.
  // Hence, it is obvious choice for LRU cache implementation.

  /**
   * Cache for location requests.
   */
  private locationMap: Map<string, ViewResponse> = new Map();

  /**
   * Cache for image blobs.
   */
  private imageMap: Map<string, Blob> = new Map();

  /**
   * Cache for image information.
   */
  private infoMap: Map<string, ImageInfo> = new Map();

  constructor() { }

  /**
   * Add response to location request.
   */
  addResponse(id: string, response: ViewResponse): void {
    if (this.locationMap.size >= this.N_LOCATIONS) {
      const keyLRU = this.locationMap.keys().next().value;
      this.locationMap.delete(keyLRU);
    }

    this.locationMap.set(id, response);
  }

  /**
   * Get response to location request.
   */
  getResponse(id: string): ViewResponse | undefined {
    if (this.locationMap.has(id)) {
      const value = this.locationMap.get(id);

      if (value) {
        // Remove and insert back to mimic LRU cache
        this.locationMap.delete(id);
        this.locationMap.set(id, value);

        return value;
      }
    }

    return undefined;
  }

  /**
   * Add image blob.
   */
  addImage(id: string, blob: Blob): void {
    if (this.imageMap.size >= this.M_IMAGES) {
      const keyLRU = this.imageMap.keys().next().value;
      this.imageMap.delete(keyLRU);
    }

    this.imageMap.set(id, blob);
  }

  /**
   * Get image blob.
   */
  getImage(id: string): Blob | undefined {
    if (this.imageMap.has(id)) {
      const blob = this.imageMap.get(id);

      if (blob) {
        // Remove and insert back to mimic LRU cache
        this.imageMap.delete(id);
        this.imageMap.set(id, blob);

        return blob;
      }
    }

    return undefined;
  }

  /**
   * Add image information.
   */
  addImageInfo(id: string, info: ImageInfo): void {
    if (this.infoMap.size >= this.Z_IMAGE_INFOS) {
      const keyLRU = this.infoMap.keys().next().value;
      this.infoMap.delete(keyLRU);
    }

    this.infoMap.set(id, info);
  }

  /**
   * Get response to location request.
   */
  getImageInfo(id: string): ImageInfo | undefined {
    if (this.infoMap.has(id)) {
      const info = this.infoMap.get(id);

      if (info) {
        // Remove and insert back to mimic LRU cache
        this.infoMap.delete(id);
        this.infoMap.set(id, info);

        return info;
      }
    }

    return undefined;
  }
}
