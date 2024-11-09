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
   
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  /**
   * Inicia el seguimiento del estado activo de la aplicación y envía una métrica periódica.
   *
   * @param metricName 
   * @param metricDescription 
   */
  startTrackingStatus(metricName: string, metricDescription: string) {
    
    const meter = this.metricsService.getMeter();
    this.appStatusGauge = meter.createObservableGauge(metricName, {
      description: metricDescription,
    });

  
    this.appStatusGauge.addCallback((observableResult: any) => {
      observableResult.observe(1);
    });

    
    this.appStatusSubscription = interval(15000).subscribe(() => {
      console.log(
        `Aplicación activa, enviando métrica de estado "${metricName}".`
      );
    });
  }

  private handleBeforeUnload = (event: BeforeUnloadEvent) => {
    console.log('Enviando métrica de estado 0 antes de cerrar o recargar.');

    
    if (this.appStatusGauge) {
      this.appStatusGauge.addCallback((observableResult: any) => {
        observableResult.observe(0);
      });
    }

    event.preventDefault();
    event.returnValue = '';
  };

  ngOnDestroy() {
    if (this.appStatusSubscription) {
      this.appStatusSubscription.unsubscribe();
    }
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    console.log('AppStatusService destruido y recursos liberados');
  }
}
