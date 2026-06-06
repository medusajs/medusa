import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  Query,
} from "@zjedene-medusa/framework"
import { ApiLoader } from "@zjedene-medusa/framework/http"
import { SpanStatusCode } from "@zjedene-medusa/framework/opentelemetry/api"
import type { NodeSDKConfiguration } from "@zjedene-medusa/framework/opentelemetry/sdk-node"
import type { SpanExporter } from "@zjedene-medusa/framework/opentelemetry/sdk-trace-node"
import { TransactionOrchestrator } from "@zjedene-medusa/framework/orchestration"
import { Tracer } from "@zjedene-medusa/framework/telemetry"
import { ICachingModuleService } from "@zjedene-medusa/framework/types"
import { camelToSnakeCase, FeatureFlag } from "@zjedene-medusa/framework/utils"
import CacheModule from "../modules/caching"

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
  const HTTPTracer = new Tracer("@zjedene-medusa/http", "2.0.0")

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
}

/**
 * Instrument the queries made using the remote query
 */
export function instrumentRemoteQuery() {
  const QueryTracer = new Tracer("@zjedene-medusa/query", "2.0.0")

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

/**
 * Instrument the workflows and steps execution
 */
export function instrumentWorkflows() {
  const WorkflowsTracer = new Tracer(
    "@zjedene-medusa/framework/workflows-sdk",
    "2.0.0"
  )

  TransactionOrchestrator.traceTransaction = async (
    transactionResumeFn,
    metadata
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

        return await transactionResumeFn().finally(() => span.end())
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

        // TODO: should we report error and re throw it?
        return await stepHandler().finally(() => span.end())
      }
    )
  }
}

export function instrumentCache() {
  if (!FeatureFlag.isFeatureEnabled("caching")) {
    return
  }

  const CacheTracer = new Tracer("@zjedene-medusa/caching", "2.0.0")
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
  } = require("@zjedene-medusa/framework/opentelemetry/resources")
  const { NodeSDK } = require("@zjedene-medusa/framework/opentelemetry/sdk-node")
  const {
    SimpleSpanProcessor,
  } = require("@zjedene-medusa/framework/opentelemetry/sdk-trace-node")

  if (instrument.db) {
    const {
      PgInstrumentation,
    } = require("@zjedene-medusa/framework/opentelemetry/instrumentation-pg")
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
