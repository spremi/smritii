//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Image } from '@models/image';
import { BasenamePipe } from '@pipes/basename.pipe';
import { DataService } from '@services/data.service';
import { StateService } from '@services/state.service';

@Component({
  selector: 'sp-image',
  standalone: true,
  imports: [
    BasenamePipe,
  ],
  templateUrl: './image.component.html',
  styleUrl: './image.component.sass'
})
export class ImageComponent implements OnInit {
  @Input() data: Image | undefined;

  readonly THUMB_PATH = '/thumb';

  thumbUrl = '';

  constructor(private router: Router,
    private dataSvc: DataService,
    private stateSvc: StateService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.thumbUrl = this.dataSvc.getBaseUrl() + this.THUMB_PATH + this.data.name;
    }
  }

  @HostListener('click')
  open(): void {
    if (this.data) {
      // Select image for canvas
      this.stateSvc.setSelected(this.data);

      // Transition to image show
      this.router.navigate(['view']);
    }
  }
}
