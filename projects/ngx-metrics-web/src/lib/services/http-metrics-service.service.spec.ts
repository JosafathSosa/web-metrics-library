import { TestBed } from '@angular/core/testing';

import { HttpMetricsService } from './http-metrics-service.service';

describe('HttpMetricsService', () => {
  let service: HttpMetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpMetricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
