import { ErrorHandler, Injectable } from '@angular/core';
import { MetricsOtelService } from './metrics-otel.service'; // Asegúrate de importar el servicio correctamente

@Injectable({
  providedIn: 'root',
})
export class CustomErrorHandlerService implements ErrorHandler {
  private errorCounter;
  private warningCounter;

  constructor(private metricsService: MetricsOtelService) {
    // Crea contadores para errores y advertencias utilizando el `meter` de MetricsOtelService
    const meter = this.metricsService.getMeter();
    
    // Contador de errores que se incrementa cada vez que ocurre un error en la aplicación
    this.errorCounter = meter.createCounter('error_count', {
      description: 'Número de errores en la aplicación',
    });
    
    // Contador de advertencias que se incrementa cada vez que ocurre una advertencia en la aplicación
    this.warningCounter = meter.createCounter('warning_count', {
      description: 'Número de advertencias en la aplicación',
    });

    // Sobrescribe el comportamiento predeterminado de `console.warn` para capturar advertencias personalizadas
    this.overrideConsoleWarn();
  }

  /**
   * Maneja los errores incrementando la métrica de errores y registrándolos en la consola.
   * @param error - Error que será manejado
   */
  handleError(error: any) {
    // Incrementa la métrica de error con el nombre del error o "UnknownError" si no está definido
    this.errorCounter.add(1, { error: error.name || 'UnknownError' });

    // Registra el error en la consola
    console.error('Se ha producido un error:', error);
  }

  /**
   * Maneja advertencias incrementando la métrica de advertencias y registrándolas en la consola.
   * @param warning - Advertencia que será manejada
   */
  handleWarning(warning: any) {
    // Incrementa la métrica de advertencia con el mensaje de advertencia o "UnknownWarning" si no está definido
    this.warningCounter.add(1, {
      warning: warning.message || 'UnknownWarning',
    });

    // Registra la advertencia en la consola
    console.warn('Advertencia detectada:', warning);
  }

  /**
   * Sobrescribe el comportamiento de `console.warn` para capturar advertencias y procesarlas
   * a través de `handleWarning`, además de permitir la ejecución del comportamiento original.
   */
  private overrideConsoleWarn(): void {
    const originalWarn = console.warn; // Guarda el comportamiento original de `console.warn`
    const customHandler = this;

    console.warn = function (...args: any[]) {
      // Envía el warning al manejador personalizado
      customHandler.handleWarning({ message: args[0] });

      // Ejecuta el comportamiento original de `console.warn`
      originalWarn.apply(console, args);
    };
  }
}
