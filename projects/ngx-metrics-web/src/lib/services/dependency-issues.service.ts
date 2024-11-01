import { Injectable } from '@angular/core';
import { MetricsOtelService } from './metrics-otel.service';

@Injectable({
  providedIn: 'root',
})
export class DependencyIssuesService {
  private meter: any;

  constructor(private metricsService: MetricsOtelService) {
    this.meter = metricsService.getMeter();
  }
  /**
   * Verifica y maneja las dependencias en el componente.
   * Envía métricas de error si faltan dependencias y retorna los problemas encontrados.
   *
   * @param component Instancia del componente donde se esperan las dependencias.
   * @param metricName Nombre de la métrica a registrar.
   * @param metricDescription Descripción de la métrica para identificarla en Prometheus.
   * @returns Array de strings con problemas encontrados, si existen.
   */

  verifyAndHandleDependencies(
    component: any,
    metricName: string = 'dependency_issues',
    description: string = 'Número de problemas detectados en dependencias'
  ) {
    const issues: string[] = [];
    const dependencyIssuesCounter = this.meter.createCounter(metricName, {
      description,
    });

    // Verificar si las dependencias de Web Vitals están presentes en el componente
    if (!component.onLCP) {
      issues.push('onLCP no está importado ni utilizado en el componente');
    }
    if (!component.onINP) {
      issues.push('onINP no está importado ni utilizado en el componente');
    }
    if (!component.onCLS) {
      issues.push('onCLS no está importado ni utilizado en el componente');
    }
    if (!component.onTTFB) {
      issues.push('onTTFB no está importado ni utilizado en el componente');
    }
    if (!component.onFCP) {
      issues.push('onFCP no está importado ni utilizado en el componente');
    }

    issues.forEach((issue) => {
      console.error('Problema detectado:', issue);
      dependencyIssuesCounter.add(1, { issue });
    });

    return issues;
  }
}
