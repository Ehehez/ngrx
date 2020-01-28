import { TestBed } from '@angular/core/testing';

import { AccesoBDService } from './acceso-bd.service';

describe('AccesoBDService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccesoBDService = TestBed.get(AccesoBDService);
    expect(service).toBeTruthy();
  });
});
