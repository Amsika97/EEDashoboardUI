import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmeteicsComponent } from './addmeteics.component';

describe('AddmeteicsComponent', () => {
  let component: AddmeteicsComponent;
  let fixture: ComponentFixture<AddmeteicsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddmeteicsComponent]
    });
    fixture = TestBed.createComponent(AddmeteicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
