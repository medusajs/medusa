import { snakeCase } from "lodash"
import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  Query,
} from "@medusajs/framework"
import { ApiRoutesLoader } from "@medusajs/framework/http"
import { Tracer } from "@medusajs/framework/telemetry"
import type { SpanExporter } from "@opentelemetry/sdk-trace-node"
import type { Instrumentation } from "@opentelemetry/instrumentation"
import { TransactionOrchestrator } from "@medusajs/framework/orchestration"

const EXCLUDED_RESOURCES = [".vite", "virtual:"]

function shouldExcludeResource(resource: string) {
  return EXCLUDED_RESOURCES.some((excludedResource) =>
    resource.includes(excludedResource)
  )
}

/**
 * Instrument the first touch point of the HTTP layer to report traces to
 * OpenTelemetry
 */
export function instrumentHttpLayer() {
  const startCommand = require("../commands/start")
  const HTTPTracer = new Tracer("@medusajs/http", "2.0.0")
  const { SpanStatusCode } = require("@opentelemetry/api")

  startCommand.traceRequestHandler = async (requestHandler, req, res) => {
    if (shouldExcludeResource(req.url!)) {
      return await requestHandler()
    }

    const traceName = `${req.method} ${req.url}`
    await HTTPTracer.trace(traceName, async (span) => {
      span.setAttributes({
        "http.url": req.url,
        "http.method": req.method,
        ...req.headers,
      })

      try {
        await requestHandler()
      } finally {
        if (res.statusCode >= 500) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: `Failed with ${res.statusMessage}`,
          })
        }
        span.setAttributes({ "http.statusCode": res.statusCode })
        span.end()
      }
    })
  }

  /**
   * Instrumenting the route handler to report traces to
   * OpenTelemetry
   */
  ApiRoutesLoader.traceRoute = (handler) => {
    return async (req, res) => {
      if (shouldExcludeResource(req.originalUrl)) {
        return await handler(req, res)
      }

      const traceName = `route: ${req.method} ${req.originalUrl}`

      await HTTPTracer.trace(traceName, async (span) => {
        try {
          await handler(req, res)
        } catch (error) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message || "Failed",
          })
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
  ApiRoutesLoader.traceMiddleware = (handler) => {
    return async (
      req: MedusaRequest<any>,
      res: MedusaResponse,
      next: MedusaNextFunction
    ) => {
      if (shouldExcludeResource(req.originalUrl)) {
        return handler(req, res, next)
      }

      const traceName = `middleware: ${
        handler.name ? snakeCase(handler.name) : `anonymous`
      }`

      await HTTPTracer.trace(traceName, async (span) => {
        return new Promise<void>((resolve, reject) => {
          const _next = (error?: any) => {
            if (error) {
              span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message || "Failed",
              })
              span.end()
              reject(error)
            } else {
              span.end()
              resolve()
            }
          }

          handler(req, res, _next)
        })
      })
        .catch(next)
        .then(next)
    }
  }
}

/**
 * Instrument the queries made using the remote query
 */
export function instrumentRemoteQuery() {
  const QueryTracer = new Tracer("@medusajs/query", "2.0.0")
  const { SpanStatusCode } = require("@opentelemetry/api")

  Query.instrument.graphQuery(async function (queryFn, queryOptions) {
    return await QueryTracer.trace(
      `query.graph: ${queryOptions.entity}`,
      async (span) => {
        span.setAttributes({
          "query.fields": queryOptions.fields,
        })
        return await queryFn()
          .catch((error) => {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error.message,
            })
          })
          .finally(() => span.end())
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
        return await queryFn()
          .catch((error) => {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error.message,
            })
          })
          .finally(() => span.end())
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
      `${snakeCase(serviceName)}.${snakeCase(method)}`,
      async (span) => {
        span.setAttributes({
          "fetch.select": options.select,
          "fetch.relations": options.relations,
        })
        return await fetchFn()
          .catch((error) => {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error.message,
            })
          })
          .finally(() => span.end())
      }
    )
  })
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
    metadata
  ) => {
    return await WorkflowsTracer.trace(
      `workflow:${snakeCase(metadata.model_id)}`,
      async function (span) {
        span.setAttribute("workflow.transaction_id", metadata.transaction_id)

        if (metadata.flow_metadata) {
          Object.entries(metadata.flow_metadata).forEach(([key, value]) => {
            span.setAttribute(`workflow.flow_metadata.${key}`, value as string)
          })
        }

        return await transactionResumeFn().finally(() => span.end())
      }
    )
  }

  TransactionOrchestrator.traceStep = async (stepHandler, metadata) => {
    return await WorkflowsTracer.trace(
      `step:${snakeCase(metadata.action)}:${metadata.type}`,
      async function (span) {
        Object.entries(metadata).forEach(([key, value]) => {
          span.setAttribute(`workflow.step.${key}`, value)
        })

        return await stepHandler().finally(() => span.end())
      }
    )
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
export function registerOtel(options: {
  serviceName: string
  exporter: SpanExporter
  instrument?: Partial<{
    http: boolean
    query: boolean
    workflows: boolean
    db: boolean
  }>
  instrumentations?: Instrumentation[]
}) {
  const { Resource } = require("@opentelemetry/resources")
  const { NodeSDK } = require("@opentelemetry/sdk-node")
  const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-node")

  const instrument = options.instrument || {}
  const instrumentations = options.instrumentations || []

  if (instrument.db) {
    const { PgInstrumentation } = require("@opentelemetry/instrumentation-pg")
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

  const sdk = new NodeSDK({
    serviceName: options.serviceName,
    resource: new Resource({
      "service.name": options.serviceName,
    }),
    spanProcessor: new SimpleSpanProcessor(options.exporter),
    instrumentations: instrumentations,
  })

  sdk.start()
  return sdk
}
