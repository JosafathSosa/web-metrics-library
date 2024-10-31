import { TestBed } from '@angular/core/testing';

import { ComponentMetricsServiceService } from './component-metrics-service.service';

describe('ComponentMetricsServiceService', () => {
  let service: ComponentMetricsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentMetricsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
