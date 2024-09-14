import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'basename',
  standalone: true
})
export class BasenamePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
