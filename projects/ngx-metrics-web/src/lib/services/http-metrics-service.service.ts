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

    // Define un histograma para medir la duración de las solicitudes HTTP en segundos
    this.requestHistogram = meter.createHistogram(
      'http_request_duration_seconds',
      {
        description: 'Mide la duración de las solicitudes HTTP en segundos',
      }
    );

    // Define un contador para registrar el número de solicitudes HTTP agrupadas por estado
    this.requestCounter = meter.createCounter('http_request_status_count', {
      description: 'Cuenta el número de solicitudes HTTP por código de estado',
    });
  }

  /**
   * Realiza una solicitud HTTP GET y registra métricas de duración y estado.
   * @param url - URL de destino de la solicitud GET
   * @returns Observable con el tipo de respuesta esperado
   */
  get<T>(url: string): Observable<T> {
    const startTime = performance.now(); // Marca el inicio de la solicitud

    return this.http
      .get<T>(url, { headers: { 'Cache-Control': 'no-cache' } })
      .pipe(
        tap(() => {
          const endTime = performance.now(); // Marca el fin de la solicitud
          const duration = (endTime - startTime) / 1000; // Duración en segundos

          // Registra la duración de la solicitud en el histograma
          this.requestHistogram.record(duration, {
            method: 'GET',
            status: '200',
            url,
          });
          // Incrementa el contador para solicitudes exitosas (código 200)
          this.requestCounter.add(1, { method: 'GET', status: '200', url });
        }),
        catchError((error) => {
          // Captura y maneja errores, registrando el código de estado si existe
          const statusCode = error.status || 'unknown';
          this.requestCounter.add(1, {
            method: 'GET',
            status: statusCode.toString(),
            url,
          });
          throw error; // Lanza el error para su manejo externo
        })
      );
  }

  /**
   * Realiza una solicitud HTTP POST y registra métricas de duración y estado.
   * @param url - URL de destino de la solicitud POST
   * @param body - Cuerpo de la solicitud POST
   * @returns Observable con el tipo de respuesta esperado
   */
  post<T>(url: string, body: any): Observable<T> {
    const startTime = performance.now(); // Marca el inicio de la solicitud

    return this.http.post<T>(url, body).pipe(
      tap(() => {
        const endTime = performance.now(); // Marca el fin de la solicitud
        const duration = (endTime - startTime) / 1000; // Duración en segundos

        // Registra la duración de la solicitud en el histograma
        this.requestHistogram.record(duration, {
          method: 'POST',
          status: '200',
          url,
        });
        // Incrementa el contador para solicitudes exitosas (código 200)
        this.requestCounter.add(1, { method: 'POST', status: '200', url });
      }),
      catchError((error) => {
        // Captura y maneja errores, registrando el código de estado si existe
        const statusCode = error.status || 'unknown';
        this.requestCounter.add(1, {
          method: 'POST',
          status: statusCode.toString(),
          url,
        });
        throw error; // Lanza el error para su manejo externo
      })
    );
  }
}
