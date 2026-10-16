import { resolve } from "path"
import { createServer } from "../__fixtures__/server"
import { instrumentHttpLayer, instrumentWorkflows } from "../index"
import { MedusaError } from "@medusajs/framework/utils"
import { ApiLoader } from "@medusajs/framework/http"
import {
  TransactionOrchestrator,
  TransactionState,
} from "@medusajs/framework/orchestration"
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

  beforeAll(function () {
    new NodeTracerProvider({
      spanProcessors: [new SimpleSpanProcessor(exporter)],
    }).register()

    instrumentHttpLayer()
    instrumentWorkflows()
  })

  afterAll(function () {
    exporter.shutdown()
  })

  describe("traceRoute", () => {
    beforeAll(async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")
      const { request: request_ } = await createServer(rootDir)
      request = request_
    })

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
  })

  describe("Workflow instrumentation", () => {
    function exceptionEvents(span: { events: { name: string }[] }) {
      return span.events.filter((event) => event.name === "exception")
    }

    const traceTransaction = (
      state: TransactionState,
      errors: unknown[] = []
    ) => {
      return TransactionOrchestrator.traceTransaction!(
        async () => undefined,
        {
          model_id: "updateCartPromotions",
          transaction_id: "trx_1",
          flow_metadata: undefined,
        },
        {
          getState: () => state,
          getErrors: () => errors.map((error) => ({ error })),
        } as any
      ).then(() => findSpan("workflow:update_cart_promotions"))
    }

    it("should mark a finished workflow as ok", async () => {
      const span = await traceTransaction(TransactionState.DONE)

      expect(span!.status.code).toEqual(SpanStatusCode.OK)
      expect(span!.attributes["workflow.state"]).toEqual(TransactionState.DONE)
      expect(span!.attributes["workflow.transaction_id"]).toEqual("trx_1")
    })

    it("should not report a serialized client error as a failed workflow", async () => {
      const span = await traceTransaction(TransactionState.REVERTED, [
        {
          name: "Error",
          type: MedusaError.Types.INVALID_DATA,
          message: "The promotion code NOPE is invalid",
        },
      ])

      expect(span!.status.code).toEqual(SpanStatusCode.UNSET)
      expect(exceptionEvents(span!)).toEqual([])
      expect(span!.attributes["workflow.state"]).toEqual(
        TransactionState.REVERTED
      )
      expect(span!.attributes["workflow.error.type"]).toEqual("invalid_data")
      expect(span!.attributes["workflow.error.message"]).toEqual(
        "The promotion code NOPE is invalid"
      )
    })

    it("should report an unexpected workflow error as a failed span", async () => {
      const span = await traceTransaction(TransactionState.FAILED, [
        {
          type: MedusaError.Types.UNEXPECTED_STATE,
          message: "invariant broken",
        },
      ])

      expect(span!.status).toEqual({
        code: SpanStatusCode.ERROR,
        message: "invariant broken",
      })
      expect(exceptionEvents(span!)).toEqual([])
    })

    it("should report a reverted workflow with no error object as a failure", async () => {
      const span = await traceTransaction(TransactionState.REVERTED)

      expect(span!.status).toEqual({
        code: SpanStatusCode.ERROR,
        message: "Workflow reverted",
      })
    })

    it("should report a failure when any workflow error is not a client error", async () => {
      const span = await traceTransaction(TransactionState.REVERTED, [
        new MedusaError(MedusaError.Types.INVALID_DATA, "bad code"),
        new MedusaError(MedusaError.Types.DB_ERROR, "connection lost"),
      ])

      expect(span!.status).toEqual({
        code: SpanStatusCode.ERROR,
        message: "bad code; connection lost",
      })
      expect(exceptionEvents(span!)).toHaveLength(2)
    })

    it("should not report a handled step error as a failed span", async () => {
      const error = new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Provider identity with entity_id missing@example.com and provider emailpass not found"
      )

      await expect(
        TransactionOrchestrator.traceStep!(
          async () => {
            throw error
          },
          {
            action: "createPasswordResetToken",
            type: "invoke",
            step_id: "create-password-reset-token",
            step_uuid: "step_1",
            attempts: 1,
            failures: 1,
            async: false,
            idempotency_key: "key_1",
          }
        )
      ).rejects.toThrow(error)

      const span = findSpan("step:create_password_reset_token:invoke")
      expect(span!.status.code).toEqual(SpanStatusCode.UNSET)
      expect(exceptionEvents(span!)).toEqual([])
      expect(span!.attributes["workflow.error.type"]).toEqual("invalid_data")
    })

    it("should report an unexpected step error and rethrow it", async () => {
      const error = new Error("connection reset")

      await expect(
        TransactionOrchestrator.traceStep!(
          async () => {
            throw error
          },
          {
            action: "capturePayment",
            type: "invoke",
            step_id: "capture-payment",
            step_uuid: "step_2",
            attempts: 1,
            failures: 1,
            async: false,
            idempotency_key: "key_2",
          }
        )
      ).rejects.toThrow(error)

      const span = findSpan("step:capture_payment:invoke")
      expect(span!.status).toEqual({
        code: SpanStatusCode.ERROR,
        message: "connection reset",
      })
      expect(exceptionEvents(span!)).toHaveLength(1)
    })

    it("should mark a successful step as ok", async () => {
      await TransactionOrchestrator.traceStep!(async () => "done", {
        action: "validateCart",
        type: "invoke",
        step_id: "validate-cart",
        step_uuid: "step_3",
        attempts: 1,
        failures: 0,
        async: false,
        idempotency_key: "key_3",
      })

      const span = findSpan("step:validate_cart:invoke")
      expect(span!.status.code).toEqual(SpanStatusCode.OK)
    })

    it("should mark an in-progress workflow resume as ok", async () => {
      const span = await traceTransaction(TransactionState.INVOKING)

      expect(span!.status.code).toEqual(SpanStatusCode.OK)
      expect(span!.attributes["workflow.state"]).toEqual(
        TransactionState.INVOKING
      )
    })

    it("should trace a resume of a workflow that has async steps", async () => {
      const installed = TransactionOrchestrator.traceTransaction
      const traced = jest.fn(async () => undefined)
      TransactionOrchestrator.traceTransaction = traced

      const orchestrator = new TransactionOrchestrator({
        id: "updateCartPromotions",
        definition: {} as any,
        isClone: true,
      })
      const transaction = {
        modelId: "updateCartPromotions",
        transactionId: "trx_async",
        hasFinished: () => false,
        getFlow: () => ({
          hasAsyncSteps: true,
          metadata: { sourcePath: "src/workflows/update-cart.ts" },
        }),
      }

      try {
        await orchestrator.resume(transaction as any)
      } finally {
        TransactionOrchestrator.traceTransaction = installed
      }

      expect(traced).toHaveBeenCalledTimes(1)
      expect(traced).toHaveBeenCalledWith(
        expect.any(Function),
        {
          model_id: "updateCartPromotions",
          transaction_id: "trx_async",
          flow_metadata: { sourcePath: "src/workflows/update-cart.ts" },
        },
        transaction
      )
    })
  })
})
