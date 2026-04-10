import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  Query,
} from "@medusajs/framework"
import { ApiLoader } from "@medusajs/framework/http"
import { SpanStatusCode, metrics } from "@medusajs/framework/opentelemetry/api"
import type { NodeSDKConfiguration } from "@medusajs/framework/opentelemetry/sdk-node"
import type { SpanExporter } from "@medusajs/framework/opentelemetry/sdk-trace-node"
import type { PushMetricExporter } from "@medusajs/framework/opentelemetry/sdk-metrics"
import { TransactionOrchestrator } from "@medusajs/framework/orchestration"
import { Tracer } from "@medusajs/framework/telemetry"
import { ICachingModuleService } from "@medusajs/framework/types"
import { camelToSnakeCase, FeatureFlag } from "@medusajs/framework/utils"
import CacheModule from "../modules/caching"
import {
  constants,
  monitorEventLoopDelay,
  PerformanceObserver,
  performance,
} from "perf_hooks"
import { getCloudExporters } from "./cloud"

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

export function startEventLoopMonitoring() {
  const elMonitor = monitorEventLoopDelay({ resolution: 10 })
  elMonitor.enable()

  const meter = metrics.getMeter("nodejs-event-loop-meter")

  const delayMinGauge = meter.createObservableGauge(
    "nodejs_eventloop_delay_min_ms",
    {
      description:
        "Min event loop delay in milliseconds (since last histogram reset)",
    }
  )

  const delayMeanGauge = meter.createObservableGauge(
    "nodejs_eventloop_delay_mean_ms",
    {
      description: "Mean event loop delay in milliseconds",
    }
  )

  const delayMaxGauge = meter.createObservableGauge(
    "nodejs_eventloop_delay_max_ms",
    {
      description: "Max event loop delay in milliseconds",
    }
  )

  const delayStddevGauge = meter.createObservableGauge(
    "nodejs_eventloop_delay_stddev_ms",
    {
      description: "Standard deviation of event loop delay in milliseconds",
    }
  )

  const delayP50Gauge = meter.createObservableGauge(
    "nodejs_eventloop_delay_p50_ms",
    {
      description: "50th percentile event loop delay in milliseconds",
    }
  )

  const delayP95Gauge = meter.createObservableGauge(
    "nodejs_eventloop_delay_p95_ms",
    {
      description: "95th percentile event loop delay in milliseconds",
    }
  )

  const delayP99Gauge = meter.createObservableGauge(
    "nodejs_eventloop_delay_p99_ms",
    {
      description: "99th percentile event loop delay in milliseconds",
    }
  )

  const utilizationGauge = meter.createObservableGauge(
    "nodejs_eventloop_utilization_ratio",
    {
      description:
        "Fraction of time the event loop was active (not idle) since the previous scrape; 0–1",
    }
  )

  let lastElu = performance.eventLoopUtilization()

  meter.addBatchObservableCallback(
    (observableResult) => {
      const toMs = (nanoseconds: number) => nanoseconds / 1e6
      observableResult.observe(delayMinGauge, toMs(elMonitor.min))
      observableResult.observe(delayMeanGauge, toMs(elMonitor.mean))
      observableResult.observe(delayMaxGauge, toMs(elMonitor.max))
      observableResult.observe(delayStddevGauge, toMs(elMonitor.stddev))
      observableResult.observe(delayP50Gauge, toMs(elMonitor.percentile(50)))
      observableResult.observe(delayP95Gauge, toMs(elMonitor.percentile(95)))
      observableResult.observe(delayP99Gauge, toMs(elMonitor.percentile(99)))

      const currentElu = performance.eventLoopUtilization()
      const delta = performance.eventLoopUtilization(lastElu, currentElu)
      lastElu = currentElu
      observableResult.observe(
        utilizationGauge,
        Number.isFinite(delta.utilization) ? delta.utilization : 0
      )
    },
    [
      delayMinGauge,
      delayMeanGauge,
      delayMaxGauge,
      delayStddevGauge,
      delayP50Gauge,
      delayP95Gauge,
      delayP99Gauge,
      utilizationGauge,
    ]
  )

  return () => {
    elMonitor.disable()
  }
}

function getGcTypeName(kind: number) {
  switch (kind) {
    case constants.NODE_PERFORMANCE_GC_MINOR:
      return "minor"
    case constants.NODE_PERFORMANCE_GC_MAJOR:
      return "major"
    case constants.NODE_PERFORMANCE_GC_INCREMENTAL:
      return "incremental"
    case constants.NODE_PERFORMANCE_GC_WEAKCB:
      return "weakcb"
    default:
      return "unknown"
  }
}

export function startRuntimeMonitoring() {
  const meter = metrics.getMeter("nodejs-runtime-meter")

  const heapUsedGauge = meter.createObservableGauge(
    "nodejs_memory_heap_used_bytes",
    {
      description: "V8 heap used",
    }
  )

  const heapTotalGauge = meter.createObservableGauge(
    "nodejs_memory_heap_total_bytes",
    {
      description: "V8 heap total",
    }
  )

  const rssGauge = meter.createObservableGauge("nodejs_memory_rss_bytes", {
    description: "Resident Set Size",
  })

  const externalGauge = meter.createObservableGauge(
    "nodejs_memory_external_bytes",
    {
      description:
        "Memory used by C++ objects bound to JavaScript (e.g. buffers)",
    }
  )

  const arrayBuffersGauge = meter.createObservableGauge(
    "nodejs_memory_array_buffers_bytes",
    {
      description: "Memory allocated for ArrayBuffers and SharedArrayBuffers",
    }
  )

  meter.addBatchObservableCallback(
    (observableResult) => {
      const memUsage = process.memoryUsage()
      observableResult.observe(heapUsedGauge, memUsage.heapUsed)
      observableResult.observe(heapTotalGauge, memUsage.heapTotal)
      observableResult.observe(rssGauge, memUsage.rss)
      observableResult.observe(externalGauge, memUsage.external)
      observableResult.observe(arrayBuffersGauge, memUsage.arrayBuffers ?? 0)
    },
    [heapUsedGauge, heapTotalGauge, rssGauge, externalGauge, arrayBuffersGauge]
  )

  // Garbage collection - We use a Histogram for GC because we want to measure the duration of discrete events
  const gcHistogram = meter.createHistogram("nodejs_gc_duration_seconds", {
    description: "Garbage collection duration",
    unit: "s",
  })

  let gcObserver: PerformanceObserver | undefined
  try {
    gcObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      for (const entry of entries) {
        const durationSeconds = entry.duration / 1000
        const detail = (entry as { detail?: { kind?: number } }).detail
        const gcKind =
          detail?.kind ??
          (entry as { kind?: number }).kind ??
          constants.NODE_PERFORMANCE_GC_MAJOR

        gcHistogram.record(durationSeconds, {
          "gc.type": getGcTypeName(gcKind),
        })
      }
    })
    gcObserver.observe({ entryTypes: ["gc"] })
  } catch {
    // GC observation requires a supported Node build; omit GC metrics if unavailable.
  }

  return () => {
    gcObserver?.disconnect()
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
 * - @opentelemetry/sdk-metrics
 * - @opentelemetry/resources
 * - @opentelemetry/sdk-trace-node
 * - @opentelemetry/instrumentation-pg
 * - @opentelemetry/instrumentation
 */
export function registerOtel(
  options: Partial<NodeSDKConfiguration> & {
    serviceName: string
    exporter?: SpanExporter
    metricsExporter?: PushMetricExporter
    instrument?: Partial<{
      http: boolean
      query: boolean
      workflows: boolean
      db: boolean
      cache: boolean
      runtime: boolean
      eventLoop: boolean
    }>
  }
) {
  const {
    exporter,
    metricsExporter,
    serviceName,
    instrument,
    instrumentations,
    ...nodeSdkOptions
  } = {
    instrument: {},
    instrumentations: [],
    ...options,
  }

  const cloudExporters = getCloudExporters()
  const traceExporters = [exporter, cloudExporters.exporter].filter(Boolean)
  const metricExporters = [
    metricsExporter,
    cloudExporters.metricsExporter,
  ].filter(Boolean)

  const {
    Resource,
    resourceFromAttributes,
  } = require("@medusajs/framework/opentelemetry/resources")
  const { NodeSDK } = require("@medusajs/framework/opentelemetry/sdk-node")
  const {
    BatchSpanProcessor,
  } = require("@medusajs/framework/opentelemetry/sdk-trace-node")

  const {
    PeriodicExportingMetricReader,
  } = require("@medusajs/framework/opentelemetry/sdk-metrics")

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
    spanProcessors: traceExporters.map(
      (exporter) => new BatchSpanProcessor(exporter)
    ),
    metricReaders: metricExporters.map(
      (exporter) =>
        new PeriodicExportingMetricReader({
          exporter,
          exportIntervalMillis: 10000,
        })
    ),
    ...nodeSdkOptions,
    instrumentations: instrumentations,
  } satisfies Partial<NodeSDKConfiguration>)

  sdk.start()

  let shutdownEventLoopMonitoring = () => {}
  let shutdownRuntimeMonitoring = () => {}

  // We should start any metrics monitoring after the sdk has been started.
  if (instrument.eventLoop) {
    shutdownEventLoopMonitoring = startEventLoopMonitoring()
  }

  if (instrument.runtime) {
    shutdownRuntimeMonitoring = startRuntimeMonitoring()
  }

  return {
    ...sdk,
    shutdown: async () => {
      shutdownEventLoopMonitoring()
      shutdownRuntimeMonitoring()
      await sdk.shutdown()
    },
  }
}
