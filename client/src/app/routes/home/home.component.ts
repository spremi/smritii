//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, OnDestroy, OnInit } from '@angular/core';

import { filter, first, Subscription, switchMap } from 'rxjs';

import { Album } from '@models/album';
import { Image } from '@models/image';
import { ViewRequest } from '@models/view-request';

import { AlbumsComponent } from '@parts/albums/albums.component';
import { PebblesComponent } from '@parts/pebbles/pebbles.component';

import { DataService } from '@services/data.service';
import { StateService } from '@services/state.service';

@Component({
  selector: 'sp-home',
  standalone: true,
  imports: [
    AlbumsComponent,
    PebblesComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent implements OnInit, OnDestroy {

  albums: Album[] = [];
  images: Image[] = [];

  private subs: Subscription[] = [];

  constructor(
    private dataSvc: DataService,
    private stateSvc: StateService
  ) {}

  ngOnInit(): void {
    const subLocation = this.stateSvc.getLocation().pipe(
      switchMap(o => {
        const request: ViewRequest = {
          location: o
        };

        return this.dataSvc.getView(request).pipe(
          filter(x => x !== undefined),
          first()
        );
      })
    ).subscribe(r => {
      this.albums = r.albums;
      this.images = r.images;
    });

    this.subs.push(subLocation);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s?.unsubscribe());
  }
}
