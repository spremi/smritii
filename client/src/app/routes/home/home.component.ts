//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { filter, first, Subscription, switchMap, timer } from 'rxjs';

import { Album } from '@models/album';
import { Image } from '@models/image';
import { ViewRequest } from '@models/view-request';

import { AlbumsComponent } from '@parts/albums/albums.component';
import { ImagesComponent } from '@parts/images/images.component';
import { PebblesComponent } from '@parts/pebbles/pebbles.component';
import { SplashComponent } from '@parts/splash/splash.component';

import { DataService } from '@services/data.service';
import { StateService } from '@services/state.service';

@Component({
  selector: 'sp-home',
  standalone: true,
  imports: [
    AlbumsComponent,
    ImagesComponent,
    PebblesComponent,
    SplashComponent,
  ],
  animations: [
    trigger('homeIn', [
      transition(':enter', [
        animate('2s', style({
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({
          transform: 'translateX(100%)'
        }))
      ])
    ]),
    trigger('splashOut', [
      transition(':leave', [
        animate('250ms', style({
          opacity: 0
        }))
      ])
    ])
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent implements OnInit, OnDestroy {

  albums: Album[] = [];
  images: Image[] = [];

  splash = false;

  private subs: Subscription[] = [];

  private readonly SPLASH_TIME = 15000;

  constructor(
    private dataSvc: DataService,
    private stateSvc: StateService
  ) {}

  ngOnInit(): void {
    this.splash = this.stateSvc.getSplash();

    if (!this.splash) {
      timer(this.SPLASH_TIME).pipe(first()).subscribe(() => {
        this.stateSvc.setSplash();
        this.splash = true;
      });
    }

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
