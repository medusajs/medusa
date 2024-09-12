import { snakeCase } from "lodash"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { Resource } from "@opentelemetry/resources"
import { RoutesLoader, Tracer } from "@medusajs/framework"
import {
  type SpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node"
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg"
import type { Instrumentation } from "@opentelemetry/instrumentation"

import start from "../commands/start"

const EXCLUDED_RESOURCES = [".vite", "virtual:"]

function shouldExcludeResource(resource: string) {
  return EXCLUDED_RESOURCES.some((excludedResource) =>
    resource.includes(excludedResource)
  )
}

/**
 * Instrumenting the first touch point of the Http layer to report traces to
 * OpenTelemetry
 */
export function instrumentHttpLayer() {
  const HTTPTracer = new Tracer("@medusajs/http", "2.0.0")

  start.traceRequestHandler = async (requestHandler, req) => {
    if (shouldExcludeResource(req.url!)) {
      return await requestHandler()
    }

    const traceName = `${req.method} ${req.url}`
    await HTTPTracer.trace(traceName, async (span) => {
      span.setAttributes({
        url: req.url,
        method: req.method,
        ...req.headers,
      })

      try {
        await requestHandler()
      } finally {
        span.end()
      }
    })
  }

  /**
   * Instrumenting the route handler to report traces to
   * OpenTelemetry
   */
  RoutesLoader.instrument.route((handler) => {
    const traceName = handler.name
      ? snakeCase(handler.name)
      : `anonymous route handler`

    return async (req, res) => {
      if (shouldExcludeResource(req.originalUrl)) {
        return await handler(req, res)
      }

      await HTTPTracer.trace(traceName, async (span) => {
        try {
          await handler(req, res)
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
    const traceName = handler.name
      ? snakeCase(handler.name)
      : `anonymous middleware handler`

    return async (req, res, next) => {
      if (shouldExcludeResource(req.originalUrl)) {
        return await handler(req, res, next)
      }

      await HTTPTracer.trace(traceName, async (span) => {
        try {
          await handler(req, res, next)
        } finally {
          span.end()
        }
      })
    }
  })
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
