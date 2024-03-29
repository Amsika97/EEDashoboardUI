import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerDetailsComponent } from './reviewer-details.component';

describe('ReviewerDetailsComponent', () => {
  let component: ReviewerDetailsComponent;
  let fixture: ComponentFixture<ReviewerDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewerDetailsComponent]
    });
    fixture = TestBed.createComponent(ReviewerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
