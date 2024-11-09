import { TestBed } from '@angular/core/testing';

import { SystemactionService } from './systemaction.service';

describe('SystemactionService', () => {
  let service: SystemactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
