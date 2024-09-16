import { snakeCase } from "lodash"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { Resource } from "@opentelemetry/resources"
import { SpanStatusCode } from "@opentelemetry/api"
import { RoutesLoader, Tracer, Query } from "@medusajs/framework"
import {
  type SpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node"
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg"
import type { Instrumentation } from "@opentelemetry/instrumentation"

import start from "../commands/start"
import { applyStep, exportWorkflow } from "@medusajs/workflows-sdk"

const EXCLUDED_RESOURCES = [".vite", "virtual:"]

function shouldExcludeResource(resource: string) {
  return EXCLUDED_RESOURCES.some((excludedResource) =>
    resource.includes(excludedResource)
  )
}

/**
 * Instrumen the first touch point of the HTTP layer to report traces to
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
      `query.graph: ${queryOptions.entryPoint}`,
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

  exportWorkflow.traceRun = (workflowRunner, workflowId) => {
    return async function (args) {
      return await WorkflowsTracer.trace(
        `workflow:${snakeCase(workflowId)}`,
        async function (span) {
          if (args?.context) {
            span.setAttributes({
              "workflow.transaction_id": args.context.transactionId,
              "workflow.group_id": args.context?.eventGroupId,
            })
            if ("metadata" in args.context) {
              Object.entries(args.context).forEach(([key, value]) => {
                span.setAttribute(
                  `workflow-step.${key}`,
                  value as string | number
                )
              })
            }
          }
          return workflowRunner(args).finally(() => span.end())
        }
      )
    }
  }

  applyStep.traceInvoke = (invokeFn, stepName) => {
    return async function (args) {
      return await WorkflowsTracer.trace(
        `step_invoke:${snakeCase(stepName)}`,
        async function (span) {
          span.setAttributes({
            "workflow-step.transaction_id": args.transaction.transactionId,
            "workflow-step.id": args.step.id,
            "workflow-step.uuid": args.step.uuid,
            "workflow-step.group_id": args.context?.eventGroupId,
            "workflow-step.attempts": args.step.attempts,
            "workflow-step.failures": args.step.failures,
          })
          Object.entries(args.metadata).forEach(([key, value]) => {
            span.setAttribute(`workflow-step.${key}`, value)
          })
          return invokeFn(args).finally(() => span.end())
        }
      )
    }
  }

  applyStep.traceCompensate = (invokeFn, stepName) => {
    return async function (args) {
      return await WorkflowsTracer.trace(
        `step_compensate:${snakeCase(stepName)}`,
        async function (span) {
          span.setAttributes({
            "workflow-step.transaction_id": args.transaction.transactionId,
            "workflow-step.id": args.step.id,
            "workflow-step.uuid": args.step.uuid,
            "workflow-step.group_id": args.context?.eventGroupId,
            "workflow-step.attempts": args.step.attempts,
            "workflow-step.failures": args.step.failures,
          })
          Object.entries(args.metadata).forEach(([key, value]) => {
            span.setAttribute(`workflow-step.${key}`, value)
          })
          return invokeFn(args).finally(() => span.end())
        }
      )
    }
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
  sdk.start()
  return sdk
}
