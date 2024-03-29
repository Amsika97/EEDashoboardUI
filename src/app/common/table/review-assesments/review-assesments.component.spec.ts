import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAssesmentsComponent } from './review-assesments.component';

describe('ReviewAssesmentsComponent', () => {
  let component: ReviewAssesmentsComponent;
  let fixture: ComponentFixture<ReviewAssesmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewAssesmentsComponent]
    });
    fixture = TestBed.createComponent(ReviewAssesmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
