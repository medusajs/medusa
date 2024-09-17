import { Query, RoutesLoader, Tracer } from "@medusajs/framework"
import { SpanStatusCode } from "@opentelemetry/api"
import type { Instrumentation } from "@opentelemetry/instrumentation"
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg"
import { Resource } from "@opentelemetry/resources"
import { NodeSDK } from "@opentelemetry/sdk-node"
import {
  SimpleSpanProcessor,
  type SpanExporter,
} from "@opentelemetry/sdk-trace-node"
import { snakeCase } from "lodash"

import start from "../commands/start"
import { TransactionOrchestrator } from "@medusajs/orchestration"

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
  const HTTPTracer = new Tracer("@medusajs/http", "2.0.0")

  start.traceRequestHandler = async (requestHandler, req, res) => {
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
  RoutesLoader.instrument.route((handler) => {
    const traceName = `route: ${
      handler.name ? snakeCase(handler.name) : `anonymous`
    }`

    return async (req, res) => {
      if (shouldExcludeResource(req.originalUrl)) {
        return await handler(req, res)
      }

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
  })

  /**
   * Instrumenting the middleware handler to report traces to
   * OpenTelemetry
   */
  RoutesLoader.instrument.middleware((handler) => {
    const traceName = `middleware: ${
      handler.name ? snakeCase(handler.name) : `anonymous`
    }`

    return async (req, res, next) => {
      if (shouldExcludeResource(req.originalUrl)) {
        return handler(req, res, next)
      }

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
  })
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
  const WorkflowsTracer = new Tracer("@medusajs/workflows-sdk", "2.0.0")

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
    remoteQuery: boolean
    workflows: boolean
  }>
  instrumentations?: Instrumentation[]
}) {
  const sdk = new NodeSDK({
    serviceName: options.serviceName,
    resource: new Resource({
      "service.name": options.serviceName,
    }),
    spanProcessor: new SimpleSpanProcessor(options.exporter),
    instrumentations: [
      new PgInstrumentation(),
      ...(options.instrumentations || []),
    ],
  })

  const instrument = options.instrument || {}
  if (instrument.http) {
    instrumentHttpLayer()
  }
  if (instrument.remoteQuery) {
    instrumentRemoteQuery()
  }
  if (instrument.workflows) {
    instrumentWorkflows()
  }

  sdk.start()
  return sdk
}
