import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentHistoryComponent } from './assessment-history.component';

describe('AssessmentHistoryComponent', () => {
  let component: AssessmentHistoryComponent;
  let fixture: ComponentFixture<AssessmentHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentHistoryComponent]
    });
    fixture = TestBed.createComponent(AssessmentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
