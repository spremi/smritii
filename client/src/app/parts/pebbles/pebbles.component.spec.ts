import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PebblesComponent } from './pebbles.component';

describe('PebblesComponent', () => {
  let component: PebblesComponent;
  let fixture: ComponentFixture<PebblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PebblesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PebblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
