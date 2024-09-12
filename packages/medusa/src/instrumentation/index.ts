import { Tracer, RoutesLoader } from "@medusajs/framework"

export function instrumentHttpLayer() {
  const HTTPTracer = new Tracer("medusajs/http", "2.0.0")

  /**
   * Instrumenting the route handler to report traces to
   * OpenTelemetry
   */
  RoutesLoader.instrument.route((handler) => {
    return async (req, res) => {
      await HTTPTracer.trace(
        handler.name || "anonymous route handler",
        async (span) => {
          span.setAttributes({
            url: req.url,
            method: req.method,
            ...req.headers,
          })

          try {
            await handler(req, res)
          } finally {
            span.end()
          }
        }
      )
    }
  })

  /**
   * Instrumenting the middleware handler to report traces to
   * OpenTelemetry
   */
  RoutesLoader.instrument.middleware((handler) => {
    return async (req, res, next) => {
      console.log("In middleeware")
      await HTTPTracer.trace(
        handler.name || "anonymous middleware handler",
        async (span) => {
          span.setAttributes({
            url: req.url,
            method: req.method,
            ...req.headers,
          })

          try {
            await handler(req, res, next)
          } finally {
            span.end()
          }
        }
      )
    }
  })
}
