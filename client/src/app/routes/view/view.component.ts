//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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

  /**
   * Whether tools are visible?
   */
  toolsVisible = true;

  /**
   * Whether navigation icons are visible?
   */

  navVisible = true;

  /**
   * ID of timer used for tools visibility
   */
  private toolsTimer: number | undefined;

  /**
   * ID of timer used for navigation visibility
   */
  private navTimer: number | undefined;

  /**
   * ID of interval used for slide show.
   */
  private showInterval: number | undefined;

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

    this.resetToolsTimer();
    this.resetNavTimer();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();

    if (this.toolsTimer) {
      window.clearTimeout(this.toolsTimer);
    }

    if (this.navTimer) {
      window.clearTimeout(this.navTimer);
    }

    if (this.showInterval) {
      window.clearInterval(this.showInterval);
    }
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
    this.stateSvc.zoomIn();
  }

  zoomOut(): void {
    this.stateSvc.zoomOut();
  }

  startShow(): void {
    if (this.images) {
      const lastIndex = this.images.length - 1;

      this.showInterval = window.setInterval(() => {
        if (this.index < lastIndex) {
          this.next();
        } else {
          // The index will be incremented to 0 in "next()"
          this.index = -1;
        }
      }, 10000);

      this.isPlaying = true;
    }
  }

  pauseShow(): void {
  }

  stopShow(): void {
    if (this.showInterval) {
      window.clearInterval(this.showInterval);
    }

    this.isPlaying = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(): void {
    this.toolsVisible = true;
    this.navVisible = true;

    this.resetToolsTimer();
    this.resetNavTimer();
  }

  /**
   * Reset timer used to toggle tools visibility.
   */
  private resetToolsTimer(): void {
    clearTimeout(this.toolsTimer);

    this.toolsTimer = window.setTimeout(() => {
      this.toolsVisible = false;
    }, 8000);
  }

  /**
   * Reset timer used to toggle navigation visibility.
   */
  private resetNavTimer(): void {
    clearTimeout(this.navTimer);

    this.navTimer = window.setTimeout(() => {
      this.navVisible = false;
    }, 10000);
  }
}
