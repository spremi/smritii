import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageInfoComponent } from './image-info.component';

describe('ImageInfoComponent', () => {
  let component: ImageInfoComponent;
  let fixture: ComponentFixture<ImageInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
