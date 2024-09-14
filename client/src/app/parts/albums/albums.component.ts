//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Component, Input } from '@angular/core';

import { Album } from '@models/album';
import { AlbumComponent } from '@parts/album/album.component';

@Component({
  selector: 'sp-albums',
  standalone: true,
  imports: [
    AlbumComponent
  ],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.sass'
})
export class AlbumsComponent {
  @Input() albums: Album[] = [];

  constructor() {}
}
