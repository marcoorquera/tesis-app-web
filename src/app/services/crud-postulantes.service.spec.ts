import { TestBed } from '@angular/core/testing';

import { CrudPostulantesService } from './crud-postulantes.service';

describe('CrudPostulantesService', () => {
  let service: CrudPostulantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudPostulantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
