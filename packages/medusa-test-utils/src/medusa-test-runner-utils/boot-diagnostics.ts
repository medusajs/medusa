import os from "os"

/**
 * Diagnostics for the test runner's boot and cleanup.
 *
 * The failure this exists for is a hook timeout: jest gives up on `beforeAll`
 * but never cancels the promise it was awaiting, so the boot keeps running with
 * nobody left to report what it was doing. Anything that only logs on success
 * or on a thrown error is therefore useless here — the interesting run produces
 * neither.
 *
 * Two consequences shape everything below:
 *
 * - Output goes straight to `process.stderr`. CI runs jest with `--silent`,
 *   which swallows `console.*`, and the app sets `LOG_LEVEL=error`, which
 *   swallows the logger. A direct write survives both.
 * - A watchdog reports from outside the awaited chain, so a boot that never
 *   returns still says where it stopped.
 *
 * Quiet unless something is actually slow, so green runs stay readable. Set
 * `MEDUSA_TEST_BOOT_TRACE=1` to print every phase transition.
 */

const PREFIX = "[medusa-boot]"

const numberFromEnv = (name: string, fallback: number): number => {
  const parsed = parseInt(process.env[name] ?? "", 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

// Any single phase slower than this is worth a line on its own.
const SLOW_PHASE_MS = numberFromEnv("MEDUSA_TEST_BOOT_SLOW_PHASE_MS", 5000)
// Silence before the watchdog starts reporting.
const WATCHDOG_AFTER_MS = numberFromEnv(
  "MEDUSA_TEST_BOOT_WATCHDOG_AFTER_MS",
  15000
)
// How often it reports once it has started.
const WATCHDOG_EVERY_MS = numberFromEnv(
  "MEDUSA_TEST_BOOT_WATCHDOG_EVERY_MS",
  5000
)

const traceEverything = process.env.MEDUSA_TEST_BOOT_TRACE === "1"

const write = (line: string) => {
  // Not console.* — see the note above about --silent.
  process.stderr.write(`${PREFIX} ${line}\n`)
}

const workerId = () => process.env.JEST_WORKER_ID ?? "1"

/**
 * The spec file being booted. `expect` is jest's global, absent when these
 * utilities are used outside a test process.
 */
const testFile = (): string => {
  try {
    const path = (globalThis as any).expect?.getState?.()?.testPath
    return path ? path.split("/").slice(-2).join("/") : "unknown"
  } catch {
    return "unknown"
  }
}

/**
 * Load average is the fastest way to tell a starved machine from a wedged
 * process: a boot crawling at load 8 on 4 cores is starved, the same boot
 * stalled at load 0.5 is stuck on something.
 */
const machineSnapshot = (): string => {
  const [load1] = os.loadavg()
  const rssMb = Math.round(process.memoryUsage().rss / 1024 / 1024)
  const freeMb = Math.round(os.freemem() / 1024 / 1024)
  return `load1=${load1.toFixed(2)} cpus=${
    os.cpus().length
  } rss=${rssMb}mb free=${freeMb}mb`
}

/**
 * What postgres thinks is happening. A boot queued behind another worker's
 * `CREATE DATABASE` shows up here as a Lock wait; a connection problem shows up
 * as this query failing to connect at all, which is itself the answer.
 */
async function postgresSnapshot(): Promise<string> {
  const { Client } = require("@medusajs/framework/pg")

  const client = new Client({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USERNAME ?? "postgres",
    password: process.env.DB_PASSWORD || undefined,
    port: parseInt(process.env.DB_PORT ?? "5432", 10),
    database: "postgres",
    // Fail fast and loudly rather than adding to whatever is already stuck.
    connectionTimeoutMillis: 2000,
    statement_timeout: 2000,
  })

  try {
    await client.connect()

    const { rows } = await client.query(
      `SELECT count(*)::int AS total,
              count(*) FILTER (WHERE state = 'active')::int AS active,
              count(*) FILTER (WHERE state = 'idle in transaction')::int AS idle_in_tx,
              count(*) FILTER (WHERE wait_event_type = 'Lock')::int AS lock_waits,
              count(*) FILTER (WHERE query ILIKE 'CREATE DATABASE%')::int AS creating_db
       FROM pg_stat_activity
       WHERE backend_type = 'client backend'`
    )

    const { rows: waits } = await client.query(
      `SELECT wait_event_type, wait_event, count(*)::int AS n
       FROM pg_stat_activity
       WHERE backend_type = 'client backend' AND wait_event IS NOT NULL
       GROUP BY 1, 2 ORDER BY n DESC LIMIT 3`
    )

    const stat = rows[0]
    const waitSummary = waits.length
      ? waits
          .map((w) => `${w.wait_event_type}/${w.wait_event}:${w.n}`)
          .join(" ")
      : "none"

    return (
      `pg_conns=${stat.total} active=${stat.active} idle_in_tx=${stat.idle_in_tx} ` +
      `lock_waits=${stat.lock_waits} creating_db=${stat.creating_db} waits=[${waitSummary}]`
    )
  } catch (error) {
    return `pg_snapshot_failed=${(error as Error)?.message}`
  } finally {
    await client.end().catch(() => void 0)
  }
}

export type BootTracer = {
  /** Marks the previous phase finished and a new one started. */
  phase: (name: string) => void
  /** Boot finished. Stops the watchdog. */
  done: () => void
  /** Boot threw. Prints the full timeline so the failing phase is visible. */
  fail: (error: unknown) => void
  /** Free-form event on the same stream, for interleaving (e.g. cleanup). */
  note: (message: string) => void
}

const noopTracer: BootTracer = {
  phase: () => void 0,
  done: () => void 0,
  fail: () => void 0,
  note: () => void 0,
}

export { noopTracer }

export function createBootTracer(label: string, context: string): BootTracer {
  const start = Date.now()
  const file = testFile()
  const timeline: string[] = []

  let current = "starting"
  let currentStart = start
  let watchdog: NodeJS.Timeout | undefined
  let snapshotInFlight = false
  let finished = false

  const elapsed = () => Date.now() - start

  const header = () => `${label} w${workerId()} ${file}`

  const closeCurrentPhase = () => {
    const took = Date.now() - currentStart
    timeline.push(`${current}=${took}ms`)

    if (traceEverything || took >= SLOW_PHASE_MS) {
      write(`${header()} phase=${current} took=${took}ms at=${elapsed()}ms`)
    }
  }

  const startWatchdog = () => {
    watchdog = setInterval(async () => {
      if (finished) {
        return
      }

      const stuckFor = Date.now() - currentStart
      write(
        `${header()} STILL RUNNING phase=${current} phase_elapsed=${stuckFor}ms ` +
          `total=${elapsed()}ms ${machineSnapshot()} ${context}`
      )

      // One at a time: the snapshot opens a connection, and connections may be
      // exactly what is scarce.
      if (!snapshotInFlight) {
        snapshotInFlight = true
        try {
          const snapshot = await postgresSnapshot()
          if (!finished) {
            write(`${header()} ${snapshot}`)
          }
        } finally {
          snapshotInFlight = false
        }
      }
    }, WATCHDOG_EVERY_MS)

    // Never hold the process open on account of diagnostics.
    watchdog.unref?.()
  }

  // Delay the watchdog so healthy boots stay silent.
  const watchdogStarter = setTimeout(() => {
    if (!finished) {
      startWatchdog()
    }
  }, WATCHDOG_AFTER_MS)
  watchdogStarter.unref?.()

  const stop = () => {
    finished = true
    clearTimeout(watchdogStarter)
    if (watchdog) {
      clearInterval(watchdog)
    }
  }

  return {
    phase: (name: string) => {
      if (finished) {
        return
      }
      closeCurrentPhase()
      current = name
      currentStart = Date.now()
    },

    done: () => {
      if (finished) {
        return
      }
      closeCurrentPhase()
      const total = elapsed()
      stop()

      // Only worth a line if it was slow enough to be near a suite's budget.
      if (traceEverything || total >= WATCHDOG_AFTER_MS) {
        write(
          `${header()} COMPLETED total=${total}ms ${machineSnapshot()} timeline=[${timeline.join(
            " "
          )}]`
        )
      }
    },

    fail: (error: unknown) => {
      if (finished) {
        return
      }
      closeCurrentPhase()
      const total = elapsed()
      stop()
      write(
        `${header()} FAILED phase=${current} total=${total}ms ` +
          `error=${(error as Error)?.message ?? String(error)} ` +
          `${machineSnapshot()} timeline=[${timeline.join(" ")}]`
      )
    },

    note: (message: string) => {
      // Only interesting while the traced operation is unfinished — that is the
      // case where two things are happening at once.
      if (finished && !traceEverything) {
        return
      }
      const state = finished
        ? "boot_state=completed"
        : `boot_state=IN_FLIGHT phase=${current}`
      write(`${header()} ${message} at=${elapsed()}ms ${state}`)
    },
  }
}

/**
 * Facts that are cheap to state and otherwise get guessed at during a
 * post-mortem. Printed once per worker.
 */
let environmentReported = false

export function reportTestEnvironmentOnce(): void {
  if (environmentReported) {
    return
  }
  environmentReported = true

  if (!traceEverything && !process.env.CI) {
    return
  }

  write(
    `env w${workerId()} node=${process.version} ${machineSnapshot()} ` +
      `db_host=${process.env.DB_HOST ?? "localhost"} ` +
      `db_port=${process.env.DB_PORT ?? "5432"} ` +
      `redis_url=${process.env.REDIS_URL ? "set" : "unset"}`
  )
}
