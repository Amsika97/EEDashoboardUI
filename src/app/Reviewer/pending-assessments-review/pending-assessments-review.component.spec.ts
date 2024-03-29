import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAssessmentsReviewComponent } from './pending-assessments-review.component';

describe('PendingAssessmentsReviewComponent', () => {
  let component: PendingAssessmentsReviewComponent;
  let fixture: ComponentFixture<PendingAssessmentsReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingAssessmentsReviewComponent]
    });
    fixture = TestBed.createComponent(PendingAssessmentsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
