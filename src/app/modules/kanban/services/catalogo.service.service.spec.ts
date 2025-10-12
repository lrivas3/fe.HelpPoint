import { TestBed } from '@angular/core/testing';

import { CatalogoServiceService } from './catalogo.service.service';

describe('CatalogoServiceService', () => {
  let service: CatalogoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
