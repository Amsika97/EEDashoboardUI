import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateselectionComponent } from './templateselection.component';

describe('TemplateselectionComponent', () => {
  let component: TemplateselectionComponent;
  let fixture: ComponentFixture<TemplateselectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateselectionComponent]
    });
    fixture = TestBed.createComponent(TemplateselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
