# Security Audit — Reported Advisories

Investigation of four advisories flagged by a downstream scanner against this repo's lockfile (`yarn.lock`; scanner mislabels it `package-lock.json`).

| Package | Installed | Fixed in | Advisory | Status |
|---|---|---|---|---|
| `lodash` | 4.17.21 | 4.18.0 | CVE-2026-4800 / GHSA-r5fr-rjxr-66jc | Present, not exploitable |
| `@mikro-orm/knex` | 6.6.12 | 6.6.14 | CVE-2026-44680 / GHSA-cfw5-68c4-ffqp | Present, not exploitable in Medusa source (recommend bump) |
| `@opentelemetry/exporter-prometheus` | 0.200.0 | 0.217.0 | CVE-2026-44902 / GHSA-q7rr-3cgh-j5r3 | Present, only reachable in opt-in user configs |
| `@opentelemetry/sdk-node` | ^0.200.0 | 0.217.0 | Same as above | Same as above |

---

## 1. lodash — CVE-2026-4800 (GHSA-r5fr-rjxr-66jc)

**Advisory summary.** The fix for CVE-2021-23337 validated `options.variable` in `_.template`, but did not validate `options.imports` key names. Both flow into the same `Function()` sink. Passing attacker-controlled keys in `options.imports` allows arbitrary code execution at template compile time. Vulnerable: `>=4.0.0, <=4.17.23` and `>=4.18.0` (note: 4.18.0 is the fixed release in the 4.x line; the second range refers to lodash-amd/lodash-es lines per the advisory).

**Version present.** Single resolution: `lodash@4.17.21` (`yarn.lock:21050`).

### Medusa packages with a lodash chain (`npm list lodash --all`)

| Medusa workspace | Chain |
|---|---|
| `@medusajs/cli` | → `inquirer` |
| `@medusajs/deps` | → `@mikro-orm/knex` → `knex` |
| `@medusajs/medusa-oas-cli` | → `swagger-inline` → `multilang-extract-comments` (+ `comment-patterns`) |
| `@medusajs/utils` | → `@graphql-codegen/core` → `@graphql-codegen/plugin-helpers` |
| `medusa-dev-cli` | direct (`kebabCase`, `snakeCase`) + `verdaccio` (+ 10 `@verdaccio/*`, `lowdb`) |
| `create-medusa-app` | → `wait-on` |

Non-Medusa workspaces in the same lockfile: `@storybook/*`, `@testing-library/jest-dom`, `pg-god` (`@oclif/*`, `cli-ux`).

### Runtime vs tooling

Only one chain ships into a deployed Medusa server:

```
@medusajs/deps → @mikro-orm/knex → knex → lodash
```

Everything else is dev/CLI tooling (codegen, OAS generator, Verdaccio local registry, Storybook, jest-dom matchers, install-time `wait-on`, the dev/create CLIs).

### `_.template` reachability

Searched every lodash consumer in `node_modules` for the actual sink:

- **`knex/lib/migrations/util/template.js`** — `require('lodash/template')`. Used only by `knex migrate:make` to render migration scaffolds at dev time. Options are hardcoded (`{ interpolate: /<%=([\s\S]+?)%>/g }`); never sets `imports`. Not reachable at server runtime.
- **`@oclif/help/lib/util.js`** and **`@oclif/config/lib/config.js`** — call `_.template(...)` on hardcoded help text and S3 manifest strings from the CLI's own `package.json`. No caller-supplied `imports`.
- All other consumers (`inquirer`, `wait-on`, `@verdaccio/*`, `lowdb`, `@graphql-codegen/plugin-helpers`, `@storybook/*`, `@testing-library/jest-dom`, `multilang-extract-comments`, `comment-patterns`, `cli-ux`) — no `_.template` calls at all.

Repo-wide grep for `_.template(`, `lodash/template`, `lodash.template` in first-party source: **zero hits**.

### Verdict

- **CVE present**: yes.
- **Exploitable in Medusa**: **no**. No code path in any Medusa workspace or transitive `node_modules` consumer supplies attacker-controlled `options.imports` keys.
- **Recommendation**: add a `resolutions: { "lodash": "^4.18.0" }` entry to the root `package.json` to clear scanner noise and guard against future internal use of `_.template`. Non-urgent.

---

## 2. `@mikro-orm/knex` — CVE-2026-44680 (GHSA-cfw5-68c4-ffqp)

**Advisory summary.** MikroORM's identifier-quoting helper and JSON-path emitters do not properly escape special characters. When attacker-influenced strings reach a public ORM API that expects an *identifier* (table/column name) or a *JSON-property key* (rather than a value), an attacker can break out of the quoted/JSON-path context and inject arbitrary SQL. Vulnerable: `@mikro-orm/knex <= 6.6.13`. Fix: `6.6.14`.

**Versions present.** All `@mikro-orm/*` packages pinned at `6.6.12` in `packages/deps/package.json` (`yarn.lock:4423-4501`):

```
@mikro-orm/cli         6.6.12
@mikro-orm/core        6.6.12
@mikro-orm/knex        6.6.12
@mikro-orm/migrations  6.6.12
@mikro-orm/postgresql  6.6.12
```

### Medusa packages with a chain (`npm list @mikro-orm/knex --all`)

```
@medusajs/deps
├─ @mikro-orm/cli         → @mikro-orm/knex
├─ @mikro-orm/knex
├─ @mikro-orm/migrations  → @mikro-orm/knex
└─ @mikro-orm/postgresql  → @mikro-orm/knex
```

All Medusa modules and the framework consume MikroORM exclusively through `@medusajs/deps`. The vulnerable code ships into every deployed Medusa server.

### Reachability — where could untrusted input become an identifier?

The advisory only triggers when caller-supplied strings reach identifier/JSON-path arguments, not when they're passed as parameterized values. Audited the high-risk surfaces:

1. **Standard repository filters** (`packages/core/utils/src/dal/mikro-orm/mikro-orm-repository.ts`) — go through `buildQuery()` → MikroORM's `find`/`findAndCount`. Filter *keys* are entity property names that MikroORM resolves against its metadata; *values* are bound as parameters. Property names cannot be arbitrary strings supplied by an HTTP client because they must match a registered field on the entity. Safe.

2. **`metadata` writes** — `metadata: z.record(z.string(), z.unknown())` appears in many create/update validators (e.g., `packages/medusa/src/api/admin/customers/validators.ts:59`). These are *write* payloads — the object is stored as JSONB via parameterized INSERT/UPDATE. JSON-path emission isn't involved. Safe.

3. **`metadata` query filters** — Medusa's standard list-endpoint validators do not expose a `filter[metadata][arbitraryKey]` query parameter. List filter schemas enumerate allowed fields explicitly. Safe.

4. **IndexModule query-builder** (`packages/modules/index/src/utils/query-builder.ts`) — does build raw SQL with template-string interpolation of property names:
   - `${alias}.data->'${parentProperty}'` (line 761)
   - `(${alias}.data->>'${field}')${pgType.cast}` (line 912)

   Both sites are gated by `this.allSchemaFields.has(parentProperty)` / `aliasMapping[...]` checks — the property name must already be a registered field in the index schema. End-user request fields cannot bypass this set. Safe in current usage, but this pattern is the closest to the advisory's sink and would become exploitable if the gate were ever removed or if a schema were ever auto-derived from request input.

5. **`pgConnection.raw(...)`** in framework migrations and `modules-sdk/medusa-app.ts:589` (`pg_advisory_xact_lock(hashtext(?))`) — all use parameter placeholders, no string interpolation of attacker input.

6. **`getKnex().raw(...where)`** in `mikro-orm-repository.ts:450` — takes `[sql, bindings]` produced by MikroORM's own SQL builder for the delete path; not a user-string sink.

### Verdict

- **CVE present**: yes — `6.6.12` < `6.6.14`.
- **Exploitable in current Medusa source**: **no**. Every code path that could feed identifiers/JSON-path keys to MikroORM is gated against a known schema field set or uses parameterized bindings.
- **Risk**: bug-for-bug, the library is vulnerable, so any future Medusa code (or third-party module) that forwards an untrusted string into an identifier API gains this CVE for free. Bumping closes that latent risk and clears scanners.
- **Recommendation**: in `packages/deps/package.json`, bump all `@mikro-orm/*` from `6.6.12` to `^6.6.14` (or later in the 6.6 line) and refresh `yarn.lock`. Low-risk patch bump; verify against the project's existing MikroORM 6.6.x upgrade notes in `memory/project_mikroorm_upgrade.md`.

---

## 3. `@opentelemetry/sdk-node` + `@opentelemetry/exporter-prometheus` — CVE-2026-44902 (GHSA-q7rr-3cgh-j5r3)

**Advisory summary.** The Prometheus exporter's built-in HTTP server (default `0.0.0.0:9464`) has no error handling around URL parsing. A single malformed request like `GET http://` triggers `new URL(...)` to throw `TypeError: Invalid URL`, which propagates as an uncaught exception and kills the Node.js process. Unauthenticated, one-packet DoS. Vulnerable: `@opentelemetry/exporter-prometheus < 0.217.0` and `@opentelemetry/sdk-node < 0.217.0` (and `@opentelemetry/auto-instrumentations-node < 0.75.0`). Fix: bump all three.

**Versions present.** From `npm list @opentelemetry/exporter-prometheus @opentelemetry/sdk-node --all`:

```
@medusajs/deps
└─ @opentelemetry/sdk-node@0.200.0
   └─ @opentelemetry/exporter-prometheus@0.200.0
```

`@medusajs/deps/package.json` declares `"@opentelemetry/sdk-node": "^0.200.0"`. `exporter-prometheus` is pulled purely as a transitive dep of `sdk-node` — no Medusa workspace lists it directly.

### Reachability

The vulnerable HTTP server only starts when a `PrometheusExporter` instance is constructed (its constructor binds the metrics server). Audited Medusa source:

- **`packages/medusa/src/instrumentation/index.ts`** is the only first-party OTEL wiring. It exposes `registerOtel({ exporter, serviceName, instrument })` where `exporter` is typed as `SpanExporter` (tracing only). No metric reader, no `PrometheusExporter`, no port 9464 binding anywhere in the Medusa codebase.
- Repo-wide search for `PrometheusExporter` / `exporter-prometheus` / `MetricExporter` in first-party source: **zero hits**.
- Documentation (`www/apps/**`) does not instruct users to enable the Prometheus exporter.

A Medusa deployment is exploitable only if **one of these is true**:

1. The user's own `instrumentation.ts` imports `PrometheusExporter` from `@opentelemetry/exporter-prometheus` and attaches it to the SDK, AND port 9464 is network-reachable.
2. The user sets `OTEL_METRICS_EXPORTER=prometheus` *and* uses `@opentelemetry/auto-instrumentations-node` (not bundled by Medusa) which honors that env var.

Neither is part of any default Medusa setup. Most production deployments run behind a load balancer that doesn't expose 9464 even when the exporter is enabled.

### Verdict

- **CVE present**: yes — the vulnerable `exporter-prometheus@0.200.0` ships in every Medusa install via `sdk-node`.
- **Exploitable in a default Medusa deployment**: **no** — nothing in Medusa instantiates the exporter or binds port 9464.
- **Exploitable for opt-in users**: yes — anyone who wired up the Prometheus exporter manually and exposed 9464 gets killed by a single malformed HTTP request.
- **Recommendation**: in `packages/deps/package.json`, bump `@opentelemetry/sdk-node` from `^0.200.0` to `^0.217.0`. That carries `exporter-prometheus` to a patched version too. Low-risk minor bump within the `0.x` line; verify no breaking changes against the existing instrumentation wrapper. If `@medusajs/deps` re-exports more OTEL packages, bump them in the same step to keep the set consistent.

---

## Overall recommendation

All three live advisories can be cleared with three small dependency edits — none require code changes inside Medusa:

1. Root `package.json`: add `"resolutions": { "lodash": "^4.18.0" }`.
2. `packages/deps/package.json`: bump `@mikro-orm/*` from `6.6.12` → `^6.6.14`.
3. `packages/deps/package.json`: bump `@opentelemetry/sdk-node` from `^0.200.0` → `^0.217.0` (plus any sibling OTEL packages tracked in the same workspace).

Then `yarn install` to refresh the lockfile and run the existing module/integration test suites to verify no regressions.
