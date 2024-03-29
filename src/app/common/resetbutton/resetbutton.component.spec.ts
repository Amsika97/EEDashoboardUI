import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetbuttonComponent } from './resetbutton.component';

describe('ResetbuttonComponent', () => {
  let component: ResetbuttonComponent;
  let fixture: ComponentFixture<ResetbuttonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetbuttonComponent]
    });
    fixture = TestBed.createComponent(ResetbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
