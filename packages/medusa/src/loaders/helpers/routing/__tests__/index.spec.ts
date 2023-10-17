import express from "express"
import http from "http"
import { resolve } from "path"
import request from "supertest"
import {
  customersCreateMiddlewareMock,
  customersGlobalMiddlewareMock,
  storeCorsMiddlewareMock,
} from "../__fixtures__/mocks"
import { RoutesLoader } from "../index"

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
        .expect("GET order 1000")
    })

    it("should return a status 200 on POST admin/order/:id", async function () {
      await request(server)
        .post("/admin/orders/1000")
        .expect(200)
        .expect("POST order 1000")
    })

    it("should call GET /customers/[customer_id]/orders/[order_id]", async function () {
      await request(server)
        .get("/customers/test-customer/orders/test-order")
        .expect(200)
        .expect(
          'list customers {"customer_id":"test-customer","order_id":"test-order"}'
        )
    })

    it("should not be able to GET /_private as the folder is prefixed with an underscore", async function () {
      const res = await request(server).get("/_private")

      expect(res.status).toBe(404)
      expect(res.text).toContain("Cannot GET /_private")
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
      const rootDir = resolve(
        __dirname,
        "../__fixtures__/routers-duplicate-parameter"
      )
      const err = await new RoutesLoader({
        app,
        rootDir,
        configModule: mockConfigModule,
      })
        .load()
        .catch((e) => e)

      expect(err).toBeDefined()
      expect(err.message).toBe(
        "Duplicate parameters found in route /admin/customers/[id]/orders/[id] (id). Make sure that all parameters are unique."
      )
    })
  })
})
