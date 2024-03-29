import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavebuttonComponent } from './savebutton.component';

describe('SavebuttonComponent', () => {
  let component: SavebuttonComponent;
  let fixture: ComponentFixture<SavebuttonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavebuttonComponent]
    });
    fixture = TestBed.createComponent(SavebuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
