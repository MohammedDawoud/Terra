import { ComponentFixture, TestBed } from '@angular/core/testing';

import { purchaseComponent } from './purchase.component';

describe('purchaseComponent', () => {
  let component: purchaseComponent;
  let fixture: ComponentFixture<purchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ purchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(purchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
