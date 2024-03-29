import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsReportComponent } from './metrics-report.component';

describe('MetricsReportComponent', () => {
  let component: MetricsReportComponent;
  let fixture: ComponentFixture<MetricsReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetricsReportComponent]
    });
    fixture = TestBed.createComponent(MetricsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
