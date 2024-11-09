import { TestBed } from '@angular/core/testing';

import { ExportationService } from './exportation.service';

describe('ExportationService', () => {
  let service: ExportationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
