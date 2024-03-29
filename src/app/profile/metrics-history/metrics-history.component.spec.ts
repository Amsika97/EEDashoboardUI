import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsHistoryComponent } from './metrics-history.component';

describe('MetricsHistoryComponent', () => {
  let component: MetricsHistoryComponent;
  let fixture: ComponentFixture<MetricsHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetricsHistoryComponent]
    });
    fixture = TestBed.createComponent(MetricsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
