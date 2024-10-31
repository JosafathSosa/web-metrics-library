// component-metrics.service.ts
import { Injectable } from '@angular/core';
import { MetricsOtelService } from './metrics-otel.service';

@Injectable({
  providedIn: 'root',
})
export class ComponentMetricsService {
  private meter;
  private visitCounter: any;
  private renderTimeHistogram: any;
  private memoryUsageHistogram: any;
  private sessionDurationHistogram: any;

  // Variables internas para seguimiento de tiempo
  private sessionStartTime!: number;
  private renderStartTime!: number;

  constructor(private metricsService: MetricsOtelService) {
    this.meter = this.metricsService.getMeter();
  }

  // Configurar y registrar contador de visitas
  configureVisitCounter(
    name: string = 'page_visit_counter',
    description: string = 'Number of page visits'
  ) {
    this.visitCounter = this.meter.createCounter(name, { description });
  }

  trackVisit(componentName: string) {
    if (this.visitCounter) {
      this.visitCounter.add(1, { page: componentName });
    } else {
      console.warn('Visit counter not configured.');
    }
  }

  // Inicia el seguimiento del tiempo de sesión
  startSession() {
    this.sessionStartTime = performance.now();
  }

  // Finaliza la sesión y registra la duración
  endSession(
    name: string = 'session_duration_histogram',
    description: string = 'Duration of user session'
  ) {
    if (!this.sessionStartTime) {
      console.warn('Session has not been started.');
      return;
    }
    const sessionDuration = (performance.now() - this.sessionStartTime) / 1000; // Convertir a segundos
    this.configureSessionDurationHistogram(name, description, 's');
    this.trackSessionDuration(sessionDuration);
  }

  // Inicia el seguimiento del tiempo de renderizado
  startRender() {
    this.renderStartTime = performance.now();
  }

  // Finaliza el tiempo de renderizado y lo registra
  endRender(
    name: string = 'render_time_histogram',
    description: string = 'Render time of component'
  ) {
    if (!this.renderStartTime) {
      console.warn('Render time has not been started.');
      return;
    }
    const renderTime = performance.now() - this.renderStartTime; // Tiempo en milisegundos
    this.configureRenderTimeHistogram(name, description, 'ms');
    this.trackRenderTime(renderTime);
  }

  // Configurar y registrar histograma de tiempo de renderizado
  configureRenderTimeHistogram(
    name: string,
    description: string,
    unit: string
  ) {
    this.renderTimeHistogram = this.meter.createHistogram(name, {
      description,
      unit,
    });
  }

  trackRenderTime(duration: number) {
    if (this.renderTimeHistogram) {
      this.renderTimeHistogram.record(duration, {
        component: 'current-component',
      });
    } else {
      console.warn('Render time histogram not configured.');
    }
  }

  // Configurar y registrar histograma de duración de la sesión
  configureSessionDurationHistogram(
    name: string,
    description: string,
    unit: string
  ) {
    this.sessionDurationHistogram = this.meter.createHistogram(name, {
      description,
      unit,
    });
  }

  trackSessionDuration(duration: number) {
    if (this.sessionDurationHistogram) {
      this.sessionDurationHistogram.record(duration, { user: 'current-user' });
    } else {
      console.warn('Session duration histogram not configured.');
    }
  }

  // Configurar y registrar el histograma de uso de memoria
  configureMemoryUsage(
    name: string = 'memory_usage_histogram',
    description: string = 'Memory usage of component in MB'
  ) {
    this.memoryUsageHistogram = this.meter.createHistogram(name, {
      description,
      unit: 'MB',
    });
  }

  trackMemoryUsage() {
    if (this.memoryUsageHistogram) {
      const memoryUsage = this.getCurrentMemoryUsage();
      this.memoryUsageHistogram.record(memoryUsage, {
        component: 'current-component',
      });
    } else {
      console.warn('Memory usage histogram not configured.');
    }
  }

  // Obtener el uso de memoria actual en MB
  private getCurrentMemoryUsage(): number {
    if (performance && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // Convertir a MB
    }
    return 0;
  }
}
