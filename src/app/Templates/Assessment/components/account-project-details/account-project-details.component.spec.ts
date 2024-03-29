import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountProjectDetailsComponent } from './account-project-details.component';

describe('AccountProjectDetailsComponent', () => {
  let component: AccountProjectDetailsComponent;
  let fixture: ComponentFixture<AccountProjectDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountProjectDetailsComponent]
    });
    fixture = TestBed.createComponent(AccountProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
