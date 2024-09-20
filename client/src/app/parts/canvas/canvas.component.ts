//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { first, Subscription } from 'rxjs';

import { Image } from '@models/image';
import { DataService } from '@services/data.service';
import { StateService } from '@services/state.service';

@Component({
  selector: 'sp-canvas',
  standalone: true,
  imports: [],
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
    if (this.data) {
      const path = this.data.name;
      const location = path.charAt(0) === '/' ? path.substring(1) : path;

      this.dataSvc.getImage(location).pipe(first()).subscribe(b => {
        if (b) {
          this.imageUri = URL.createObjectURL(b);
        } else {
          this.imageUri = '';
        }
      });
    }
  }
}
