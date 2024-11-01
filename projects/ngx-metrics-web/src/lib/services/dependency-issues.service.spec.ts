import { TestBed } from '@angular/core/testing';

import { DependencyIssuesService } from './dependency-issues.service';

describe('DependencyIssuesService', () => {
  let service: DependencyIssuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DependencyIssuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
