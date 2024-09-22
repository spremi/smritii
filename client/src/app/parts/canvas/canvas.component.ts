//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { delay, first, Subscription } from 'rxjs';

import { Image } from '@models/image';
import { DataService } from '@services/data.service';
import { StateService } from '@services/state.service';

@Component({
  selector: 'sp-canvas',
  standalone: true,
  imports: [],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('1s', style({
          opacity: 0
        }))
      ])
    ])
  ],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.sass'
})
export class CanvasComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data: Image | undefined;

  imageUri = '';

  scale = 1;

  subZoom!: Subscription;

  constructor(
    private dataSvc: DataService,
    private stateSvc: StateService
  ) {
  }

  ngOnInit(): void {
    this.fetchImage();

    this.subZoom = this.stateSvc.getZoom().subscribe(v => this.scale = v);
  }

  ngOnDestroy(): void {
    this.subZoom?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const attr in changes) {
      if (attr === 'data') {
        this.data = changes[attr].currentValue;

        this.fetchImage();
      }
    }
  }

  private fetchImage(): void {
    //
    // This value must be clieared to force revalution of "@if()" in the template.
    // Revaluation triggers the enter, leave animations.
    //
    this.imageUri = '';

    if (this.data) {
      const path = this.data.name;
      const location = path.charAt(0) === '/' ? path.substring(1) : path;

      this.dataSvc.getImage(location).pipe(
        first(),
        delay(100)    // Delay for animation to kick-in.
      ).subscribe(b => {
        if (b) {
          this.imageUri = URL.createObjectURL(b);
        }
      });
    }
  }
}
