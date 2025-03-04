import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevoucherComponent } from './revoucher.component';

describe('RevoucherComponent', () => {
  let component: RevoucherComponent;
  let fixture: ComponentFixture<RevoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
