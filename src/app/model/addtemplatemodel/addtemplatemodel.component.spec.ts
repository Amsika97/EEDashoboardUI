import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtemplatemodelComponent } from './addtemplatemodel.component';

describe('AddtemplatemodelComponent', () => {
  let component: AddtemplatemodelComponent;
  let fixture: ComponentFixture<AddtemplatemodelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddtemplatemodelComponent]
    });
    fixture = TestBed.createComponent(AddtemplatemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
