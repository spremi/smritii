//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, Observable } from 'rxjs';

import { Image, initImage } from '@models/image';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private location$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private selected$: BehaviorSubject<Image> = new BehaviorSubject<Image>(initImage());

  private zoom$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  private zoom = 1;

  constructor() { }

  setLocation(location: string): void {
    this.location$.next(location);
  }

  getLocation(): Observable<string> {
    return this.location$.asObservable().pipe(
      filter(c => c !== null),
      distinctUntilChanged()
    );
  }

  clearSelected(): void {
    this.selected$.next(initImage());
  }

  setSelected(item: Image): void {
    this.selected$.next(item);

    this.zoomNone();
  }

  getSelected(): Observable<Image> {
    return this.selected$.asObservable().pipe(
      filter(c => c !== null),
      distinctUntilChanged()
    );
  }

  zoomIn(): void {
    this.zoom += 0.5;

    this.zoom$.next(this.zoom);
  }

  zoomOut(): void {
    this.zoom = (this.zoom > 1) ? this.zoom - 0.5 : 1;

    this.zoom$.next(this.zoom);
  }

  zoomNone(): void {
    this.zoom = 1;

    this.zoom$.next(this.zoom);
  }

  getZoom(): Observable<number> {
    return this.zoom$.asObservable().pipe(
      distinctUntilChanged()
    );
  }
}
