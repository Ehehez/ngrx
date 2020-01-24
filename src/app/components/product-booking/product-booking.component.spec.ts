import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBookingComponent } from './product-booking.component';

describe('ProductBookingComponent', () => {
  let component: ProductBookingComponent;
  let fixture: ComponentFixture<ProductBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
