import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentslistComponent } from './assessmentslist.component';

describe('AssessmentslistComponent', () => {
  let component: AssessmentslistComponent;
  let fixture: ComponentFixture<AssessmentslistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentslistComponent]
    });
    fixture = TestBed.createComponent(AssessmentslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
