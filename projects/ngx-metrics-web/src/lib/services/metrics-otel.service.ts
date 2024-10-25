import { Injectable } from '@angular/core';
//Importaciones de OpenTelemetry
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';

@Injectable({
  providedIn: 'root',
})
export class MetricsOtelService {
  private metricExporter: OTLPMetricExporter;
  private meterProvider: MeterProvider;
  private meter: any;
  constructor() {
    // Configuración de OpenTelemetry para exportar a OpenTelemetry Collector
    this.metricExporter = new OTLPMetricExporter({
      url: 'http://localhost:4318/v1/metrics', // URL del OpenTelemetry Collector
    });

    // Proveedor de métricas con el exportador configurado
    this.meterProvider = new MeterProvider({
      resource: new Resource({
        'service.name': 'angular-app', // Nombre del servicio
      }),
      readers: [
        new PeriodicExportingMetricReader({
          exporter: this.metricExporter,
          exportIntervalMillis: 1000, // Intervalo de exportación (1s)
        }),
      ],
    });

    // Definir el medidor (meter)
    this.meter = this.meterProvider.getMeter('angular-app');
  }

  public getMeter() {
    return this.meter;
  }
}
