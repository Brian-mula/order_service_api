import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let jwt: string;
  let adminJwt: string;
  let createdOrderId: string;
  const clientToken = 'test-client-token';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const server: any = app.getHttpServer();
    const router = server._events?.request?._router;

    if (router?.stack) {
      console.log(
        'Registered routes:',
        router.stack
          .filter((r: any) => r.route)
          .map((r: any) => ({
            path: r.route.path,
            methods: Object.keys(r.route.methods),
          }))
      );
    }

    
  });

  afterAll(async () => {
    await app.close();
  
    // If you want to be extra safe:
    const dataSource = app.get(DataSource);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should signup and login a user', async () => {
    console.log(`server url: ${JSON.stringify(app.getHttpServer())}`);
     await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'abcd@test.com', password: 'password' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'abcd@test.com', password: 'password' })
      .expect(201);

      console.log(`login response: ${JSON.stringify(res.body)}`);
    jwt = res.body.access_token;
    expect(jwt).toBeDefined();
  });

  // admin user

  it('should login as admin', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'abcd@test.com', password: 'password', role: 'admin' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'abcd@test.com', password: 'password' })
      .expect(201);
    adminJwt = res.body.access_token;
    expect(jwt).toBeDefined();
  });

  it('should create an order and return same order if client_token is reused', async () => {
    const res1 = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ items: [{ sku: 'ABC123', quantity: 2 }], clientToken: clientToken })
      .expect(201);

    const res2 = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ items: [{ sku: 'ABC123', quantity: 2 }], clientToken: clientToken })
      .expect(201);

    expect(res1.body.id).toEqual(res2.body.id);
    createdOrderId = res1.body.id;
  });

  it('should forbid a USER from updating order status', async () => {
    await request(app.getHttpServer())
      .patch(`/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({ status: 'PAID' })
      .expect(403);
  });

  it('should allow ADMIN to update order status', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminJwt}`)
      .send({ status: 'PAID' })
      .expect(200);

    expect(res.body.status).toBe('PAID');
  });

  it('should handle concurrency conflicts', async () => {
    // Fetch order twice
    const order1 = await request(app.getHttpServer())
      .get(`/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${adminJwt}`)
      .expect(200);

    const order2 = await request(app.getHttpServer())
      .get(`/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${adminJwt}`)
      .expect(200);

    // First update succeeds
    await request(app.getHttpServer())
      .patch(`/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminJwt}`)
      .send({ status: 'CANCELLED', version: order1.body.version })
      .expect(200);

    // Second update with stale version should fail
    await request(app.getHttpServer())
      .patch(`/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminJwt}`)
      .send({ status: 'PENDING', version: order2.body.version })
      .expect(409);
  });
});
