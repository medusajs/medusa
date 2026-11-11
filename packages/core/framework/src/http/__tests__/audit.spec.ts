import { MedusaModule } from "@medusajs/modules-sdk"
import { Modules } from "@medusajs/utils"
import { resolve } from "path"
import { asValue } from "../../deps/awilix"
import { container } from "../../container"
import { logger } from "../../logger"
import {
  getAuditOutcome,
  getDefaultAuditResource,
  getRouteParams,
  isAuditedByDefault,
  mergeAuditConfigRoutes,
  resolveAuditActor,
} from "../audit"
import { createServer } from "../__fixtures__/server"
import { MiddlewareFileLoader } from "../middleware-file-loader"
import { AuditRequest, MedusaNextFunction } from "../types"

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

const CORE_DIR = resolve(__dirname, "../__fixtures__/routers-audit")
const APP_DIR = resolve(__dirname, "../__fixtures__/routers-audit-app")

describe("Audit route settings", () => {
  it("keeps one setting per matcher and method, with the later one winning", () => {
    const action = { action: "order.cancel" }
    const requestData = () => ({})

    const merged = mergeAuditConfigRoutes([
      {
        matcher: "/admin/orders/:id",
        methods: ["POST", "DELETE"],
        config: action,
      },
      {
        matcher: "/admin/orders/:id",
        methods: ["POST"],
        config: { requestData },
      },
      { matcher: "/admin/orders/:id", methods: ["DELETE"], config: false },
      { matcher: "/admin/orders", methods: ["POST"], config: true },
      { matcher: "/admin/orders", methods: ["POST"], config: action },
    ])

    expect(merged).toEqual([
      {
        matcher: "/admin/orders/:id",
        methods: ["POST"],
        config: { action: "order.cancel", requestData },
      },
      { matcher: "/admin/orders/:id", methods: ["DELETE"], config: false },
      { matcher: "/admin/orders", methods: ["POST"], config: action },
    ])
  })

  it("lets a later source directory override core settings", async () => {
    const loader = new MiddlewareFileLoader()
    await loader.scanDir(CORE_DIR)
    await loader.scanDir(APP_DIR)

    const routes = loader.getAuditConfigRoutes()
    const find = (matcher: string, method: string) =>
      routes.find(
        (r) => r.matcher === matcher && r.methods.includes(method as any)
      )?.config

    expect(find("/admin/products", "POST")).toEqual({
      action: "product.create",
      resource: expect.any(Function),
      requestData: expect.any(Function),
    })
    expect(
      (find("/admin/products", "POST") as any).requestData({
        validatedBody: { title: "Shirt" },
      })
    ).toEqual({ title: "Shirt", app: true })
    expect(find("/admin/products/:id", "DELETE")).toBe(true)
    expect(find("/admin/orders/:id/cancel", "POST")).toBe(false)
    expect(find("/admin/products*", "GET")).toBe(false)
  })
})

describe("Audit helpers", () => {
  it("records mutations under /admin, /rbac and /auth by default", () => {
    expect(isAuditedByDefault("POST", "/admin/products")).toBe(true)
    expect(isAuditedByDefault("DELETE", "/admin/products/prod_1")).toBe(true)
    expect(isAuditedByDefault("PUT", "/rbac/roles/role_1")).toBe(true)
    expect(isAuditedByDefault("POST", "/auth/user/emailpass")).toBe(true)
    expect(isAuditedByDefault("GET", "/admin/products")).toBe(false)
    expect(isAuditedByDefault("POST", "/store/carts")).toBe(false)
    expect(isAuditedByDefault("POST", "/administrators")).toBe(false)
    expect(isAuditedByDefault("POST", "/hooks/payment")).toBe(false)
  })

  it("derives the resource from the route pattern", () => {
    const params = getRouteParams(
      "/admin/price-lists/:id/products",
      "/admin/price-lists/plist_1/products"
    )
    expect(params).toEqual({ id: "plist_1" })
    expect(
      getDefaultAuditResource("/admin/price-lists/:id/products", params)
    ).toEqual({
      type: "price_list",
      id: "plist_1",
    })
    expect(getDefaultAuditResource("/admin/product-categories", {})).toEqual({
      type: "product_category",
      id: null,
    })
    expect(
      getDefaultAuditResource("/rbac/policies/:id", { id: "rpol_1" })
    ).toEqual({ type: "rbac_policy", id: "rpol_1" })
    expect(getDefaultAuditResource("/auth/user/emailpass", {})).toBeUndefined()
    expect(getDefaultAuditResource("/store/carts", {})).toBeUndefined()
  })

  it("maps status codes to outcomes", () => {
    expect(getAuditOutcome(200)).toBe("succeeded")
    expect(getAuditOutcome(302)).toBe("succeeded")
    expect(getAuditOutcome(401)).toBe("denied")
    expect(getAuditOutcome(403)).toBe("denied")
    expect(getAuditOutcome(400)).toBe("failed")
    expect(getAuditOutcome(500)).toBe("failed")
  })

  it("maps the auth context to an actor", () => {
    const actor = (req: Partial<AuditRequest> & Record<string, unknown>) =>
      resolveAuditActor(req as AuditRequest)

    expect(actor({})).toEqual({
      actor_type: "anonymous",
      actor_id: null,
      metadata: {},
    })
    expect(
      actor({ auth_context: { actor_id: "user_1", actor_type: "user" } as any })
    ).toEqual({ actor_type: "user", actor_id: "user_1", metadata: {} })
    expect(
      actor({
        auth_context: { actor_id: "cus_1", actor_type: "customer" } as any,
      })
    ).toEqual({ actor_type: "customer", actor_id: "cus_1", metadata: {} })
    expect(
      actor({
        auth_context: { actor_id: "apk_1", actor_type: "api-key" } as any,
        secret_key_context: { created_by: "user_1" },
      })
    ).toEqual({
      actor_type: "api_key",
      actor_id: "apk_1",
      metadata: { api_key_created_by: "user_1" },
    })
    expect(
      actor({
        auth_context: { actor_id: "ven_1", actor_type: "vendor" } as any,
      })
    ).toEqual({
      actor_type: "user",
      actor_id: "ven_1",
      metadata: { actor_type: "vendor" },
    })
    expect(
      actor({
        auth_context: {
          actor_id: "",
          actor_type: "user",
          auth_identity_id: "authid_1",
        } as any,
      })
    ).toEqual({
      actor_type: "anonymous",
      actor_id: null,
      metadata: { auth_identity_id: "authid_1" },
    })
  })
})

describe("Audit middleware", () => {
  const record = jest.fn()
  let request: Awaited<ReturnType<typeof createServer>>["request"]
  const adminSession = { jwt: { userId: "user_1" } }

  // Records are written once the response is finished, which can come after
  // supertest resolves.
  const waitForRecords = async (count: number) => {
    for (let i = 0; i < 50 && record.mock.calls.length < count; i++) {
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    return record.mock.calls.map(([entry]) => entry)
  }

  // Lets any late record land before asserting that none was written.
  const settle = () => new Promise((resolve) => setTimeout(resolve, 50))

  beforeAll(async () => {
    const isInstalled = MedusaModule.isInstalled.bind(MedusaModule)
    jest
      .spyOn(MedusaModule, "isInstalled")
      .mockImplementation(
        (moduleKey: string) =>
          moduleKey === Modules.AUDIT || isInstalled(moduleKey)
      )

    const server = await createServer([CORE_DIR, APP_DIR])
    container.register(Modules.AUDIT, asValue({ createAuditLogs: record }))
    request = server.request
  })

  beforeEach(() => {
    record.mockReset()
  })

  it("records a mutation with the route's settings merged with the application's", async () => {
    const res = await request("POST", "/admin/products", {
      adminSession,
      payload: { title: "Shirt", description: "Never stored" },
      headers: { "user-agent": "audit-test", "x-forwarded-for": "10.0.0.1" },
    })
    expect(res.status).toBe(200)

    const [entry] = await waitForRecords(1)
    await settle()
    expect(record).toHaveBeenCalledTimes(1)
    expect(entry).toEqual({
      action: "product.create",
      actor_type: "user",
      actor_id: "user_1",
      resource_type: "product",
      resource_id: "prod_new",
      outcome: "succeeded",
      started_at: expect.any(Date),
      ended_at: expect.any(Date),
      request: {
        method: "POST",
        route: "/admin/products",
        path: "/admin/products",
        status_code: 200,
        request_id: null,
        ip_address: "10.0.0.1",
        user_agent: "audit-test",
      },
      request_data: { title: "Shirt", app: true },
      response_data: null,
      metadata: null,
    })
    expect(JSON.stringify(entry)).not.toContain("Never stored")
  })

  it("records a validation failure without passing the error body", async () => {
    const res = await request("POST", "/admin/products", {
      adminSession,
      payload: {},
    })
    expect(res.status).toBe(400)

    const [entry] = await waitForRecords(1)
    expect(entry).toEqual(
      expect.objectContaining({
        action: "product.create",
        outcome: "failed",
        resource_type: "product",
        resource_id: null,
        request_data: { title: undefined, app: true },
        request: expect.objectContaining({ status_code: 400 }),
      })
    )
  })

  it("records a request rejected by authentication as denied", async () => {
    const res = await request("DELETE", "/admin/products/prod_1")
    expect(res.status).toBe(401)

    const [entry] = await waitForRecords(1)
    expect(entry).toEqual(
      expect.objectContaining({
        action: "DELETE /admin/products/:id",
        actor_type: "anonymous",
        actor_id: null,
        resource_type: "product",
        resource_id: "prod_1",
        outcome: "denied",
        request: expect.objectContaining({
          route: "/admin/products/:id",
          path: "/admin/products/prod_1",
          status_code: 401,
        }),
      })
    )
  })

  it("uses the defaults for an admin mutation without settings", async () => {
    await request("POST", "/admin/brands", { adminSession })

    const [entry] = await waitForRecords(1)
    expect(entry).toEqual(
      expect.objectContaining({
        action: "POST /admin/brands",
        resource_type: "brand",
        resource_id: null,
        outcome: "succeeded",
      })
    )
  })

  it("skips routes set to false, GET requests, and routes outside the audited namespaces", async () => {
    await request("POST", "/admin/orders/order_1/cancel", { adminSession })
    await request("POST", "/admin/products/prod_1", { adminSession })
    await request("GET", "/admin/products", { adminSession })
    await request("POST", "/hooks", {})
    await settle()

    expect(record).not.toHaveBeenCalled()
  })

  it("records a route opted in outside the audited namespaces", async () => {
    await request("POST", "/store/carts", {})

    const [entry] = await waitForRecords(1)
    expect(entry).toEqual(
      expect.objectContaining({
        action: "POST /store/carts",
        actor_type: "anonymous",
        resource_type: "cart",
        resource_id: "cart_new",
        response_data: { cart_id: "cart_new" },
      })
    )
  })

  it("ignores a throwing setting function and falls back to the defaults", async () => {
    const warn = jest.spyOn(logger, "warn").mockImplementation(() => {})

    const res = await request("POST", "/admin/fail", { adminSession })
    expect(res.status).toBe(400)

    const [entry] = await waitForRecords(1)
    expect(entry).toEqual(
      expect.objectContaining({
        action: "POST /admin/fail",
        resource_type: "fail",
        outcome: "failed",
        response_data: { body: undefined },
      })
    )
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("resource failed")
    )
    warn.mockRestore()
  })

  it("never fails the request when recording throws", async () => {
    const warn = jest.spyOn(logger, "warn").mockImplementation(() => {})
    record.mockImplementation(() => {
      throw new Error("storage down")
    })

    const res = await request("POST", "/admin/brands", { adminSession })
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ brand: { id: "brand_new" } })

    await waitForRecords(1)
    await settle()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("storage down"))
    warn.mockRestore()
  })
})
