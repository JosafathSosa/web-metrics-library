import { TestBed } from '@angular/core/testing';

import { HttpMetricsServiceService } from './http-metrics-service.service';

describe('HttpMetricsServiceService', () => {
  let service: HttpMetricsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpMetricsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
