import { TestBed } from '@angular/core/testing';

import { GroupPrivilegeService } from './group-privilege.service';

describe('GroupPrivilegeService', () => {
  let service: GroupPrivilegeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupPrivilegeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
