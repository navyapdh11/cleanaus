import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';

@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  info() {
    return {
      name: 'CleanAUS Enterprise API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      status: 'running',
      documentation: '/api/docs',
      health: '/health',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @HealthCheck()
  check() {
    return this.health.check([
      // Database check disabled - TypeORM not configured in demo mode
      // () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  readiness() {
    // In production, check database connectivity
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
    ]);
  }

  @Get('live')
  @HealthCheck()
  liveness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
    ]);
  }
}
