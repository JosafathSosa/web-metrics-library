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

   /**
   * Configura un contador de visitas para la página o componente actual.
   * Este contador registra la cantidad de veces que la página o componente ha sido visitado.
   * @param name - Nombre del contador (predeterminado: 'page_visit_counter')
   * @param description - Descripción del contador
   */
  configureVisitCounter(
    name: string = 'page_visit_counter',
    description: string = 'Number of page visits'
  ) {
    this.visitCounter = this.meter.createCounter(name, { description });
  }

   /**
   * Incrementa el contador de visitas en uno para un componente específico.
   * @param componentName - Nombre del componente que se está visitando
   */
  trackVisit(componentName: string) {
    if (this.visitCounter) {
      this.visitCounter.add(1, { page: componentName });
    } else {
      console.warn('Visit counter not configured.');
    }
  }

   /**
   * Inicia el tiempo de la sesión del usuario, usando `performance.now()` para obtener la marca de tiempo inicial.
   */
  startSession() {
    this.sessionStartTime = performance.now();
  }

  /**
   * Finaliza la sesión y registra su duración en el histograma correspondiente.
   * @param name - Nombre del histograma de duración de la sesión
   * @param description - Descripción del histograma
   */
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

   /**
   * Finaliza el tiempo de renderizado y registra el tiempo en el histograma de renderizado.
   * @param name - Nombre del histograma de tiempo de renderizado
   * @param description - Descripción del histograma
   */
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

   /**
   * Configura un histograma para registrar el tiempo de renderizado de un componente.
   * @param name - Nombre del histograma
   * @param description - Descripción del histograma
   * @param unit - Unidad de tiempo (e.g., 'ms' para milisegundos)
   */
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

    /**
   * Registra el tiempo de renderizado en el histograma configurado.
   * @param duration - Duración en ms del tiempo de renderizado
   */
  trackRenderTime(duration: number) {
    if (this.renderTimeHistogram) {
      this.renderTimeHistogram.record(duration, {
        component: 'current-component',
      });
    } else {
      console.warn('Render time histogram not configured.');
    }
  }

   /**
   * Configura un histograma para registrar la duración de una sesión de usuario.
   * @param name - Nombre del histograma
   * @param description - Descripción del histograma
   * @param unit - Unidad de tiempo (e.g., 's' para segundos)
   */
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

   /**
   * Registra la duración de una sesión en el histograma configurado.
   * @param duration - Duración de la sesión en segundos
   */
  configureMemoryUsage(
    name: string = 'memory_usage_histogram',
    description: string = 'Memory usage of component in MB'
  ) {
    this.memoryUsageHistogram = this.meter.createHistogram(name, {
      description,
      unit: 'MB',
    });
  }

    /**
   * Configura un histograma para registrar el uso de memoria de un componente.
   * @param name - Nombre del histograma (predeterminado: 'memory_usage_histogram')
   * @param description - Descripción del histograma
   */
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

  
  /**
   * Registra el uso de memoria actual en el histograma configurado.
   */
  private getCurrentMemoryUsage(): number {
    if (performance && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // Convertir a MB
    }
    return 0;
  }
}
