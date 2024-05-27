import express from "express"
import { resolve } from "path"
import {
  config,
  customersCreateMiddlewareMock,
  customersGlobalMiddlewareMock,
  storeGlobalMiddlewareMock,
} from "../__fixtures__/mocks"
import { createServer } from "../__fixtures__/server"
import { RoutesLoader } from "../index"

jest.setTimeout(30000)

describe("RoutesLoader", function () {
  afterEach(function () {
    jest.clearAllMocks()
  })

  describe("Routes", function () {
    let request

    beforeAll(async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request: request_ } = await createServer(rootDir)

      request = request_
    })

    it("should return a status 200 on GET admin/order/:id", async function () {
      const res = await request("GET", "/admin/orders/1000", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })

      expect(res.status).toBe(200)
      expect(res.text).toBe("GET order 1000")
    })

    it("should return a status 200 on POST admin/order/:id", async function () {
      const res = await request("POST", "/admin/orders/1000", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })

      expect(res.status).toBe(200)
      expect(res.text).toBe("POST order 1000")
    })

    it("should call GET /customers/[customer_id]/orders/[order_id]", async function () {
      const res = await request("GET", "/customers/test-customer/orders/test")

      expect(res.status).toBe(200)
      expect(res.text).toBe(
        'list customers {"customer_id":"test-customer","order_id":"test"}'
      )
    })

    it("should not be able to GET /_private as the folder is prefixed with an underscore", async function () {
      const res = await request("GET", "/_private")

      expect(res.status).toBe(404)
      expect(res.text).toContain("Cannot GET /_private")
    })
  })

  describe("Middlewares", function () {
    let request

    beforeAll(async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers-middleware")

      const { request: request_ } = await createServer(rootDir)

      request = request_
    })

    it("should call middleware applied to `/customers`", async function () {
      const res = await request("GET", "/customers")

      expect(res.status).toBe(200)
      expect(res.text).toBe("list customers")
      expect(customersGlobalMiddlewareMock).toHaveBeenCalled()
    })

    it("should not call middleware applied to POST `/customers` when GET `/customers`", async function () {
      const res = await request("GET", "/customers")

      expect(res.status).toBe(200)
      expect(res.text).toBe("list customers")
      expect(customersGlobalMiddlewareMock).toHaveBeenCalled()
      expect(customersCreateMiddlewareMock).not.toHaveBeenCalled()
    })

    it("should call middleware applied to POST `/customers` when POST `/customers`", async function () {
      const res = await request("POST", "/customers")

      expect(res.status).toBe(200)
      expect(res.text).toBe("create customer")
      expect(customersGlobalMiddlewareMock).toHaveBeenCalled()
      expect(customersCreateMiddlewareMock).toHaveBeenCalled()
    })

    it("should call store global middleware on `/store/*` routes", async function () {
      const res = await request("POST", "/store/products/1000/sync")

      expect(res.status).toBe(200)
      expect(res.text).toBe("sync product 1000")
      expect(storeGlobalMiddlewareMock).toHaveBeenCalled()

      expect(customersGlobalMiddlewareMock).not.toHaveBeenCalled()
      expect(customersCreateMiddlewareMock).not.toHaveBeenCalled()
    })

    it("should apply raw middleware on POST `/webhooks/payment` route", async function () {
      const res = await request("POST", "/webhooks/payment", {
        payload: { test: "test" },
      })

      expect(res.status).toBe(200)
      expect(res.text).toBe("OK")
    })

    it("should return 200 when admin is authenticated", async () => {
      const res = await request("GET", "/admin/protected", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })

      expect(res.status).toBe(200)
      expect(res.text).toBe("GET /admin/protected")
    })

    it.skip("should return 401 when admin is not authenticated", async () => {
      const res = await request("GET", "/admin/protected")

      expect(res.status).toBe(401)
      expect(res.text).toBe("Unauthorized")
    })

    it("should return 200 when admin route is opted out of authentication", async () => {
      const res = await request("GET", "/admin/unprotected")

      expect(res.status).toBe(200)
      expect(res.text).toBe("GET /admin/unprotected")
    })

    it("should return the error as JSON when an error is thrown with default error handling", async () => {
      const res = await request("GET", "/customers/error")

      expect(res.status).toBe(400)
      expect(res.body).toEqual({
        message: "Not allowed",
        type: "not_allowed",
      })
    })
  })

  describe("Custom error handling", function () {
    let request

    beforeAll(async function () {
      const rootDir = resolve(
        __dirname,
        "../__fixtures__/routers-error-handler"
      )

      const { request: request_ } = await createServer(rootDir)

      request = request_
    })

    it("should return 405 when NOT_ALLOWED error is thrown", async () => {
      const res = await request("GET", "/store")

      expect(res.status).toBe(405)
      expect(res.body).toEqual({
        message: "Not allowed to perform this action",
        type: "not_allowed",
      })
    })

    it("should return 400 when INVALID_DATA error is thrown", async () => {
      const res = await request("POST", "/store")

      expect(res.status).toBe(400)
      expect(res.body).toEqual({
        message: "Invalid data provided",
        type: "invalid_data",
      })
    })

    it("should return 409 when CONFLICT error is thrown", async () => {
      const res = await request("PUT", "/store")

      expect(res.status).toBe(409)
      expect(res.body).toEqual({
        message: "Conflict with another request",
        type: "conflict",
      })
    })

    it("should return 418 when TEAPOT error is thrown", async () => {
      const res = await request("DELETE", "/store")

      expect(res.status).toBe(418)
      expect(res.body).toEqual({
        message: "I'm a teapot",
        type: "teapot",
      })
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
        configModule: config,
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
