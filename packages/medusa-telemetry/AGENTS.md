# @medusajs/telemetry

Anonymous usage telemetry for the Medusa CLI and server. Used internally by `@medusajs/cli`, `@medusajs/medusa` commands, `@medusajs/framework` (feature flags), and `create-medusa-app`; applications never configure it directly.

## Using this package

- Opting out (end users): set `MEDUSA_DISABLE_TELEMETRY=true` or run `npx medusa telemetry --disable` (persists `telemetry.enabled: false`).
  - https://docs.medusajs.com/learn/resources/usage.md
  - https://docs.medusajs.com/resources/medusa-cli/commands/telemtry.md
- Exports (from `src/index.js`):
  - `track(event, data?)`: queue an event, e.g. `track("CLI_START")`, `track("CLI_USER", { with_id: !!id })`
  - `setTelemetryEnabled(enabled = true)`: backs the `medusa telemetry` command in `packages/cli/medusa-cli/src/create-cli.ts`
  - `trackFeatureFlag(flag)`, `trackInstallation(installation, "plugin" | "module")`: attached to every later event
  - `flush`, `Store`, `Telemeter`
- `Store` doubles as Medusa's persistent per-machine config store; other packages use it for non-telemetry flags (`star.prompted` in `packages/medusa/src/commands/develop.ts`, the Claude Code plugin prompt in `packages/medusa/src/utils/claude-code-plugin.ts`).

## Architecture

- Plain JavaScript (`src/*.js`, compiled via `allowJs`); no types beyond generated declarations.
- Flow: `track` -> `Telemeter.enqueue_` -> `Store.addEvent` appends a JSON line to `events.json` (`util/outbox-store.js`) next to the `configstore` file named `medusa` -> when `flushAt` (20 events), `maxQueueSize` (500 KB) or `flushInterval` (10 s) is hit, `util/create-flush.js` forks `util/send.js` as a detached, unref'd child -> `util/telemetry-dispatcher.js` POSTs `{ batch, timestamp }` with `axios-retry` (3 retries on network errors, 5xx, 429).
- Every event carries `machine_id` (stored as `telemetry.machine_id`), OS/CI info (`util/is-ci.js`), the resolved `@medusajs/medusa` and `@medusajs/cli` versions, feature flags, modules, and plugins.
- Env vars: `MEDUSA_DISABLE_TELEMETRY`, `MEDUSA_TELEMETRY_VERBOSE` (logs flush/send errors; also makes the forked sender inherit stdio), `MEDUSA_TELEMETRY_HOST` / `MEDUSA_TELEMETRY_PATH` (default `https://telemetry.medusa-commerce.com` + `/batch`).

## Development

- `yarn build`, `yarn watch`, `yarn test` (`jest --passWithNoTests src`; there are currently no tests).
- The `start` script (nodemon on `plugins/`) is stale; don't rely on it.
- To debug locally, point `MEDUSA_TELEMETRY_HOST` at a local server and set `MEDUSA_TELEMETRY_VERBOSE=true`.

## Gotchas

- Importing the package has side effects: it constructs a `Telemeter`, reads/writes config, may print the opt-out notice (outside CI) on first run, and registers `process.on("exit", flush)`.
- `postinstall` runs `node dist/postinstall.js || true` to show the opt-out notice on install; it must never throw.
- `MEDUSA_DISABLE_TELEMETRY` only stops events from being written (`Store.addEvent`); the on/off decision for flushing comes from the stored `telemetry.enabled` config, which defaults to `true` when unset.
- If `configstore` can't write (read-only home dir), `Store` falls back to `InMemoryConfigStore` with a throwaway `not-a-machine-id-*` id and the OS temp dir as base path.
- The sender is a separate process: a failed POST writes the batch back to `events.json`, but events can be lost if that process dies mid-send (see comment in `outbox-store.js`).
