import http from "http"
import { resolve } from "path"
import request from "supertest"
import express from "express"
import { RoutesLoader } from "../index"
import {
  customersCreateMiddlewareMock,
  customersGlobalMiddlewareMock,
  storeCorsMiddlewareMock,
} from "../__fixtures__/mocks"

const mockConfigModule = {
  projectConfig: {
    store_cors: "http://localhost:8000",
    admin_cors: "http://localhost:7001",
    database_logging: false,
  },
  featureFlags: {},
  plugins: [],
}

describe("RoutesLoader", function () {
  afterEach(function () {
    jest.clearAllMocks()
  })

  describe("Routes", function () {
    const app = express()
    const server = http.createServer(app)

    beforeAll(async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      await new RoutesLoader({
        app,
        rootDir,
        configModule: mockConfigModule,
      }).load()
    })

    it("should return a status 200 on GET admin/order/:id", async function () {
      await request(server)
        .get("/admin/orders/1000")
        .expect(200)
        .expect("hello world")
    })

    it("should return a status 200 on POST admin/order/:id", async function () {
      await request(server)
        .post("/admin/orders/1000")
        .expect(200)
        .expect("hello world")
    })

    it("should call a multi parameters route and provide the parameters to the handler", async function () {
      await request(server)
        .get("/customers/test-customer/orders/test-order")
        .expect(200)
        .expect(
          'list customers {"customer_id":"test-customer","order_id":"test-order"}'
        )
    })

    it("should call middleware applied to GET `/customers`", async function () {
      await request(server)
        .get("/customers")
        .expect(200)
        .expect("list customers")
    })
  })

  describe("Middlewares", function () {
    const app = express()
    const server = http.createServer(app)

    beforeAll(async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers-middleware")

      await new RoutesLoader({
        app,
        rootDir,
        configModule: mockConfigModule,
      }).load()
    })

    it("should call middleware applied to `/customers`", async function () {
      await request(server)
        .get("/customers")
        .expect(200)
        .expect("list customers")

      expect(customersGlobalMiddlewareMock).toHaveBeenCalled()
    })

    it("should not call middleware applied to POST `/customers` when GET `/customers`", async function () {
      await request(server)
        .get("/customers")
        .expect(200)
        .expect("list customers")

      expect(customersGlobalMiddlewareMock).toHaveBeenCalled()
      expect(customersCreateMiddlewareMock).not.toHaveBeenCalled()
    })

    it("should call middleware applied to POST `/customers` when POST `/customers`", async function () {
      await request(server)
        .post("/customers")
        .expect(200)
        .expect("create customer")

      expect(customersGlobalMiddlewareMock).toHaveBeenCalled()
      expect(customersCreateMiddlewareMock).toHaveBeenCalled()
    })

    it("should call store cors middleware on `/store/*` routes", async function () {
      await request(server)
        .post("/store/products/1000/sync")
        .expect(200)
        .expect("sync product 1000")

      expect(customersGlobalMiddlewareMock).not.toHaveBeenCalled()
      expect(customersCreateMiddlewareMock).not.toHaveBeenCalled()

      expect(storeCorsMiddlewareMock).toHaveBeenCalled()
    })
  })

  describe("Duplicate parameters", function () {
    const app = express()

    it("should throw if a route contains the same parameter multiple times", async function () {
      expect.assertions(1)

      try {
        const rootDir = resolve(
          __dirname,
          "../__fixtures__/routers-duplicate-parameter"
        )
        await new RoutesLoader({
          app,
          rootDir,
          configModule: mockConfigModule,
        }).load()
      } catch (e: any) {
        expect(e.message).toBe(
          "Duplicate parameters found in route /admin/customers/[id]/orders/[id] (id). Make sure that all parameters are unique."
        )
      }
    })
  })
})
