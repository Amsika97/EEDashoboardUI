import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonbuttonComponent } from './commonbutton.component';

describe('CommonbuttonComponent', () => {
  let component: CommonbuttonComponent;
  let fixture: ComponentFixture<CommonbuttonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonbuttonComponent]
    });
    fixture = TestBed.createComponent(CommonbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
