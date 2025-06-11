import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayvoucherComponent } from './payvoucher.component';

describe('PayvoucherComponent', () => {
  let component: PayvoucherComponent;
  let fixture: ComponentFixture<PayvoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayvoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
