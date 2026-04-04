import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { trace, context, propagation } from '@opentelemetry/api';

@Injectable()
export class OpenTelemetryService implements OnModuleInit {
  private tracer = trace.getTracer('cleanaus-api');
  private isEnabled = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.isEnabled = this.configService.get('OTEL_ENABLED', false);
  }

  initialize(): void {
    if (this.isEnabled) {
      console.log('OpenTelemetry initialized');
    }
  }

  getTracer() {
    return this.tracer;
  }

  /**
   * Create a span for tracing operations
   */
  createSpan(name: string, attributes?: Record<string, string>) {
    const span = this.tracer.startSpan(name);
    
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        span.setAttribute(key, value);
      });
    }

    return span;
  }

  /**
   * Execute a function within a traced context
   */
  async trace<T>(name: string, fn: (span: any) => Promise<T>): Promise<T> {
    const span = this.createSpan(name);
    
    try {
      const result = await fn(span);
      span.setStatus({ code: 1 }); // OK
      return result;
    } catch (error) {
      span.setStatus({ code: 2, message: error.message }); // ERROR
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  }

  /**
   * Get current context for propagation
   */
  getCurrentContext() {
    return context.active();
  }

  /**
   * Inject tracing headers into outgoing request
   */
  injectHeaders(headers: Record<string, string>): Record<string, string> {
    propagation.inject(context.active(), headers);
    return headers;
  }
}
