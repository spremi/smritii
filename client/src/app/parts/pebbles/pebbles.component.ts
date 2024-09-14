//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { Pebble } from '@models/pebble';
import { StateService } from '@services/state.service';

@Component({
  selector: 'sp-pebbles',
  standalone: true,
  imports: [],
  templateUrl: './pebbles.component.html',
  styleUrl: './pebbles.component.sass'
})
export class PebblesComponent implements OnInit, OnDestroy{
  /**
   * First pebble in sequence.
   */
  readonly FIRST_PEBBLE = [{ tag: 'HOME', link: '/' }];

  private sub: Subscription | undefined = undefined;

  pebbles: Pebble[] = [...this.FIRST_PEBBLE];

  constructor(private stateSvc: StateService) {
  }

  ngOnInit(): void {
    this.sub = this.stateSvc.getLocation().subscribe(o => {
      this.setPebbles(o);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /**
   * Browse to location corresponding to selected pebble.
   * @param path
   */
  browse(path: string): void {
    this.stateSvc.setLocation(path);
  }

  /**
   * Builds an array of pebbles from current location.
   */
  private setPebbles(path: string): void {
    this.pebbles = [...this.FIRST_PEBBLE];

    const location = path.charAt(0) === '/' ? path.substring(1) : path;

    let trail = '';

    location.split('/').forEach(part => {
      trail += part;

      if (trail !== '') {
        let pebble: Pebble = {
          tag: part,
          link: trail,
        };

        this.pebbles.push(pebble);

        trail += '/'
      }
    });
  }
}
