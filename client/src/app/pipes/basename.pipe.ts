//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'basename',
  standalone: true
})
export class BasenamePipe implements PipeTransform {

  transform(path: string): string {
    const lastSep = path.lastIndexOf('/');
    if (lastSep === -1) {
      return path;
    }

    return path.substring(lastSep + 1);
  }
}
