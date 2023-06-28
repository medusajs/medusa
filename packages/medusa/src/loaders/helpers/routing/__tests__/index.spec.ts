import http from 'http';
import { resolve } from 'path';
import request from 'supertest';
import express from 'express';
import archipelago from '../index';

const hookMock = jest.fn();

describe('loadRouter', function() {
    const app = express();
    const server = http.createServer(app);

    beforeAll(async function() {
        await app.listen(3000);
        const rootDir = resolve(__dirname, '__fixtures__/routers');
        await archipelago(app, {
            rootDir,
            onRouteLoading: hookMock,
            strict: true,
        });
    });

    afterAll(function(done) {
        server.close(() => {
            done();
        });
    });

    afterEach(function() {
        jest.clearAllMocks();
    });

    it('should call the route loading hook', async function() {
        expect(hookMock).toHaveBeenCalled();
        // 9 routes but 3 ignored
        expect(hookMock).toHaveBeenCalledTimes(6);
    });

    // eslint-disable-next-line max-len
    it('should return a status 200 on GET admin/order/:id', async function() {
        await request(server).get('/admin/orders/1000')
            .expect(200)
            .expect('hello world');
    });

    // eslint-disable-next-line max-len
    it('should return a status 200 on POST admin/order/:id', async function() {
        await request(server).post('/admin/orders/1000')
            .expect(200)
            .expect('hello world');
    });

    // eslint-disable-next-line max-len
    it('should return a status 404 on GET admin/order/ignore as it have been ignored', async function() {
        await request(server).get('/admin/orders')
            .expect(404);
    });

    // eslint-disable-next-line max-len
    it('should call a multi parameters route and provide the parameters to the handler', async function() {
        await request(server).get('/customers/test-customer/orders/test-order')
            .expect(200)
            // eslint-disable-next-line max-len
            .expect('list customers {"customer_id":"test-customer","order_id":"test-order"}');
    });

    // eslint-disable-next-line max-len
    it('should throw if a route contains the same parameter multiple times', async function() {
        try {
            // eslint-disable-next-line max-len
            const rootDir = resolve(__dirname, '__fixtures__/routers-duplicate-parameter');
            await archipelago(app, {
                rootDir,
                onRouteLoading: hookMock,
                strict: true,
            });
        } catch (e: any) {
            expect(e.message)
                .toBe(
                    // eslint-disable-next-line max-len
                    'Duplicate parameters found in route /admin/customers/[id]/orders/[id] (id)',
                );
        }
    });
});
