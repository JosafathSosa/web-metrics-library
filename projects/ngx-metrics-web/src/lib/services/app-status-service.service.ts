import { Injectable, OnDestroy } from '@angular/core';
import { MetricsOtelService } from './metrics-otel.service';

import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStatusService implements OnDestroy {
  private appStatusGauge: any;
  private appStatusSubscription: any;

  constructor(private metricsService: MetricsOtelService) {
    // Configura el evento `beforeunload` para enviar el estado inactivo (0) al cerrar la aplicación
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  /**
   * Inicia el seguimiento del estado activo de la aplicación y envía una métrica periódica.
   *
   * @param metricName Nombre de la métrica a registrar.
   * @param metricDescription Descripción de la métrica para identificarla.
   */
  startTrackingStatus(metricName: string, metricDescription: string) {
    // Crear el ObservableGauge para el estado de la aplicación con el nombre y descripción dados
    const meter = this.metricsService.getMeter();
    this.appStatusGauge = meter.createObservableGauge(metricName, {
      description: metricDescription,
    });

    // Establece la métrica de estado activo (1)
    this.appStatusGauge.addCallback((observableResult: any) => {
      observableResult.observe(1); // Estado activo de la aplicación
    });

    // Envía la métrica periódicamente mientras la aplicación esté activa
    this.appStatusSubscription = interval(15000).subscribe(() => {
      console.log(
        `Aplicación activa, enviando métrica de estado "${metricName}".`
      );
    });
  }

  /**
   * Envía el estado inactivo (0) cuando se cierra o recarga la aplicación.
   */
  private handleBeforeUnload = (event: BeforeUnloadEvent) => {
    console.log('Enviando métrica de estado 0 antes de cerrar o recargar.');

    // Cambia el estado de la aplicación a inactivo (0), si la métrica ha sido inicializada
    if (this.appStatusGauge) {
      this.appStatusGauge.addCallback((observableResult: any) => {
        observableResult.observe(0);
      });
    }

    // Asegura que el evento `beforeunload` siga su curso normal
    event.preventDefault();
    event.returnValue = '';
  };

  /**
   * Detiene el seguimiento del estado de la aplicación y limpia los recursos.
   */
  ngOnDestroy() {
    if (this.appStatusSubscription) {
      this.appStatusSubscription.unsubscribe();
    }
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    console.log('AppStatusService destruido y recursos liberados');
  }
}
