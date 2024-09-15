//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { first } from 'rxjs';

import { Image } from '@models/image';
import { DataService } from '@services/data.service';

@Component({
  selector: 'sp-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.sass'
})
export class CanvasComponent implements OnInit, OnChanges {
  @Input() data: Image | undefined;

  imageUri = '';

  constructor(private dataSvc: DataService) {
  }

  ngOnInit(): void {
    this.fetchImage();
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
