// Importación de Angular y de la biblioteca web-vitals
import { Injectable } from '@angular/core';
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import { MetricsOtelService } from './metrics-otel.service';

@Injectable({
  providedIn: 'root',
})
export class WebVitalsService {
  private lcpHistogram: any; // Histograma para LCP
  private clsHistogram: any; // Histograma para CLS
  private fcpHistogram: any; // Histograma para FCP
  private ttfbHistogram: any; // Histograma para TTFB
  private inpHistogram: any; // Histograma para INP

  /**
   * Inicializa el servicio de métricas y crea histogramas para cada métrica de Web Vitals.
   * @param metricsService - Servicio de métricas de OpenTelemetry (MetricsOtelService)
   */
  constructor(private metricsService: MetricsOtelService) {
    const meter = metricsService.getMeter();

    // Crear histogramas para almacenar las métricas de Web Vitals
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

  /**
   * Inicia la recopilación de métricas Web Vitals, registrando los valores en los histogramas.
   */
  public startWebVitalsCollection(): void {
    // Configura el evento para registrar la métrica de LCP (Largest Contentful Paint)
    onLCP((metric) => {
      this.lcpHistogram.record(metric.value, {
        name: metric.name, // Nombre de la métrica
        rating: metric.rating, // Clasificación de la métrica
      });
    });

    // Configura el evento para registrar la métrica de CLS (Cumulative Layout Shift)
    onCLS((metric) => {
      this.clsHistogram.record(metric.value, {
        name: metric.name,
        rating: metric.rating,
      });
    });

    // Configura el evento para registrar la métrica de FCP (First Contentful Paint)
    onFCP((metric) => {
      this.fcpHistogram.record(metric.value, {
        name: metric.name,
        rating: metric.rating,
      });
    });

    // Configura el evento para registrar la métrica de TTFB (Time to First Byte)
    onTTFB((metric) => {
      this.ttfbHistogram.record(metric.value, {
        name: metric.name,
        rating: metric.rating,
      });
    });

    // Configura el evento para registrar la métrica de INP (Interaction to Next Paint)
    onINP((metric) => {
      this.inpHistogram.record(metric.value, {
        name: metric.name,
        rating: metric.rating,
      });
    });
  }
}
