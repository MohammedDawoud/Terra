import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenvoucherComponent } from './openvoucher.component';

describe('OpenvoucherComponent', () => {
  let component: OpenvoucherComponent;
  let fixture: ComponentFixture<OpenvoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenvoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
