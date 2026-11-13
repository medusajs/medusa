import express, { NextFunction, Request, Response } from "express"
import supertest from "supertest"
import {
  createAuditMiddleware,
  getAuditOutcome,
  getDefaultAuditAction,
  getDefaultAuditResource,
  getRouteParams,
  isAuditedByDefault,
  mergeAuditConfigRoutes,
  resolveAuditActor,
} from "../audit"
import { preloadPathToRegexp, RoutesFinder } from "../routes-finder"
import { RoutesSorter } from "../routes-sorter"
import { AuditConfigRoute, AuditRequest, RouteVerb } from "../types"

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
    ).toEqual({ type: "policy", id: "rpol_1" })
    expect(
      getDefaultAuditResource("/auth/:actor_type/:auth_provider", {
        actor_type: "user",
        auth_provider: "emailpass",
      })
    ).toEqual({ type: "auth", id: "emailpass" })
    expect(getDefaultAuditResource("/auth/token/refresh", {})).toEqual({
      type: "token",
      id: null,
    })
    expect(getDefaultAuditResource("/store/carts", {})).toEqual({
      type: "cart",
      id: null,
    })
    expect(getDefaultAuditResource("/brands", {})).toEqual({
      type: "brand",
      id: null,
    })
    expect(getDefaultAuditResource("/vendors/products", {})).toEqual({
      type: "product",
      id: null,
    })
    expect(
      getDefaultAuditResource("/vendors/products/:id", { id: "prod_1" })
    ).toEqual({ type: "product", id: "prod_1" })
    expect(getDefaultAuditResource("/admin/products/batch", {})).toEqual({
      type: "product",
      id: null,
    })
    expect(
      getDefaultAuditResource("/brands/:id/products", { id: "brand_1" })
    ).toEqual({ type: "brand", id: "brand_1" })
    expect(getDefaultAuditResource("/:id", { id: "1" })).toBeUndefined()
  })

  it("names the nested resource of a route with several parameters", () => {
    expect(
      getDefaultAuditResource(
        "/admin/orders/:id/fulfillments/:fulfillment_id/cancel",
        { id: "order_1", fulfillment_id: "ful_1" }
      )
    ).toEqual({ type: "fulfillment", id: "ful_1" })
    expect(
      getDefaultAuditResource("/rbac/roles/:id/policies/:policy_id", {
        id: "role_1",
        policy_id: "rpol_1",
      })
    ).toEqual({ type: "policy", id: "rpol_1" })
    expect(
      getDefaultAuditResource("/admin/executions/:workflow_id/:run_id", {
        workflow_id: "wf_1",
        run_id: "run_1",
      })
    ).toEqual({ type: "execution", id: "run_1" })
  })

  it("reads the ID of a created resource from the response body", () => {
    expect(
      getDefaultAuditResource(
        "/admin/price-lists",
        {},
        { price_list: { id: "plist_1" } }
      )
    ).toEqual({ type: "price_list", id: "plist_1" })
    expect(
      getDefaultAuditResource("/rbac/roles", {}, { role: { id: "role_1" } })
    ).toEqual({ type: "role", id: "role_1" })
    expect(
      getDefaultAuditResource("/admin/products", {}, { products: [] })
    ).toEqual({ type: "product", id: null })
    expect(
      getDefaultAuditResource(
        "/admin/products/:id",
        { id: "prod_1" },
        { product: { id: "prod_other" } }
      )
    ).toEqual({ type: "product", id: "prod_1" })
  })

  it("derives the action from the route pattern and method", () => {
    const action = getDefaultAuditAction
    expect(action("POST", "/admin/products")).toBe("product.create")
    expect(action("POST", "/admin/products/:id")).toBe("product.update")
    expect(action("DELETE", "/admin/products/:id")).toBe("product.delete")
    expect(action("POST", "/admin/orders/:id/complete")).toBe("order.complete")
    expect(action("POST", "/admin/orders/:id/transfer/cancel")).toBe(
      "order.transfer.cancel"
    )
    expect(
      action("POST", "/admin/orders/:id/fulfillments/:fulfillment_id/cancel")
    ).toBe("fulfillment.cancel")
    expect(action("POST", "/admin/payment-collections/:id/mark-as-paid")).toBe(
      "payment_collection.mark_as_paid"
    )
    expect(action("POST", "/admin/products/batch")).toBe("product.batch")
    expect(action("POST", "/admin/products/:id/variants")).toBe(
      "product.variants"
    )
    expect(action("DELETE", "/admin/users/:id/roles")).toBe("user.roles.delete")
    expect(action("POST", "/vendors/products")).toBe("product.create")
    expect(action("DELETE", "/auth/session")).toBe("session.delete")
    expect(action("POST", "/:id")).toBe("POST /:id")
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
      actor_type: "api-key",
      actor_id: "apk_1",
      metadata: { api_key_created_by: "user_1" },
    })
    expect(
      actor({
        auth_context: { actor_id: "ven_1", actor_type: "vendor" } as any,
      })
    ).toEqual({
      actor_type: "vendor",
      actor_id: "ven_1",
      metadata: {},
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
  const logger = { warn: jest.fn() }
  let request: ReturnType<typeof supertest>

  const routes: {
    method: RouteVerb
    path: string
    handler: (req: Request, res: Response) => void
    audit?: AuditConfigRoute["config"]
  }[] = [
    {
      method: "POST",
      path: "/admin/products",
      handler: (req, res) => {
        if (!req.body?.title) {
          res.status(400).json({ message: "Invalid request" })
          return
        }
        res.json({ product: { id: "prod_new" } })
      },
      audit: {
        action: "product.create",
        resource: (_req, body) => ({ type: "product", id: body?.product?.id }),
        requestData: (req) => ({ title: (req as Request).body?.title }),
      },
    },
    {
      method: "DELETE",
      path: "/admin/products/:id",
      handler: (_req, res) => res.json({ deleted: true }),
    },
    {
      method: "GET",
      path: "/admin/products",
      handler: (_req, res) => res.json({ products: [] }),
    },
    {
      method: "POST",
      path: "/admin/orders/:id/cancel",
      handler: (_req, res) => res.json({}),
      audit: false,
    },
    {
      method: "POST",
      path: "/admin/fail",
      handler: (_req, res) => res.status(400).json({ message: "Not allowed" }),
      audit: {
        resource: () => {
          throw new Error("resource failed")
        },
        responseData: (_req, body) => ({ body }),
      },
    },
    {
      method: "POST",
      path: "/store/carts",
      handler: (_req, res) => res.json({ cart: { id: "cart_new" } }),
      audit: {
        resource: (_req, body) => ({ type: "cart", id: body?.cart?.id }),
        responseData: (_req, body) => ({ cart_id: body?.cart?.id }),
      },
    },
    {
      method: "POST",
      path: "/hooks",
      handler: (_req, res) => res.json({ ok: true }),
    },
  ]

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
    await preloadPathToRegexp()

    const auditRoutes = routes
      .filter((route) => route.audit !== undefined)
      .map((route) => ({
        matcher: route.path,
        methods: [route.method],
        config: route.audit!,
      }))

    const app = express()
    app.use(
      createAuditMiddleware({
        routesFinder: new RoutesFinder(
          routes.map((route) => ({ matcher: route.path, method: route.method }))
        ) as any,
        auditRoutesFinder: new RoutesFinder<AuditConfigRoute>(
          new RoutesSorter(auditRoutes).sort([
            "static",
            "params",
            "regex",
            "wildcard",
            "global",
          ])
        ),
        getAuditService: () => ({ createAuditLogs: record }) as any,
        logger: logger as any,
      })
    )
    app.use(express.json())
    // Stands in for authentication, which runs after the audit middleware.
    app.use("/admin", (req: Request, res: Response, next: NextFunction) => {
      const actorId = req.get("x-user")
      if (!actorId) {
        res.status(401).json({ message: "Unauthorized" })
        return
      }
      ;(req as any).auth_context = { actor_id: actorId, actor_type: "user" }
      next()
    })
    routes.forEach((route) =>
      app[route.method.toLowerCase()](route.path, route.handler)
    )

    request = supertest(app)
  })

  beforeEach(() => {
    record.mockReset()
    logger.warn.mockReset()
  })

  it("records a mutation with the route's settings", async () => {
    const res = await request
      .post("/admin/products")
      .set({ "x-user": "user_1", "user-agent": "audit-test" })
      .send({ title: "Shirt", description: "Never stored" })
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
        ip_address: expect.any(String),
        user_agent: "audit-test",
      },
      request_data: { title: "Shirt" },
      response_data: null,
      metadata: null,
    })
    expect(JSON.stringify(entry)).not.toContain("Never stored")
  })

  it("records a failed request without passing the error body", async () => {
    const res = await request
      .post("/admin/products")
      .set("x-user", "user_1")
      .send({})
    expect(res.status).toBe(400)

    const [entry] = await waitForRecords(1)
    expect(entry).toEqual(
      expect.objectContaining({
        action: "product.create",
        outcome: "failed",
        resource_type: "product",
        resource_id: null,
        request: expect.objectContaining({ status_code: 400 }),
      })
    )
  })

  it("records a request rejected by authentication as denied", async () => {
    const res = await request.delete("/admin/products/prod_1")
    expect(res.status).toBe(401)

    const [entry] = await waitForRecords(1)
    expect(entry).toEqual(
      expect.objectContaining({
        action: "product.delete",
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

  it("deduces nothing from the path of an unknown route", async () => {
    const res = await request
      .post("/admin/products/prod_1/unknown")
      .set("x-user", "user_1")
    expect(res.status).toBe(404)

    const [entry] = await waitForRecords(1)
    expect(entry).toEqual(
      expect.objectContaining({
        action: "POST /admin/products/prod_1/unknown",
        resource_type: null,
        resource_id: null,
        outcome: "failed",
      })
    )
  })

  it("caps the stored path", async () => {
    await request.post(`/admin/${"a".repeat(5000)}`).set("x-user", "user_1")

    const [entry] = await waitForRecords(1)
    expect(entry.request.path).toHaveLength(2048)
    expect(entry.action).toHaveLength("POST ".length + 2048)
  })

  it("skips routes set to false, GET requests, and routes outside the audited namespaces", async () => {
    await request.post("/admin/orders/order_1/cancel").set("x-user", "user_1")
    await request.get("/admin/products").set("x-user", "user_1")
    await request.post("/hooks")
    await settle()

    expect(record).not.toHaveBeenCalled()
  })

  it("records a route opted in outside the audited namespaces", async () => {
    await request.post("/store/carts")

    const [entry] = await waitForRecords(1)
    expect(entry).toEqual(
      expect.objectContaining({
        action: "cart.create",
        actor_type: "anonymous",
        resource_type: "cart",
        resource_id: "cart_new",
        response_data: { cart_id: "cart_new" },
      })
    )
  })

  it("ignores a throwing setting function and falls back to the defaults", async () => {
    const res = await request.post("/admin/fail").set("x-user", "user_1")
    expect(res.status).toBe(400)

    const [entry] = await waitForRecords(1)
    expect(entry).toEqual(
      expect.objectContaining({
        action: "fail.create",
        resource_type: "fail",
        outcome: "failed",
        response_data: { body: undefined },
      })
    )
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("resource failed")
    )
  })

  it("never fails the request when recording throws", async () => {
    record.mockImplementation(() => {
      throw new Error("storage down")
    })

    const res = await request
      .delete("/admin/products/prod_1")
      .set("x-user", "user_1")
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ deleted: true })

    await waitForRecords(1)
    await settle()
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("storage down")
    )
  })
})
