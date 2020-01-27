import { TestBed } from '@angular/core/testing';

import { ShopcartService } from './shopcart.service';

describe('ShopcartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopcartService = TestBed.get(ShopcartService);
    expect(service).toBeTruthy();
  });
});
