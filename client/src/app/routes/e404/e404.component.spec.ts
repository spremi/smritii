import { ComponentFixture, TestBed } from '@angular/core/testing';

import { E404Component } from './e404.component';

describe('E404Component', () => {
  let component: E404Component;
  let fixture: ComponentFixture<E404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [E404Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(E404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
