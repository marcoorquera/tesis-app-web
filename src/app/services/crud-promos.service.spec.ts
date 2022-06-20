import { TestBed } from '@angular/core/testing';

import { CrudPromosService } from './crud-promos.service';

describe('CrudPromosService', () => {
  let service: CrudPromosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudPromosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
