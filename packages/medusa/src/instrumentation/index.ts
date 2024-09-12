import { RoutesLoader, Tracer } from "@medusajs/framework"
import start from "../commands/start"
import { snakeCase } from "lodash"

const excludedResources = [".vite", "virtual:"]

function shouldExcludeResource(resource: string) {
  return excludedResources.some((excludedResource) =>
    resource.includes(excludedResource)
  )
}

/**
 * Instrumenting the first touch point of the Http layer to report traces to
 * OpenTelemetry
 */
export function instrumentHttpLayer() {
  const HTTPTracer = new Tracer("medusajs/http", "2.0.0")

  start.traceHttp = async (fn: () => Promise<void>, req: any) => {
    if (shouldExcludeResource(req.url)) {
      return await fn()
    }

    const traceName = `${req.method} ${req.url}`
    await HTTPTracer.trace(traceName, async (span) => {
      span.setAttributes({
        url: req.url,
        method: req.method,
        ...req.headers,
      })

      try {
        await fn()
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
        span.setAttributes({
          url: req.originalUrl,
          method: req.method,
          ...req.headers,
        })

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
        span.setAttributes({
          url: req.originalUrl,
          method: req.method,
          ...req.headers,
        })

        try {
          await handler(req, res, next)
        } finally {
          span.end()
        }
      })
    }
  })
}
