// http-metrics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MetricsOtelService } from './metrics-otel.service';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpMetricsService {
  private requestHistogram;
  private requestCounter;

  constructor(
    private http: HttpClient,
    private metricsService: MetricsOtelService
  ) {
    const meter = this.metricsService.getMeter();

    // Define el histograma para medir la duración de las peticiones HTTP
    this.requestHistogram = meter.createHistogram(
      'http_request_duration_seconds',
      {
        description: 'Measures the duration of HTTP requests in seconds',
      }
    );

    // Define el contador para contar peticiones agrupadas por estado
    this.requestCounter = meter.createCounter('http_request_status_count', {
      description: 'Counts the number of HTTP requests by status code',
    });
  }

  // Método para hacer peticiones GET con métricas
  get<T>(url: string): Observable<T> {
    const startTime = performance.now();

    return this.http
      .get<T>(url, { headers: { 'Cache-Control': 'no-cache' } })
      .pipe(
        tap(() => {
          const endTime = performance.now();
          const duration = (endTime - startTime) / 1000;

          // Registra la duración de la petición en el histograma
          this.requestHistogram.record(duration, {
            method: 'GET',
            status: '200',
            url,
          });
          // Incrementa el contador de éxito (200)
          this.requestCounter.add(1, { method: 'GET', status: '200', url });
        }),
        catchError((error) => {
          const statusCode = error.status || 'unknown';
          this.requestCounter.add(1, {
            method: 'GET',
            status: statusCode.toString(),
            url,
          });
          throw error; // Re-lanzamos el error para que pueda manejarse externamente
        })
      );
  }

  // Método para hacer peticiones POST con métricas
  post<T>(url: string, body: any): Observable<T> {
    const startTime = performance.now();

    return this.http.post<T>(url, body).pipe(
      tap(() => {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;

        // Registra la duración de la petición en el histograma
        this.requestHistogram.record(duration, {
          method: 'POST',
          status: '200',
          url,
        });
        // Incrementa el contador de éxito (200)
        this.requestCounter.add(1, { method: 'POST', status: '200', url });
      }),
      catchError((error) => {
        const statusCode = error.status || 'unknown';
        this.requestCounter.add(1, {
          method: 'POST',
          status: statusCode.toString(),
          url,
        });
        throw error; // Re-lanzamos el error para que pueda manejarse externamente
      })
    );
  }
}
