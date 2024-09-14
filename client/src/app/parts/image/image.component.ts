//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Image } from '@models/image';
import { BasenamePipe } from '@pipes/basename.pipe';
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
export class ImageComponent {
  @Input() data: Image | undefined;

  constructor(private router: Router,
    private stateSvc: StateService
  ) {}

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
