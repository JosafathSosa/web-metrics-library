import { TestBed } from '@angular/core/testing';

import { AppStatusServiceService } from './app-status-service.service';

describe('AppStatusServiceService', () => {
  let service: AppStatusServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStatusServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
