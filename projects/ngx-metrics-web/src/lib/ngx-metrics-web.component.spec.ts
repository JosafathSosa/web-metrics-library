import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMetricsWebComponent } from './ngx-metrics-web.component';

describe('NgxMetricsWebComponent', () => {
  let component: NgxMetricsWebComponent;
  let fixture: ComponentFixture<NgxMetricsWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMetricsWebComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxMetricsWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
