import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsGuideComponent } from './accounts-guide.component';

describe('AccountsGuideComponent', () => {
  let component: AccountsGuideComponent;
  let fixture: ComponentFixture<AccountsGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsGuideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
