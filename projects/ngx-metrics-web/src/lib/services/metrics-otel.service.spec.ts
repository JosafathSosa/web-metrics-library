import { TestBed } from '@angular/core/testing';

import { MetricsOtelService } from './metrics-otel.service';

describe('MetricsOtelService', () => {
  let service: MetricsOtelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricsOtelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
