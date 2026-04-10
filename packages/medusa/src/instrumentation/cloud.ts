import { OTLPTraceExporter } from "@medusajs/framework/opentelemetry/exporter-trace-otlp-http"
import { OTLPMetricExporter } from "@medusajs/framework/opentelemetry/exporter-metrics-otlp-http"

const MEDUSA_CLOUD_EXECUTION_CONTEXT = "medusa-cloud"

export function getCloudExporters() {
  const isCloud =
    process.env.EXECUTION_CONTEXT === MEDUSA_CLOUD_EXECUTION_CONTEXT
  if (!isCloud) {
    return {
      exporter: undefined,
      metricsExporter: undefined,
    }
  }

  const tracesUrl = process.env.MEDUSA_CLOUD_OTLP_TRACES_EXPORTER_URL
  const metricsUrl = process.env.MEDUSA_CLOUD_OTLP_METRICS_EXPORTER_URL

  return {
    exporter: tracesUrl
      ? new OTLPTraceExporter({
          url: process.env.MEDUSA_CLOUD_OTLP_TRACES_EXPORTER_URL,
          headers: process.env.MEDUSA_CLOUD_OTLP_TRACES_EXPORTER_HEADERS
            ? JSON.parse(process.env.MEDUSA_CLOUD_OTLP_TRACES_EXPORTER_HEADERS)
            : {},
        })
      : undefined,
    metricsExporter: metricsUrl
      ? new OTLPMetricExporter({
          url: process.env.MEDUSA_CLOUD_OTLP_METRICS_EXPORTER_URL,
          headers: process.env.MEDUSA_CLOUD_OTLP_METRICS_EXPORTER_HEADERS
            ? JSON.parse(process.env.MEDUSA_CLOUD_OTLP_METRICS_EXPORTER_HEADERS)
            : {},
        })
      : undefined,
  }
}
