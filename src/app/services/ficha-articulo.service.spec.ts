import { TestBed } from '@angular/core/testing';

import { FichaArticuloService } from './ficha-articulo.service';

describe('FichaArticuloService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FichaArticuloService = TestBed.get(FichaArticuloService);
    expect(service).toBeTruthy();
  });
});
