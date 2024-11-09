import { TestBed } from '@angular/core/testing';

import { SysServicesService } from './sys-services.service';

describe('SysServicesService', () => {
  let service: SysServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SysServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
