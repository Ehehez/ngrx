import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaArticuloComponent } from './ficha-articulo.component';

describe('FichaArticuloComponent', () => {
  let component: FichaArticuloComponent;
  let fixture: ComponentFixture<FichaArticuloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaArticuloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
