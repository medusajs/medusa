import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  Query,
} from "@medusajs/framework"
import { ApiLoader, getHttpResponseFromError } from "@medusajs/framework/http"
import { Span, SpanStatusCode } from "@medusajs/framework/opentelemetry/api"
import type { NodeSDKConfiguration } from "@medusajs/framework/opentelemetry/sdk-node"
import type { SpanExporter } from "@medusajs/framework/opentelemetry/sdk-trace-node"
import {
  type DistributedTransactionType,
  TransactionOrchestrator,
  TransactionState,
} from "@medusajs/framework/orchestration"
import { Tracer } from "@medusajs/framework/telemetry"
import { ICachingModuleService } from "@medusajs/framework/types"
import { camelToSnakeCase, FeatureFlag } from "@medusajs/framework/utils"
import CacheModule from "../modules/caching"

const EXCLUDED_RESOURCES = [".vite", "virtual:"]

function shouldExcludeResource(resource: string) {
  return EXCLUDED_RESOURCES.some((excludedResource) =>
    resource.includes(excludedResource)
  )
}

function setHttpStatusCode(span: Span, statusCode: number) {
  span.setAttributes({
    // "http.statusCode" is not a semantic convention, but it has been
    // reported for a while. Keep it alongside the canonical attribute, which
    // is what tracing backends use to classify the span.
    "http.statusCode": statusCode,
    "http.status_code": statusCode,
  })
}

/**
 * Errors thrown by a middleware or a route handler are converted into an HTTP
 * response by the error handler, which only runs once the span has already
 * been ended. Classifying the span from the status code the error maps to
 * keeps handled client errors (eg. INVALID_DATA -> 400) from being reported
 * as internal errors.
 */
function setSpanStatusFromError(span: Span, error: any) {
  const { statusCode } = getHttpResponseFromError(error)
  setHttpStatusCode(span, statusCode)

  if (statusCode >= 500) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message || "Failed",
    })
  }
}

/**
 * Express hands back control before the response has been written, so the
 * final status code is only known once the response is flushed.
 */
function onResponseFinished(res: any): Promise<void> | void {
  if (res.writableEnded) {
    return
  }

  return new Promise<void>((resolve) => {
    res.once("finish", () => resolve())
    res.once("close", () => resolve())
  })
}

/**
 * Instrument the first touch point of the HTTP layer to report traces to
 * OpenTelemetry
 */
export function instrumentHttpLayer() {
  const startCommand = require("../commands/start")
  const HTTPTracer = new Tracer("@medusajs/http", "2.0.0")

  startCommand.traceRequestHandler = async (
    requestHandler,
    req,
    res,
    handlerPath
  ) => {
    if (shouldExcludeResource(req.url!)) {
      return await requestHandler()
    }

    const traceName = handlerPath ?? `${req.method} ${req.url}`
    await HTTPTracer.trace(traceName, async (span) => {
      span.setAttributes({
        "http.route": handlerPath,
        "http.url": req.url,
        "http.method": req.method,
        ...req.headers,
      })

      try {
        await requestHandler()
        await onResponseFinished(res)
      } finally {
        if (res.statusCode >= 500) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: `Failed with ${res.statusMessage}`,
          })
        }
        setHttpStatusCode(span, res.statusCode)
        span.end()
      }
    })
  }

  /**
   * Instrumenting the route handler to report traces to
   * OpenTelemetry
   */
  ApiLoader.traceRoute = (handler) => {
    return async (req, res) => {
      if (shouldExcludeResource(req.originalUrl)) {
        return await handler(req, res)
      }

      const label = req.route?.path ?? `${req.method} ${req.originalUrl}`
      const traceName = `route handler: ${label}`

      await HTTPTracer.trace(traceName, async (span) => {
        try {
          await handler(req, res)
        } catch (error) {
          setSpanStatusFromError(span, error)
          throw error
        } finally {
          span.end()
        }
      })
    }
  }

  /**
   * Instrumenting the middleware handler to report traces to
   * OpenTelemetry
   */
  ApiLoader.traceMiddleware = (handler) => {
    return async (
      req: MedusaRequest<any>,
      res: MedusaResponse,
      next: MedusaNextFunction
    ) => {
      if (shouldExcludeResource(req.originalUrl)) {
        return handler(req, res, next)
      }

      const traceName = `middleware: ${
        handler.name ? camelToSnakeCase(handler.name) : `anonymous`
      }`

      await HTTPTracer.trace(traceName, async (span) => {
        try {
          await handler(req, res, next)
        } catch (error) {
          setSpanStatusFromError(span, error)
          throw error
        } finally {
          span.end()
        }
      })
    }
  }
}

/**
 * Instrument the queries made using the remote query
 */
export function instrumentRemoteQuery() {
  const QueryTracer = new Tracer("@medusajs/query", "2.0.0")

  Query.instrument.graphQuery(async function (queryFn, queryOptions) {
    return await QueryTracer.trace(
      `query.graph: ${queryOptions.entity}`,
      async (span) => {
        span.setAttributes({
          "query.fields": queryOptions.fields,
        })
        try {
          return await queryFn()
        } catch (err) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: err.message,
          })
          throw err
        } finally {
          span.end()
        }
      }
    )
  })

  Query.instrument.remoteQuery(async function (queryFn, queryOptions) {
    const traceIdentifier =
      "entryPoint" in queryOptions
        ? queryOptions.entryPoint
        : "service" in queryOptions
        ? queryOptions.service
        : "__value" in queryOptions
        ? Object.keys(queryOptions.__value)[0]
        : "unknown source"

    return await QueryTracer.trace(
      `remoteQuery: ${traceIdentifier}`,
      async (span) => {
        span.setAttributes({
          "query.fields": "fields" in queryOptions ? queryOptions.fields : [],
        })

        try {
          return await queryFn()
        } catch (error) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
          })
          throw error
        } finally {
          span.end()
        }
      }
    )
  })

  Query.instrument.remoteDataFetch(async function (
    fetchFn,
    serviceName,
    method,
    options
  ) {
    return await QueryTracer.trace(
      `${camelToSnakeCase(serviceName)}.${camelToSnakeCase(method)}`,
      async (span) => {
        span.setAttributes({
          "fetch.select": options.select,
          "fetch.relations": options.relations,
        })

        try {
          return await fetchFn()
        } catch (error) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
          })
          throw error
        } finally {
          span.end()
        }
      }
    )
  })
}

const FAILED_WORKFLOW_STATES = new Set<TransactionState>([
  TransactionState.REVERTED,
  TransactionState.FAILED,
])

function readErrorType(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined
  }

  const { type, name } = error as { type?: unknown; name?: unknown }
  if (typeof type === "string" && type.length > 0) {
    return type
  }
  if (typeof name === "string" && name.length > 0) {
    return name
  }
  return undefined
}

function errorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === "string") {
      return message
    }
  }

  return error == null ? "" : String(error)
}

/**
 * A reverted workflow is not an internal failure when every step error is a
 * handled client error. `getHttpResponseFromError` is the same mapping HTTP
 * spans use, so INVALID_DATA (an unknown promo code, a password reset for an
 * unknown account) stays a 400 and is not reported as an internal error.
 *
 * `resume()` resolves when a step fails. By the time the workflow span reads
 * `getErrors()`, `setStepFailure` has replaced the thrown value with
 * `serializeError()`, which copies own fields such as `type`. The step span
 * still sees the original error. Both classify through this helper.
 *
 * Client errors leave the span UNSET. Setting OK would mean the operation
 * succeeded, and an exception event alone is enough for a tracing backend to
 * count the span as failed, so those are not recorded. The type and message
 * stay as attributes. Any other reverted or failed outcome, including a
 * timeout with no error object, is SpanStatusCode.ERROR.
 *
 * A retryable step failure does not change this. `setStepFailure` leaves the
 * transaction `invoking` until `failures > maxRetries`, and this span is one
 * resume, so it is OK while retries remain. The resume that runs after the
 * retries are used up ends `reverted` or `failed` and is ERROR. The step span
 * is ERROR for every thrown attempt, including one that will be retried.
 */
function applyWorkflowFailureStatus(
  span: Span,
  errors: unknown[],
  fallbackMessage: string
) {
  const handledClientErrors =
    errors.length > 0 &&
    errors.every(
      (error) =>
        !!error &&
        typeof error === "object" &&
        getHttpResponseFromError(error).statusCode < 500
    )

  if (handledClientErrors) {
    const types = errors.flatMap((error) => {
      const type = readErrorType(error)
      return type ? [type] : []
    })
    span.setAttribute("workflow.error.type", [...new Set(types)].join("; "))

    const message = errors.map(errorMessage).filter(Boolean).join("; ")
    if (message) {
      span.setAttribute("workflow.error.message", message)
    }
    return
  }

  const message = errors.map(errorMessage).filter(Boolean).join("; ")
  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: message || fallbackMessage,
  })
  for (const error of errors) {
    if (error instanceof Error) {
      span.recordException(error)
    }
  }
}

function setWorkflowSpanStatus(
  span: Span,
  transaction: DistributedTransactionType
) {
  const state = transaction.getState()
  span.setAttribute("workflow.state", state)

  if (FAILED_WORKFLOW_STATES.has(state)) {
    applyWorkflowFailureStatus(
      span,
      transaction.getErrors().map((entry) => entry.error),
      `Workflow ${state}`
    )
    return
  }

  span.setStatus({ code: SpanStatusCode.OK })
}

/**
 * Instrument the workflows and steps execution
 */
export function instrumentWorkflows() {
  const WorkflowsTracer = new Tracer(
    "@medusajs/framework/workflows-sdk",
    "2.0.0"
  )

  TransactionOrchestrator.traceTransaction = async (
    transactionResumeFn,
    metadata,
    transaction
  ) => {
    return await WorkflowsTracer.trace(
      `workflow:${camelToSnakeCase(metadata.model_id)}`,
      async function (span) {
        span.setAttribute("workflow.transaction_id", metadata.transaction_id)

        if (metadata.flow_metadata) {
          Object.entries(metadata.flow_metadata).forEach(([key, value]) => {
            span.setAttribute(`workflow.flow_metadata.${key}`, value as string)
          })
        }

        let resumeFailed = false
        try {
          return await transactionResumeFn()
        } catch (error) {
          // A step failure does not reject resume(). A rejection here means
          // the orchestrator itself failed, which is always an internal error.
          resumeFailed = true
          const message = error instanceof Error ? error.message : ""
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: message || "Workflow failed",
          })
          if (error instanceof Error) {
            span.recordException(error)
          }
          throw error
        } finally {
          if (!resumeFailed) {
            setWorkflowSpanStatus(span, transaction)
          } else {
            span.setAttribute("workflow.state", transaction.getState())
          }
          span.end()
        }
      }
    )
  }

  TransactionOrchestrator.traceStep = async (stepHandler, metadata) => {
    return await WorkflowsTracer.trace(
      `step:${camelToSnakeCase(metadata.action)}:${metadata.type}`,
      async function (span) {
        Object.entries(metadata).forEach(([key, value]) => {
          span.setAttribute(`workflow.step.${key}`, value)
        })

        try {
          const result = await stepHandler()
          span.setStatus({ code: SpanStatusCode.OK })
          return result
        } catch (error) {
          applyWorkflowFailureStatus(
            span,
            [error],
            (error as Error).message || "Step failed"
          )
          throw error
        } finally {
          span.end()
        }
      }
    )
  }
}

export function instrumentCache() {
  if (!FeatureFlag.isFeatureEnabled("caching")) {
    return
  }

  const CacheTracer = new Tracer("@medusajs/caching", "2.0.0")
  const cacheModule_ = CacheModule as unknown as {
    service: ICachingModuleService & {
      traceGet: (
        cacheGetFn: () => Promise<any>,
        key: string,
        tags: string[]
      ) => Promise<any>
      traceSet: (
        cacheSetFn: () => Promise<any>,
        key: string,
        tags: string[],
        options: { autoInvalidate?: boolean }
      ) => Promise<any>
      traceClear: (
        cacheClearFn: () => Promise<any>,
        key: string,
        tags: string[],
        options: { autoInvalidate?: boolean }
      ) => Promise<any>
    }
  }

  cacheModule_.service.traceGet = async function (cacheGetFn, key, tags) {
    return await CacheTracer.trace(`cache.get`, async (span) => {
      span.setAttributes({
        "cache.key": key,
        "cache.tags": tags,
      })

      try {
        return await cacheGetFn()
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        })
        throw error
      } finally {
        span.end()
      }
    })
  }

  cacheModule_.service.traceSet = async function (
    cacheSetFn,
    key,
    tags,
    options = {}
  ) {
    return await CacheTracer.trace(`cache.set`, async (span) => {
      span.setAttributes({
        "cache.key": key,
        "cache.tags": tags,
        "cache.options": JSON.stringify(options),
      })

      try {
        return await cacheSetFn()
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        })
        throw error
      } finally {
        span.end()
      }
    })
  }

  cacheModule_.service.traceClear = async function (
    cacheClearFn,
    key,
    tags,
    options = {}
  ) {
    return await CacheTracer.trace(`cache.clear`, async (span) => {
      span.setAttributes({
        "cache.key": key,
        "cache.tags": tags,
        "cache.options": JSON.stringify(options),
      })

      try {
        return await cacheClearFn()
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        })
        throw error
      } finally {
        span.end()
      }
    })
  }
}

/**
 * A helper function to configure the OpenTelemetry SDK with some defaults.
 * For better/more control, please configure the SDK manually.
 *
 * You will have to install the following packages within your app for
 * telemetry to work
 *
 * - @opentelemetry/sdk-node
 * - @opentelemetry/resources
 * - @opentelemetry/sdk-trace-node
 * - @opentelemetry/instrumentation-pg
 * - @opentelemetry/instrumentation
 */
export function registerOtel(
  options: Partial<NodeSDKConfiguration> & {
    serviceName: string
    exporter?: SpanExporter
    instrument?: Partial<{
      http: boolean
      query: boolean
      workflows: boolean
      db: boolean
      cache: boolean
    }>
  }
) {
  const {
    exporter,
    serviceName,
    instrument,
    instrumentations,
    ...nodeSdkOptions
  } = {
    instrument: {},
    instrumentations: [],
    ...options,
  }

  const {
    Resource,
    resourceFromAttributes,
  } = require("@medusajs/framework/opentelemetry/resources")
  const { NodeSDK } = require("@medusajs/framework/opentelemetry/sdk-node")
  const {
    SimpleSpanProcessor,
  } = require("@medusajs/framework/opentelemetry/sdk-trace-node")

  if (instrument.db) {
    const {
      PgInstrumentation,
    } = require("@medusajs/framework/opentelemetry/instrumentation-pg")
    instrumentations.push(new PgInstrumentation())
  }
  if (instrument.http) {
    instrumentHttpLayer()
  }
  if (instrument.query) {
    instrumentRemoteQuery()
  }
  if (instrument.workflows) {
    instrumentWorkflows()
  }
  if (instrument.cache) {
    instrumentCache()
  }

  const sdk = new NodeSDK({
    serviceName,
    /**
     * Older version of "@opentelemetry/resources" exports the "Resource" class.
     * Whereas, the new one exports the "resourceFromAttributes" method.
     */
    resource: resourceFromAttributes
      ? resourceFromAttributes({
          "service.name": serviceName,
        })
      : new Resource({ "service.name": serviceName }),
    spanProcessor: new SimpleSpanProcessor(exporter),
    ...nodeSdkOptions,
    instrumentations: instrumentations,
  } satisfies Partial<NodeSDKConfiguration>)

  sdk.start()
  return sdk
}
