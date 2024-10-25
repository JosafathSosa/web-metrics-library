import { TestBed } from '@angular/core/testing';

import { NgxMetricsWebService } from './ngx-metrics-web.service';

describe('NgxMetricsWebService', () => {
  let service: NgxMetricsWebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxMetricsWebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
