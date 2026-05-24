# Specification Quality Checklist: API Contract

**Purpose**: Validate that API design decisions are explicit, versioning-aware, and survive contact with consumers — internal or external.
**When to use**: Any new endpoint, modification to an existing endpoint, or inter-service contract (HTTP / gRPC / GraphQL / event payload).
**When to skip**: Pure UI changes with no API surface change.

## Validation Items

### Contract Style & Discoverability

- [ ] CHK001 - Is the API style explicit (REST / GraphQL / tRPC / gRPC / RPC-over-HTTP)? [Clarity]
- [ ] CHK002 - Is the schema source-of-truth specified (OpenAPI, GraphQL SDL, proto, TypeScript router)? [Completeness]
- [ ] CHK003 - Is the schema-publish mechanism specified (committed in repo, hosted at URL, package-published)? [Gap]
- [ ] CHK004 - Are consumer types enumerated (first-party web, mobile, third-party developer, internal service)? [Coverage]

### Versioning Strategy

- [ ] CHK005 - Is the versioning strategy specified (URL path `/v2/`, header, content-type, none-with-stability-promise)? [Clarity]
- [ ] CHK006 - Is the version-bump policy specified (when MAJOR, when MINOR, when PATCH)? [Completeness]
- [ ] CHK007 - Is the simultaneous-version-support policy specified (how many old versions kept alive, deprecation cadence)? [Gap]

### Request Contract

- [ ] CHK008 - Are request schemas fully typed (no `any` / `unknown` / free-form `Object`)? [Completeness]
- [ ] CHK009 - Are required vs optional fields explicit per request? [Clarity]
- [ ] CHK010 - Is the validation strategy specified (server-side, library, error-shape on failure)? [Completeness]
- [ ] CHK011 - Are payload-size limits specified per endpoint? [Coverage]
- [ ] CHK012 - Are idempotency requirements specified for non-GET (idempotency keys, retry semantics)? [Coverage]

### Response Contract

- [ ] CHK013 - Are response schemas fully typed (success and every error case)? [Completeness]
- [ ] CHK014 - Is the success-response shape consistent across the API (envelope vs raw, pagination metadata location)? [Consistency]
- [ ] CHK015 - Is the error-response shape standardized (RFC 7807 / problem+json, custom envelope, GraphQL errors array)? [Consistency]
- [ ] CHK016 - Are HTTP status codes specified per outcome (200/201/204/400/401/403/404/409/422/429/5xx)? [Coverage]
- [ ] CHK017 - Are nullability rules explicit per field (never null, sometimes null, omitted-if-absent)? [Clarity]

### Pagination, Filtering, Sorting

- [ ] CHK018 - Is pagination strategy specified (cursor / offset / keyset)? [Clarity]
- [ ] CHK019 - Are pagination-limit defaults and caps specified? [Completeness]
- [ ] CHK020 - Is filter-syntax specified (query-param convention, expression language, supported operators)? [Coverage]

### Auth & Permissions

- [ ] CHK021 - Are auth requirements specified per endpoint (none / API key / OAuth scope / JWT claim / session cookie)? [Coverage]
- [ ] CHK022 - Are scope/permission requirements specified per endpoint operation? [Completeness]
- [ ] CHK023 - Is rate-limiting specified per endpoint or category (limits, header response, error response)? [Clarity]

### Breaking-Change Discipline

- [ ] CHK024 - Are breaking-change examples enumerated (rename field, change type, remove enum value, tighten validation)? [Traceability]
- [ ] CHK025 - Is the breaking-change-detection mechanism specified (schema-diff in CI, contract tests)? [Gap]
- [ ] CHK026 - Are additive-change rules explicit (when adding optional field, new endpoint, new enum value)? [Consistency]

### Deprecation

- [ ] CHK027 - Is the deprecation-signaling mechanism specified (`Deprecation` header, response field, schema annotation, docs banner)? [Completeness]
- [ ] CHK028 - Is the deprecation timeline specified (notice period, sunset date, hard-removal-vs-410-Gone)? [Clarity]
- [ ] CHK029 - Is consumer-migration guidance required as part of any deprecation (changelog, migration doc, code-mod)? [Coverage]

### Documentation & Examples

- [ ] CHK030 - Are example requests and responses required for every endpoint (success + each error case)? [Completeness]
- [ ] CHK031 - Is per-field documentation required (description, format, constraints, example value)? [Completeness]
- [ ] CHK032 - Is the changelog mechanism specified (per-version, machine-readable + human-readable)? [Gap]

### Compatibility

- [ ] CHK033 - Are unknown-field-handling requirements specified (clients ignore, server rejects, server logs)? [Coverage]
- [ ] CHK034 - Are enum-extension requirements specified (closed enum vs open string, fallback for unknown)? [Edge Case]
- [ ] CHK035 - Are date / number / ID format requirements specified (ISO 8601, integer vs string for IDs to avoid JS overflow)? [Clarity]

### Observability

- [ ] CHK036 - Are request-tracing requirements specified (correlation ID header, propagation across services)? [Completeness]
- [ ] CHK037 - Are SLO requirements specified per endpoint (availability, latency)? [Measurability]

## Notes

- References: REST (Fielding), JSON:API, RFC 7807, OpenAPI 3.1, GraphQL spec, gRPC versioning guide.
- The expensive-to-fix mistakes: `id: number` (JS-safe-integer overflow), no envelope (then needing metadata = breaking), closed enums (then adding a value breaks every old client).
- Pair with `backend-specialist`'s `api-patterns` skill.
