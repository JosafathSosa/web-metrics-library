import { TestBed } from '@angular/core/testing';

import { ComponentMetricsService } from './component-metrics-service.service';

describe('ComponentMetricsService', () => {
  let service: ComponentMetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentMetricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
