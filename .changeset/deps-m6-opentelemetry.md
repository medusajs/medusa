---
"@medusajs/deps": minor
"@medusajs/framework": minor
"@medusajs/medusa": minor
---

chore(deps,framework,medusa): update OpenTelemetry to SDK 3.0 (`@opentelemetry/sdk-node` 0.301, `@opentelemetry/resources` 3, `@opentelemetry/instrumentation-pg` 0.78, `@opentelemetry/api` 1.10). `@opentelemetry/sdk-trace-node` is replaced by `@opentelemetry/sdk-trace`, so the `@medusajs/framework/opentelemetry/sdk-trace-node` subpath is renamed to `@medusajs/framework/opentelemetry/sdk-trace`. Use `TracerProvider` instead of `NodeTracerProvider`, and pass `{ exporter }` to `SimpleSpanProcessor` and `BatchSpanProcessor`. Exporters passed to `registerOtel` must target SDK 3.0. Traces now also include the `os.*` and `service.instance.id` resource attributes, which the SDK detects by default.
