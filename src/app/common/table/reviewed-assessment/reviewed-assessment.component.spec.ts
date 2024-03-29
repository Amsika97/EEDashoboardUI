import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewedAssessmentComponent } from './reviewed-assessment.component';

describe('ReviewedAssessmentComponent', () => {
  let component: ReviewedAssessmentComponent;
  let fixture: ComponentFixture<ReviewedAssessmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewedAssessmentComponent]
    });
    fixture = TestBed.createComponent(ReviewedAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
