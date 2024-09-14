//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private location$: BehaviorSubject<string> = new BehaviorSubject<string>('');

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
}
