import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricslistComponent } from './metricslist.component';

describe('MetricslistComponent', () => {
  let component: MetricslistComponent;
  let fixture: ComponentFixture<MetricslistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetricslistComponent]
    });
    fixture = TestBed.createComponent(MetricslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
