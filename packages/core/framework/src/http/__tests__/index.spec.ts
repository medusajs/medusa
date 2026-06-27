import {
  ContainerRegistrationKeys,
  createMedusaContainer,
} from "@medusajs/utils"
import { asValue } from "../../deps/awilix"
import express from "express"
import { resolve } from "path"
import { logger as defaultLogger } from "../../logger"
import {
  customersCreateMiddlewareMock,
  customersCreateMiddlewareValidatorMock,
  customersGlobalMiddlewareMock,
  storeGlobalMiddlewareMock,
} from "../__fixtures__/mocks"
import { createServer } from "../__fixtures__/server"
import { ApiLoader, MedusaNextFunction } from "../index"

jest.setTimeout(30000)

jest.mock("../middlewares/ensure-publishable-api-key", () => {
  return {
    ensurePublishableApiKeyMiddleware: async (
      req: any,
      res: any,
      next: MedusaNextFunction
    ) => next(),
  }
})

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

    it("should be handled by the error handler when a route handler fails", async function () {
      const res = await request("GET", "/admin/fail", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })

      expect(res.status).toBe(500)
      expect(res.text).toBe(
        '{"code":"unknown_error","type":"unknown_error","message":"An unknown error occurred."}'
      )
    })

    it("should not succeed on cors preflight admin request failing", async function () {
      const res = await request("OPTIONS", "/admin/orders", {
        headers: {
          origin: "http://localhost:3000",
          "access-control-request-method": "GET",
        },
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })

      expect(res.status).toBe(204)
      expect(res.headers["access-control-allow-origin"]).not.toBeTruthy()
    })

    it("should not succeed on cors preflight store request failing", async function () {
      const res = await request("OPTIONS", "/store/custom", {
        headers: {
          origin: "http://localhost:3000",
          "access-control-request-method": "GET",
        },
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })

      expect(res.status).toBe(204)
      expect(res.headers["access-control-allow-origin"]).not.toBeTruthy()
    })

    it("should succeed on cors preflight admin request", async function () {
      const res = await request("OPTIONS", "/admin/orders", {
        headers: {
          origin: "http://localhost:7001",
          "access-control-request-method": "GET",
        },
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })

      expect(res.status).toBe(204)
      expect(res.headers["access-control-allow-origin"]).toBe(
        "http://localhost:7001"
      )
    })

    it("should succeed on cors preflight store request", async function () {
      const res = await request("OPTIONS", "/store/custom", {
        headers: {
          origin: "http://localhost:8000",
          "access-control-request-method": "GET",
        },
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })

      expect(res.status).toBe(204)
      expect(res.headers["access-control-allow-origin"]).toBe(
        "http://localhost:8000"
      )
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

    it("should assign the req.additionalDataValidator when the method and route matches", async function () {
      const res = await request("POST", "/customers")

      expect(res.status).toBe(200)
      expect(res.text).toBe("create customer")
      expect(customersGlobalMiddlewareMock).toHaveBeenCalled()
      expect(customersCreateMiddlewareMock).toHaveBeenCalled()
      expect(customersCreateMiddlewareValidatorMock).toHaveBeenCalled()
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
      const container = createMedusaContainer()
      container.register(
        ContainerRegistrationKeys.LOGGER,
        asValue(defaultLogger)
      )

      const err = await new ApiLoader({
        app,
        sourceDir: rootDir,
        container,
      })
        .load()
        .catch((e) => e)

      expect(err).toBeDefined()
      expect(err.message).toBe(
        "Duplicate parameters found in route /admin/customers/[id]/orders/[id]/route.ts (id). Make sure that all parameters are unique."
      )
    })
  })

  describe("Disabled routes", function () {
    it("should return 404 for routes matching disabledRoutes wildcard pattern", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/admin/products*"],
          },
        },
      } as any)

      // Disabled route should 404
      const res = await request("GET", "/admin/products", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(res.status).toBe(404)
    })

    it("should still serve routes not matching disabledRoutes pattern", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/admin/products*"],
          },
        },
      } as any)

      // Non-disabled route should still work
      const res = await request("GET", "/admin/orders", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(res.status).toBe(200)
    })

    it("should disable exact route paths", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/admin/orders"],
          },
        },
      } as any)

      // Exact match should be disabled
      const orderRes = await request("GET", "/admin/orders", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(orderRes.status).toBe(404)

      // Products should still work
      const productRes = await request("GET", "/admin/products", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(productRes.status).toBe(200)
    })

    it("should disable sub-paths when using wildcard pattern (Branch B: startsWith)", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/admin/products*"],
          },
        },
      } as any)

      // Sub-path should also be disabled (Branch B: startsWith prefix)
      const subPathRes = await request("GET", "/admin/products/some-id", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(subPathRes.status).toBe(404)

      // Parent exact match also disabled (Branch A: matcher === prefix)
      const parentRes = await request("GET", "/admin/products", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(parentRes.status).toBe(404)
    })

    it("should NOT disable sub-paths when using exact pattern (no wildcard)", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/admin/orders"],
          },
        },
      } as any)

      // Exact match should be disabled
      const exactRes = await request("GET", "/admin/orders", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(exactRes.status).toBe(404)

      // Sub-path should still work (exact does NOT disable children)
      const subRes = await request("GET", "/admin/orders/1000", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(subRes.status).toBe(200)
      expect(subRes.text).toBe("GET order 1000")

      // Different method on sub-path also works
      const postSubRes = await request("POST", "/admin/orders/1000", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(postSubRes.status).toBe(200)
      expect(postSubRes.text).toBe("POST order 1000")
    })

    it("should support multiple mixed patterns (wildcard + exact)", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/admin/products*", "/admin/orders"],
          },
        },
      } as any)

      // Wildcard: parent disabled
      const productsRes = await request("GET", "/admin/products", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(productsRes.status).toBe(404)

      // Wildcard: sub-path disabled
      const productIdRes = await request("GET", "/admin/products/some-id", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(productIdRes.status).toBe(404)

      // Exact: disabled
      const ordersRes = await request("GET", "/admin/orders", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(ordersRes.status).toBe(404)

      // Exact: sub-path NOT disabled
      const orderIdRes = await request("GET", "/admin/orders/1000", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(orderIdRes.status).toBe(200)
      expect(orderIdRes.text).toBe("GET order 1000")
    })

    it("should not disable any routes when disabledRoutes is an empty array", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: [],
          },
        },
      } as any)

      const ordersRes = await request("GET", "/admin/orders", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(ordersRes.status).toBe(200)

      const productsRes = await request("GET", "/admin/products", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(productsRes.status).not.toBe(404)
    })

    it("should not disable any routes when disabledRoutes is not configured", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir)

      const ordersRes = await request("GET", "/admin/orders", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(ordersRes.status).toBe(200)

      const productsRes = await request("GET", "/admin/products", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(productsRes.status).not.toBe(404)
    })

    it("should not invoke middlewares for disabled routes", async function () {
      const rootDir = resolve(
        __dirname,
        "../__fixtures__/routers-middleware"
      )

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/customers"],
          },
        },
      } as any)

      // GET /customers should be disabled
      const getRes = await request("GET", "/customers")
      expect(getRes.status).toBe(404)
      expect(customersGlobalMiddlewareMock).not.toHaveBeenCalled()

      // POST /customers should also be disabled
      const postRes = await request("POST", "/customers")
      expect(postRes.status).toBe(404)
      expect(customersCreateMiddlewareMock).not.toHaveBeenCalled()
      expect(customersCreateMiddlewareValidatorMock).not.toHaveBeenCalled()
    })

    it("should return 404 for all HTTP methods on disabled routes", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/admin/products*"],
          },
        },
      } as any)

      const adminSession = { jwt: { userId: "admin_user" } }

      // POST
      const postRes = await request("POST", "/admin/products", {
        adminSession,
      })
      expect(postRes.status).toBe(404)

      // DELETE on sub-path
      const deleteRes = await request("DELETE", "/admin/products/some-id", {
        adminSession,
      })
      expect(deleteRes.status).toBe(404)

      // PATCH
      const patchRes = await request("PATCH", "/admin/products", {
        adminSession,
      })
      expect(patchRes.status).toBe(404)

      // PUT
      const putRes = await request("PUT", "/admin/products", {
        adminSession,
      })
      expect(putRes.status).toBe(404)
    })

    it("should disable store routes", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/store/custom"],
          },
        },
      } as any)

      const storeRes = await request("GET", "/store/custom")
      expect(storeRes.status).toBe(404)
    })

    it("should disable non-prefixed routes (not admin/store)", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/customers*"],
          },
        },
      } as any)

      // Non-prefixed route should be disabled
      const custRes = await request(
        "GET",
        "/customers/test-customer/orders/test"
      )
      expect(custRes.status).toBe(404)

      // Admin routes should still work
      const adminRes = await request("GET", "/admin/orders", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(adminRes.status).toBe(200)
    })

    it("should NOT disable routes when matcher is shorter than or diverges from wildcard prefix", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/admin/products*"],
          },
        },
      } as any)

      // /admin/orders diverges from /admin/products prefix
      const ordersRes = await request("GET", "/admin/orders", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(ordersRes.status).toBe(200)

      // /admin is shorter than /admin/products prefix
      const adminRes = await request("GET", "/admin", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(adminRes.status).not.toBe(404)
    })

    it("should match by string prefix, not path segment boundary (BVA)", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/admin/prod*"],
          },
        },
      } as any)

      // /admin/products starts with /admin/prod — matches even without / separator
      const productsRes = await request("GET", "/admin/products", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(productsRes.status).toBe(404)

      // Sub-path also matches
      const productIdRes = await request("GET", "/admin/products/some-id", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(productIdRes.status).toBe(404)
    })

    it("should not register CORS for disabled admin routes", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/admin/products*"],
          },
        },
      } as any)

      // CORS preflight for disabled route should not have CORS headers
      const corsRes = await request("OPTIONS", "/admin/products", {
        headers: {
          origin: "http://localhost:7001",
          "access-control-request-method": "GET",
        },
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })

      expect(corsRes.headers["access-control-allow-origin"]).not.toBeTruthy()
    })

    it("should handle overlapping patterns without errors", async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      const { request } = await createServer(rootDir, {
        projectConfig: {
          http: {
            disabledRoutes: ["/admin*", "/admin/products*"],
          },
        },
      } as any)

      // Both patterns match /admin/products
      const productsRes = await request("GET", "/admin/products", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(productsRes.status).toBe(404)

      // Broader /admin* also covers /admin/orders
      const ordersRes = await request("GET", "/admin/orders", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })
      expect(ordersRes.status).toBe(404)
    })
  })
})
