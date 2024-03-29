import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingMetricsComponent } from './pending-metrics.component';

describe('PendingMetricsComponent', () => {
  let component: PendingMetricsComponent;
  let fixture: ComponentFixture<PendingMetricsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingMetricsComponent]
    });
    fixture = TestBed.createComponent(PendingMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
