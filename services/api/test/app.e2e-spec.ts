import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API E2E Tests (Critical Paths)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBeDefined();
        });
    });
  });

  describe('/regions (GET)', () => {
    it('should return all Australian regions', () => {
      return request(app.getHttpServer())
        .get('/regions')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(8);
          const codes = res.body.map((r: any) => r.code);
          expect(codes).toContain('NSW');
          expect(codes).toContain('VIC');
          expect(codes).toContain('QLD');
        });
    });
  });

  describe('/services (GET)', () => {
    it('should return available services', () => {
      return request(app.getHttpServer())
        .get('/services')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('basePrice');
        });
    });
  });

  describe('/pricing/calculate (POST)', () => {
    it('should calculate pricing for a booking', () => {
      return request(app.getHttpServer())
        .post('/pricing/calculate')
        .send({
          regionCode: 'NSW',
          date: '2026-04-10',
          time: '10:00',
          bedrooms: 3,
          bathrooms: 2,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('basePrice');
          expect(res.body).toHaveProperty('gstAmount');
          expect(res.body).toHaveProperty('finalTotal');
          expect(res.body.currency).toBe('AUD');
          expect(res.body.gstIncluded).toBe(true);
        });
    });
  });

  describe('/staff (GET)', () => {
    it('should return staff members', () => {
      return request(app.getHttpServer())
        .get('/staff')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('firstName');
          expect(res.body[0]).toHaveProperty('qualityScore');
        });
    });
  });
});
