//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, Input } from '@angular/core';

import { Image } from '@models/image';
import { ImageComponent } from '@parts/image/image.component';

@Component({
  selector: 'sp-images',
  standalone: true,
  imports: [
    ImageComponent,
  ],
  templateUrl: './images.component.html',
  styleUrl: './images.component.sass'
})
export class ImagesComponent {
  @Input() images: Image[] = [];

}
