//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, Observable, of, tap } from 'rxjs';

import { ImageInfo } from '@models/image-info';
import { ViewRequest } from '@models/view-request';
import { ViewResponse } from '@models/view-response';

import { CacheService } from '@services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly BASE_URI = 'http://localhost:5000';  // TODO: Read from environment

  constructor(
    private httpClient: HttpClient,
    private cacheSvc: CacheService
  ) { }

  /**
   * Returns base URL.
   */
  getBaseUrl(): string {
    return this.BASE_URI;
  }

  /**
   * Makes POST request to fetch view information for specific location.
   */
  getView(request: ViewRequest): Observable<ViewResponse> {
    const location = request.location;

    const cachedResponse = this.cacheSvc.getResponse(location);

    if (cachedResponse) {
      return of(cachedResponse);
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json'
      }),
    }

    const url = `${this.BASE_URI}/data`;

    return this.httpClient.post<ViewResponse>(url, request, httpOptions)
      .pipe(
        tap(response => this.cacheSvc.addResponse(location, response)),
        catchError(this.handleError<ViewResponse>('getView', undefined))
      );
  }

  /**
   * Makes GET request to fetch specific image.
   */
  getImage(path: string): Observable<Blob> {
    const cachedImage = this.cacheSvc.getImage(path);

    if (cachedImage) {
      return of(cachedImage);
    }

    const url = `${this.BASE_URI}/image/${path}`;

    return this.httpClient.get<Blob>(url, { responseType: 'blob' as 'json' })
      .pipe(
        tap(response => this.cacheSvc.addImage(path, response)),
        catchError(this.handleError<Blob>('getImage', undefined))
      );
  }

  /**
   * Makes GET request to fetch information for specific image.
   */
  getImageInfo(path: string): Observable<ImageInfo> {
    const cachedInfo = this.cacheSvc.getImageInfo(path);

    if (cachedInfo) {
      return of(cachedInfo);
    }

    const url = `${this.BASE_URI}/info/${path}`;

    return this.httpClient.get<ImageInfo>(url)
      .pipe(
        tap(response => this.cacheSvc.addImageInfo(path, response)),
        catchError(this.handleError<ImageInfo>('getImageInfo', undefined))
      );
  }

  /**
   * Handle error during communication with server.
   */
  private handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      console.error(`Error during ${operation}: ${error}`);

      return of(result as T);
    };
  }
}
