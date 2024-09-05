import { TestBed } from '@angular/core/testing';

import { ProducttypeService } from './producttype.service';

describe('ProducttypeService', () => {
  let service: ProducttypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProducttypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
