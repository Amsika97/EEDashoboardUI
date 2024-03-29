import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAssessmentsComponent } from './pending-assessments.component';

describe('PendingAssessmentsComponent', () => {
  let component: PendingAssessmentsComponent;
  let fixture: ComponentFixture<PendingAssessmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingAssessmentsComponent]
    });
    fixture = TestBed.createComponent(PendingAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
