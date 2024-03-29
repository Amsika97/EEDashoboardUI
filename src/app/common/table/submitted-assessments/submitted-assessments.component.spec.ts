import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedAssessmentsComponent } from './submitted-assessments.component';

describe('SubmittedAssessmentsComponent', () => {
  let component: SubmittedAssessmentsComponent;
  let fixture: ComponentFixture<SubmittedAssessmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmittedAssessmentsComponent]
    });
    fixture = TestBed.createComponent(SubmittedAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
