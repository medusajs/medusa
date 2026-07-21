---
"@medusajs/deps": patch
"@medusajs/medusa": patch
---

chore(deps,medusa): update OpenTelemetry SDK to 2.9.0. `OTEL_RESOURCE_ATTRIBUTES` is now parsed strictly per the W3C Baggage spec. A single malformed entry silently discards the entire variable, values containing whitespace must be percent-encoded (` ` -> `%20`), and double quotes are treated as literal characters rather than value wrappers. If you set this env var, audit it so resource attributes like `service.name` still apply.
