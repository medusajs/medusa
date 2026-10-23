import { resolve } from "path"
import { createServer } from "../__fixtures__/server"
import { instrumentHttpLayer } from "../index"
import { MedusaError } from "@medusajs/framework/utils"
import { ApiLoader } from "@medusajs/framework/http"
import { SpanStatusCode } from "@medusajs/framework/opentelemetry/api"
import {
  InMemorySpanExporter,
  NodeTracerProvider,
  SimpleSpanProcessor,
} from "@medusajs/framework/opentelemetry/sdk-trace-node"
import { EventEmitter } from "events"

jest.setTimeout(30000)

jest.mock("../../commands/start", () => {
  return {}
})

const exporter = new InMemorySpanExporter()

function findSpan(name: string) {
  return exporter.getFinishedSpans().find((span) => span.name === name)
}

/**
 * Mimics the `res` object express hands over to the request handler. The
 * response is only flushed once `finish` is emitted.
 */
function createFakeResponse() {
  const res = new EventEmitter() as any
  res.statusCode = 200
  res.writableEnded = false
  res.finishWith = (statusCode: number) => {
    res.statusCode = statusCode
    res.writableEnded = true
    res.emit("finish")
  }
  return res
}

describe("HTTP Instrumentation", () => {
  let request

  afterEach(function () {
    jest.clearAllMocks()
    exporter.reset()
  })

  beforeAll(async function () {
    new NodeTracerProvider({
      spanProcessors: [new SimpleSpanProcessor(exporter)],
    }).register()

    instrumentHttpLayer()

    const rootDir = resolve(__dirname, "../__fixtures__/routers")

    const { request: request_ } = await createServer(rootDir)

    request = request_
  })

  afterAll(function () {
    exporter.shutdown()
  })

  describe("traceRoute", () => {
    it("should be handled by the error handler when a route fails", async () => {
      const res = await request("GET", "/admin/fail", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })

      expect(res.status).toBe(400)
      expect(res.body).toEqual({
        type: MedusaError.Types.INVALID_DATA,
        message: "Failed",
      })
    })

    it("should not report a handled 4xx error as an error on the span", async () => {
      const res = await request("GET", "/admin/fail", {
        adminSession: { jwt: { userId: "admin_user" } },
      })

      expect(res.status).toBe(400)

      const span = findSpan("route handler: /admin/fail")
      expect(span!.status.code).toEqual(SpanStatusCode.UNSET)
      expect(span!.attributes["http.status_code"]).toEqual(400)
    })

    it("should report an unexpected error as an error on the span", async () => {
      const res = await request("GET", "/admin/fail-unexpected", {
        adminSession: { jwt: { userId: "admin_user" } },
      })

      expect(res.status).toBe(500)

      const span = findSpan("route handler: /admin/fail-unexpected")
      expect(span!.status).toEqual({
        code: SpanStatusCode.ERROR,
        message: "Something went wrong",
      })
      expect(span!.attributes["http.status_code"]).toEqual(500)
    })
  })

  describe("traceMiddleware", () => {
    const runMiddleware = async (error: Error) => {
      const handler = ApiLoader.traceMiddleware!(
        function failingMiddleware() {
          throw error
        },
        { route: "/admin/fail" }
      )

      await expect(
        (handler as any)({ originalUrl: "/admin/fail" }, {}, jest.fn())
      ).rejects.toThrow(error)

      return findSpan("middleware: failing_middleware")
    }

    it("should not report a handled 4xx error as an error on the span", async () => {
      const span = await runMiddleware(
        new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid promo code")
      )

      expect(span!.status.code).toEqual(SpanStatusCode.UNSET)
      expect(span!.attributes["http.status_code"]).toEqual(400)
    })

    it("should report an unexpected error as an error on the span", async () => {
      const span = await runMiddleware(new Error("Something went wrong"))

      expect(span!.status).toEqual({
        code: SpanStatusCode.ERROR,
        message: "Something went wrong",
      })
      expect(span!.attributes["http.status_code"]).toEqual(500)
    })
  })

  describe("traceRequestHandler", () => {
    const traceRequest = (statusCode: number) => {
      const { traceRequestHandler } = require("../../commands/start")
      const res = createFakeResponse()

      const traced = traceRequestHandler(
        async () => {
          // express returns before the response has been written
          setImmediate(() => res.finishWith(statusCode))
        },
        { method: "GET", url: "/admin/orders", headers: {} },
        res,
        "/admin/orders"
      )

      return traced.then(() => findSpan("/admin/orders"))
    }

    it("should end the span with the status code the response was flushed with", async () => {
      const span = await traceRequest(400)

      expect(span!.status.code).toEqual(SpanStatusCode.UNSET)
      expect(span!.attributes["http.status_code"]).toEqual(400)
    })

    it("should report a 5xx response as an error on the span", async () => {
      const span = await traceRequest(500)

      expect(span!.status.code).toEqual(SpanStatusCode.ERROR)
      expect(span!.attributes["http.status_code"]).toEqual(500)
    })

    it("should not report sensitive headers or query param values as span attributes", async () => {
      const { traceRequestHandler } = require("../../commands/start")
      const res = createFakeResponse()

      await traceRequestHandler(
        async () => {
          setImmediate(() => res.finishWith(200))
        },
        {
          method: "GET",
          url: "/admin/customers?q=jane%40example.com&limit=10",
          headers: {
            authorization: "Bearer secret-token",
            "proxy-authorization": "Basic secret",
            cookie: "connect.sid=secret-session",
            "x-publishable-api-key": "pk_secret",
            "x-api-key": "sk_secret",
            "x-custom-auth-token": "secret",
            "user-agent": "jest",
            "x-request-id": "req_123",
          },
        },
        res,
        "/admin/customers"
      )

      const span = findSpan("/admin/customers")!

      expect(span.attributes).toEqual(
        expect.objectContaining({
          "http.route": "/admin/customers",
          "http.url": "/admin/customers",
          "http.method": "GET",
          "http.status_code": 200,
          "url.query": "q=REDACTED&limit=10",
          "user-agent": "jest",
          "x-request-id": "req_123",
        })
      )
      for (const header of [
        "authorization",
        "proxy-authorization",
        "cookie",
        "x-publishable-api-key",
        "x-api-key",
        "x-custom-auth-token",
      ]) {
        expect(span.attributes).not.toHaveProperty([header])
      }
      expect(JSON.stringify(span.attributes)).not.toContain("secret")
      expect(JSON.stringify(span.attributes)).not.toContain("jane")
    })

    describe("url.query", () => {
      const traceQuery = async (url: string) => {
        const { traceRequestHandler } = require("../../commands/start")
        const res = createFakeResponse()

        await traceRequestHandler(
          async () => {
            setImmediate(() => res.finishWith(200))
          },
          { method: "GET", url, headers: {} },
          res,
          "/store/products"
        )

        return findSpan("/store/products")!.attributes["url.query"]
      }

      afterEach(() => {
        instrumentHttpLayer()
      })

      it("should report allowed query params and redact the others by default", async () => {
        const query = await traceQuery(
          "/store/products?fields=*variants,%2Bthumbnail&limit=50&offset=100&order=-created_at&q=shoes&category_id[]=pcat_1&code=oauth_code"
        )

        expect(query).toEqual(
          "fields=*variants,%2Bthumbnail&limit=50&offset=100&order=-created_at&q=REDACTED&category_id[]=REDACTED&code=REDACTED"
        )
      })

      it("should not report url.query when the url has no query string", async () => {
        expect(await traceQuery("/store/products")).toBeUndefined()
      })

      it("should only report the configured query params", async () => {
        instrumentHttpLayer({ allowedQueryParams: ["q", "category_id"] })

        const query = await traceQuery(
          "/store/products?q=shoes&category_id[]=pcat_1&limit=50"
        )

        expect(query).toEqual("q=shoes&category_id[]=pcat_1&limit=REDACTED")
      })

      it("should report the full query string when all query params are allowed", async () => {
        instrumentHttpLayer({ allowedQueryParams: "*" })

        const query = await traceQuery("/store/products?q=shoes&code=abc")

        expect(query).toEqual("q=shoes&code=abc")
      })
    })
  })
})
