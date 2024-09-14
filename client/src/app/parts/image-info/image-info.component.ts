//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, Input, OnInit } from '@angular/core';

import { ImageInfo, InfoData, InfoLabel } from '@models/image-info';

@Component({
  selector: 'sp-image-info',
  standalone: true,
  imports: [],
  templateUrl: './image-info.component.html',
  styleUrl: './image-info.component.sass'
})
export class ImageInfoComponent implements OnInit{
  @Input() info: ImageInfo | undefined;

  keys: string[] = [];
  data: InfoData = {};

  readonly labels = InfoLabel;

  ngOnInit(): void {
    if (this.info) {
      this.data = this.info.data;
      this.keys = Object.keys(this.data).sort((a, b) => parseInt(a) - parseInt(b));
    }
  }
}
