import { Injectable } from '@angular/core';
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import { MetricsOtelService } from './metrics-otel.service';

@Injectable({
  providedIn: 'root',
})
export class WebVitalsService {
  private lcpHistogram: any;
  private clsHistogram: any;
  private fcpHistogram: any;
  private ttfbHistogram: any;
  private inpHistogram: any;

  constructor(private metricsService: MetricsOtelService) {
    const meter = metricsService.getMeter();

    // Crear histogramas para cada métrica de Web Vitals
    this.lcpHistogram = meter.createHistogram('lcp', {
      description: 'Largest Contentful Paint',
    });
    this.clsHistogram = meter.createHistogram('cls', {
      description: 'Cumulative Layout Shift',
    });
    this.fcpHistogram = meter.createHistogram('fcp', {
      description: 'First Contentful Paint',
    });
    this.ttfbHistogram = meter.createHistogram('ttfb', {
      description: 'Time to First Byte',
    });
    this.inpHistogram = meter.createHistogram('inp', {
      description: 'Interaction to Next Paint',
    });
  }

  // Método para iniciar la recolección de métricas
  public startWebVitalsCollection(): void {
    onLCP((metric) => {
      this.lcpHistogram.record(metric.value, {
        name: metric.name,
        rating: metric.rating,
      });
    });

    onCLS((metric) => {
      this.clsHistogram.record(metric.value, {
        name: metric.name,
        rating: metric.rating,
      });
    });

    onFCP((metric) => {
      this.fcpHistogram.record(metric.value, {
        name: metric.name,
        rating: metric.rating,
      });
    });

    onTTFB((metric) => {
      this.ttfbHistogram.record(metric.value, {
        name: metric.name,
        rating: metric.rating,
      });
    });

    onINP((metric) => {
      this.inpHistogram.record(metric.value, {
        name: metric.name,
        rating: metric.rating,
      });
    });
  }
}
