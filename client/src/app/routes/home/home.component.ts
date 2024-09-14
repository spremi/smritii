import { Component } from '@angular/core';
import { PebblesComponent } from '@parts/pebbles/pebbles.component';

@Component({
  selector: 'sp-home',
  standalone: true,
  imports: [
    PebblesComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {

}
