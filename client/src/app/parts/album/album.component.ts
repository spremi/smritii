//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//

import { Component, HostListener, Input } from '@angular/core';

import { Album } from '@models/album';
import { BasenamePipe } from '@pipes/basename.pipe';
import { StateService } from '@services/state.service';

@Component({
  selector: 'sp-album',
  standalone: true,
  imports: [
    BasenamePipe
  ],
  templateUrl: './album.component.html',
  styleUrl: './album.component.sass'
})
export class AlbumComponent {
  @Input() data: Album | undefined;

  constructor(private stateSvc: StateService) {}

  @HostListener('click')
  open(): void {
    if (this.data) {
      this.stateSvc.setLocation(this.data.name);
    }
  }
}
