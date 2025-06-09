import { Logger } from '../../infrastructure/logger';

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  details?: Record<string, any>;
}

export interface PerformanceBenchmark {
  operation: string;
  samples: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  standardDeviation: number;
}

export interface IPerformanceMonitor {
  startTimer(operationName: string): string;
  endTimer(timerId: string, details?: Record<string, any>): PerformanceMetric;
  benchmark(operation: () => Promise<void>, operationName: string, samples: number): Promise<PerformanceBenchmark>;
  getMetrics(): PerformanceMetric[];
  clearMetrics(): void;
}

export class PerformanceMonitor implements IPerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private activeTimers = new Map<string, number>();

  constructor(private logger: Logger) {}

  startTimer(operationName: string): string {
    const timerId = `${operationName}-${Date.now()}-${Math.random()}`;
    this.activeTimers.set(timerId, performance.now());
    this.logger.log(`Started timer for ${operationName}`);
    return timerId;
  }

  endTimer(timerId: string, details?: Record<string, any>): PerformanceMetric {
    const startTime = this.activeTimers.get(timerId);
    if (!startTime) {
      throw new Error(`Timer ${timerId} not found`);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    this.activeTimers.delete(timerId);

    const metric: PerformanceMetric = {
      name: timerId.split('-')[0],
      duration,
      timestamp: Date.now(),
      details
    };

    this.metrics.push(metric);
    this.logger.log(`${metric.name} completed in ${duration.toFixed(2)}ms`, details);
    
    return metric;
  }

  async benchmark(operation: () => Promise<void>, operationName: string, samples: number): Promise<PerformanceBenchmark> {
    this.logger.log(`Starting benchmark for ${operationName} with ${samples} samples`);
    
    const durations: number[] = [];
    
    for (let i = 0; i < samples; i++) {
      const timerId = this.startTimer(`${operationName}-benchmark-${i}`);
      
      try {
        await operation();
        const metric = this.endTimer(timerId);
        durations.push(metric.duration);
        
        // Add small delay between samples
        await this.delay(100);
      } catch (error) {
        this.logger.error(`Benchmark sample ${i} failed`, error);
        this.activeTimers.delete(timerId);
      }
    }

    if (durations.length === 0) {
      throw new Error(`All benchmark samples failed for ${operationName}`);
    }

    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    
    const variance = durations.reduce((sum, d) => sum + Math.pow(d - averageDuration, 2), 0) / durations.length;
    const standardDeviation = Math.sqrt(variance);

    const benchmark: PerformanceBenchmark = {
      operation: operationName,
      samples: durations.length,
      averageDuration,
      minDuration,
      maxDuration,
      standardDeviation
    };

    this.logger.log(`Benchmark results for ${operationName}:`, benchmark);
    return benchmark;
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics.length = 0;
    this.activeTimers.clear();
    this.logger.log('Performance metrics cleared');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}