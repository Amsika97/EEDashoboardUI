import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsReportComponent } from './assessments-report.component';

describe('AssessmentsReportComponent', () => {
  let component: AssessmentsReportComponent;
  let fixture: ComponentFixture<AssessmentsReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentsReportComponent]
    });
    fixture = TestBed.createComponent(AssessmentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
