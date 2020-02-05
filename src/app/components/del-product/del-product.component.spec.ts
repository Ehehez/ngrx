import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelProductComponent } from './del-product.component';

describe('DelProductComponent', () => {
  let component: DelProductComponent;
  let fixture: ComponentFixture<DelProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
