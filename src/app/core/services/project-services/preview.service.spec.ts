import { TestBed } from '@angular/core/testing';

import { PreviewService } from './preview.service';

describe('CustomerService', () => {
  let service: PreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
