import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedAssessmentsComponent } from './saved-assessments.component';

describe('SavedAssessmentsComponent', () => {
  let component: SavedAssessmentsComponent;
  let fixture: ComponentFixture<SavedAssessmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedAssessmentsComponent]
    });
    fixture = TestBed.createComponent(SavedAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
