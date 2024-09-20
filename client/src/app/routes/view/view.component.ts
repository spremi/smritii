//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first, Subscription, switchMap, tap } from 'rxjs';

import { Image } from '@models/image';
import { ViewRequest } from '@models/view-request';

import { CanvasComponent } from '@parts/canvas/canvas.component';

import { DataService } from '@services/data.service';
import { StateService } from '@services/state.service';

@Component({
  selector: 'sp-view',
  standalone: true,
  imports: [
    CanvasComponent,
  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.sass'
})
export class ViewComponent implements OnInit, OnDestroy {
  /**
   * Selected image.
   */
  image: Image | undefined;

  /**
   * Array of images containing the selection.
   */
  images: Image[] | undefined;

  /**
   * Index of selected image in the array.
   */
  index = 0;

  isFullScreen = !!document.fullscreenElement;
  isPlaying = false;

  showInfo = false;

  private sub: Subscription | undefined;

  constructor(
    private router: Router,
    private dataSvc: DataService,
    private stateSvc: StateService,
  ) {}

  ngOnInit(): void {

    this.sub = this.stateSvc.getSelected().pipe(
      tap(o => {
        // When browser is refreshed, we don't have sufficient data.
        // Redirect to main page.
        if (o && o.id === '' && o.seq === -1) {
          this.router.navigate(['']);
          return;
        }

        this.image = o;
      }),
      //
      // Get current location.
      //
      switchMap(o => {
        return this.stateSvc.getLocation();
      }),
      //
      // Make request to get data from location.
      // Being current location, this must be fulfilled from cache.
      //
      switchMap(o => {
        const request: ViewRequest = {
          location: o
        };

        return this.dataSvc.getView(request);
      }),
      //
      // No need to remain subscribed after initialization.
      //
      first()
    ).subscribe(r => {
      //
      // Extract array of images from the response.
      //
      this.images = r.images;

      this.index = this.images.findIndex(o => o.id === this.image?.id);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /**
   * Browse to next image.
   */
  next(): void {
    if (this.images) {
      this.index += 1;
      this.image = this.images[this.index];

      // Keep the state consistent.
      this.stateSvc.setSelected(this.image);
    }
  }

  /**
   * Browse to previous image.
   */
  previous(): void {
    if (this.images) {
      this.index -= 1;
      this.image = this.images[this.index];

      // Keep the state consistent.
      this.stateSvc.setSelected(this.image);
    }
  }

  /**
   * Return to the list view
   */
  close(): void {
    this.stateSvc.clearSelected();

    this.router.navigate(['']);
  }

  fullScreen(): void {
    const doc = document.documentElement;

    if ('requestFullscreen' in doc) {
      doc.requestFullscreen();
    }

    this.isFullScreen = true;
  }

  restoreScreen(): void {
    if ('exitFullscreen' in document) {
      document.exitFullscreen();
    }

    this.isFullScreen = false;
  }

  toggleInfo(): void {
    this.showInfo = !this.showInfo;
  }

  zoomIn(): void {
  }

  zoomOut(): void {
  }

  startShow(): void {
  }

  pauseShow(): void {
  }

  stopShow(): void {
  }
}
