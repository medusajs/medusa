/**
 * One engine instance in its own process, driven over IPC by the multi-process
 * tests. Steps record what they do in `test_event`, so the tests can see which
 * instance ran what.
 */
import { setTimeout as wait } from "timers/promises"
import { Pool } from "pg"
import { createEngine, defineWorkflow, LeaseLostError } from "../../src"
import { fromPg, PostgresStore } from "../../src/store/postgres"
import { Lease, RunChanges } from "../../src/store/store"

const instance = process.env.INSTANCE!
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 })

async function record(
  workflow: string,
  step: string,
  attempt = 1,
  payload: unknown = null
) {
  await pool.query(
    `INSERT INTO test_event (instance, workflow, step, attempt, payload)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [instance, workflow, step, attempt, JSON.stringify(payload)]
  )
}

async function signalled(name: string) {
  const { rowCount } = await pool.query(
    `SELECT 1 FROM test_signal WHERE name = $1`,
    [name]
  )
  return (rowCount ?? 0) > 0
}

/**
 * Records refused writes, so tests can wait for a fenced-off process.
 */
class RecordingStore extends PostgresStore {
  async commit(lease: Lease, changes: RunChanges) {
    try {
      return await super.commit(lease, changes)
    } catch (error) {
      if (error instanceof LeaseLostError) {
        await record("lease", "lost", 1, { runId: lease.runId }).catch(
          () => undefined
        )
      }
      throw error
    }
  }
}

const engine = createEngine({
  store: new RecordingStore({ client: fromPg(pool) }),
  instanceId: instance,
  mode: (process.env.MODE as "shared" | "worker" | "server") ?? "shared",
  pollIntervalMs: 100,
  recovery: {
    heartbeatIntervalMs: 200,
    leaseTtlMs: 1000,
    reaperIntervalMs: 200,
  },
  autoBoot: false,
  logger: { error: () => {}, warn: () => {} },
})

const full = { durability: "full" as const, retentionTimeMs: 60_000 }

engine.register(
  defineWorkflow({
    id: "crash-sync",
    steps: [
      { id: "a", invoke: async () => record("crash-sync", "a") },
      {
        id: "slow",
        invoke: async (ctx) => {
          await record("crash-sync", "slow", ctx.attempt)
          if ((ctx.input as any)?.sleepOn === instance) {
            await wait(60_000)
          }
          return instance
        },
      },
      { id: "c", invoke: async () => record("crash-sync", "c") },
    ],
    options: full,
    result: (ctx) => ctx.results.get("slow"),
  })
)

engine.register(
  defineWorkflow({
    id: "crash-background",
    steps: [
      {
        id: "background",
        invoke: async (ctx) => {
          await record("crash-background", "background", ctx.attempt)
          if ((ctx.input as any)?.sleepOn === instance) {
            await wait(60_000)
          }
          return instance
        },
        options: { async: true },
      },
      { id: "after", invoke: async () => record("crash-background", "after") },
    ],
    options: full,
    result: (ctx) => ctx.results.get("background"),
  })
)

engine.register(
  defineWorkflow({
    id: "retry-once",
    steps: [
      {
        id: "work",
        invoke: async (ctx) => {
          await record("retry-once", "work", ctx.attempt)
          return ctx.attempt === 1 ? { kind: "wait" } : "retried"
        },
        options: { async: true, maxRetries: 1, retryIntervalMs: 300 },
      },
    ],
    options: full,
  })
)

engine.register(
  defineWorkflow({
    id: "confirm",
    steps: [
      { id: "before", invoke: async () => record("confirm", "before") },
      {
        id: "confirm",
        invoke: async () => ({ kind: "wait" }),
        options: { async: true },
      },
      { id: "after", invoke: async () => record("confirm", "after") },
    ],
    options: full,
  })
)

engine.register(
  defineWorkflow({
    id: "fenced",
    steps: [
      {
        id: "gate",
        invoke: async (ctx) => {
          await record("fenced", "gate-start", ctx.attempt)
          while (!(await signalled("fenced"))) {
            await wait(50)
          }
          await record("fenced", "gate-end", ctx.attempt)
          return instance
        },
      },
    ],
    options: full,
    result: (ctx) => ctx.results.get("gate"),
  })
)

if (process.env.SCHEDULE === "1") {
  engine.register(
    defineWorkflow({
      id: "scheduled",
      steps: [
        {
          id: "fire",
          invoke: async (ctx) =>
            record("scheduled", "fire", 1, {
              scheduledFor: (ctx.input as any).scheduledFor,
            }),
        },
      ],
      options: { schedule: { intervalMs: 1000, concurrency: "allow" } },
    })
  )
}

type Command = { id: number; cmd: string; args: any }

process.on("message", async ({ id, cmd, args }: Command) => {
  const reply = (result: unknown, error?: unknown) =>
    process.send!({
      id,
      result,
      error: error ? (error as Error).message ?? String(error) : undefined,
    })
  try {
    switch (cmd) {
      case "start":
        if (args.await) {
          const handle = await engine.start(args)
          return reply({ status: handle.status })
        }
        void engine.start(args).catch(() => undefined)
        return reply({ status: "started" })
      case "completeStep": {
        const handle = await engine.completeStep(args.target, args.result)
        return reply({ status: handle.status })
      }
      case "failStep": {
        const handle = await engine.failStep(
          args.target,
          new Error(args.message)
        )
        return reply({ status: handle.status })
      }
      case "shutdown":
        await engine.shutdown({ graceMs: args?.graceMs ?? 0 })
        reply({ status: "stopped" })
        await pool.end()
        process.exit(0)
    }
  } catch (error) {
    reply(undefined, error)
  }
})

engine.boot().then(() => process.send!({ ready: true }))
