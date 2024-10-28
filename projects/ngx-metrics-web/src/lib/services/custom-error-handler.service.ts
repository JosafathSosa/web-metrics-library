import { ErrorHandler, Injectable } from '@angular/core';
import { MetricsOtelService } from './metrics-otel.service'; // Asegúrate de importar el servicio correctamente

@Injectable({
  providedIn: 'root',
})
export class CustomErrorHandlerService implements ErrorHandler {
  private errorCounter;
  private warningCounter;

  constructor(private metricsService: MetricsOtelService) {
    // Utiliza el `meter` de MetricsOtelService
    const meter = this.metricsService.getMeter();
    this.errorCounter = meter.createCounter('error_count', {
      description: 'Número de errores en la aplicación',
    });
    this.warningCounter = meter.createCounter('warning_count', {
      description: 'Número de advertencias en la aplicación',
    });

    // Sobrescribir el comportamiento por defecto de console.warn
    this.overrideConsoleWarn();
  }

  handleError(error: any) {
    // Incrementa la métrica de errores
    this.errorCounter.add(1, { error: error.name || 'UnknownError' });

    // Loguea el error a la consola
    console.error('Se ha producido un error:', error);
  }

  handleWarning(warning: any) {
    this.warningCounter.add(1, {
      warning: warning.message || 'UnknownWarning',
    });

    console.warn('Advertencia detectada:', warning);
  }

  private overrideConsoleWarn(): void {
    const originalWarn = console.warn;
    const customHandler = this;

    console.warn = function (...args: any[]) {
      // Pasar el warning al manejador personalizado
      customHandler.handleWarning({ message: args[0] });

      // Llamar al comportamiento original de console.warn
      originalWarn.apply(console, args);
    };
  }
}
