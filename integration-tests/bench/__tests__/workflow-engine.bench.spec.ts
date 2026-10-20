import {
  createEngine,
  createRedisNotifier,
  defineWorkflow,
  SqlClient,
} from "@medusajs/workflow-engine"
import { fromPg, PostgresStore } from "@medusajs/workflow-engine/postgres"
import Redis from "ioredis"
import { applySchema } from "../../../packages/core/workflow-engine/integration-tests/utils/schema"
import { Client, Pool } from "pg"

/**
 * Targets from the architecture doc. CPU budgets get a 50% margin for noisy
 * machines; write counts are exact.
 */
const MARGIN = 1.5
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379"
const TARGETS = {
  sequential50Ms: 5,
  sequential200Ms: 20,
  fullWrites: 4,
  summaryWrites: 2,
  wakeupNotifierMs: 50,
  pollIntervalMs: 1000,
}

const results: Array<[string, string, string]> = []

function sequential(id: string, count: number) {
  return defineWorkflow({
    id,
    steps: Array.from({ length: count }, (_, i) => ({
      id: `step-${i}`,
      invoke: async () => ({ index: i, payload: "x".repeat(100) }),
    })),
  })
}

async function median(runs: number, fn: () => Promise<unknown>) {
  const times: number[] = []
  for (let i = 0; i < runs; i++) {
    const start = process.hrtime.bigint()
    await fn()
    times.push(Number(process.hrtime.bigint() - start) / 1e6)
  }
  times.sort((a, b) => a - b)
  return times[Math.floor(times.length / 2)]
}

const connection = (database: string) => ({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USERNAME ?? "postgres",
  password: process.env.DB_PASSWORD ?? "",
  database,
})

describe("workflow engine benchmarks", () => {
  afterAll(() => {
    console.log(
      [
        "| Scenario | Measured | Target |",
        "|---|---|---|",
        ...results.map((row) => `| ${row.join(" | ")} |`),
      ].join("\n")
    )
  })

  it.each([
    [50, TARGETS.sequential50Ms],
    [200, TARGETS.sequential200Ms],
  ])("%i-step sequential workflow, durability none", async (count, target) => {
    const engine = createEngine()
    engine.register(sequential(`seq-${count}`, count))
    for (let i = 0; i < 5; i++) {
      await engine.start({ workflowId: `seq-${count}` })
    }

    const time = await median(50, () =>
      engine.start({ workflowId: `seq-${count}` })
    )
    results.push([
      `${count}-step sequential, none`,
      `${time.toFixed(2)} ms`,
      `< ${target} ms`,
    ])
    expect(time).toBeLessThan(target * MARGIN)
  })

  describe("on Postgres", () => {
    const name = `wf_bench_${Date.now()}`
    let pool: Pool

    beforeAll(async () => {
      const admin = new Client(connection("postgres"))
      await admin.connect()
      await admin.query(`CREATE DATABASE "${name}"`)
      await admin.end()
      pool = new Pool(connection(name))
      await applySchema(pool)
    })

    afterAll(async () => {
      await pool.end()
      const admin = new Client(connection("postgres"))
      await admin.connect()
      await admin.query(`DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`)
      await admin.end()
    })

    function measured(client: SqlClient) {
      const stats = { writes: 0, bytes: 0 }
      return {
        stats,
        client: {
          query(sql: string, params: unknown[] = []) {
            if (/^\s*(INSERT|UPDATE|DELETE|WITH)/i.test(sql)) {
              stats.writes++
              stats.bytes += params.reduce<number>(
                (sum, p) => sum + (typeof p === "string" ? p.length : 0),
                0
              )
            }
            return client.query(sql, params)
          },
        } as SqlClient,
      }
    }

    it.each([
      ["full", { durability: "full" as const }, TARGETS.fullWrites],
      ["summary", { retentionTimeMs: 60_000 }, TARGETS.summaryWrites],
    ])("stored 2-step workflow, %s", async (label, options, target) => {
      const { stats, client } = measured(fromPg(pool))
      const engine = createEngine({
        store: new PostgresStore({ client }),
        autoBoot: false,
      })
      engine.register(
        defineWorkflow({
          id: `two-${label}`,
          steps: [
            { id: "a", invoke: async () => ({ payload: "x".repeat(100) }) },
            { id: "b", invoke: async () => ({ payload: "x".repeat(100) }) },
          ],
          options: { retentionTimeMs: 60_000, ...options },
        })
      )

      await engine.start({ workflowId: `two-${label}` })
      results.push([
        `Stored 2-step, ${label}`,
        `${stats.writes} writes, ${stats.bytes} bytes`,
        `${target} writes`,
      ])
      expect(stats.writes).toEqual(target)

      const time = await median(20, () =>
        engine.start({ workflowId: `two-${label}` })
      )
      results.push([
        `Stored 2-step, ${label}, latency`,
        `${time.toFixed(2)} ms`,
        "-",
      ])
    })

    it("bytes written per step stay flat as the workflow grows", async () => {
      const perStep: number[] = []
      for (const count of [10, 50]) {
        const { stats, client } = measured(fromPg(pool))
        const engine = createEngine({
          store: new PostgresStore({ client }),
          autoBoot: false,
        })
        engine.register({
          ...sequential(`bytes-${count}`, count),
          options: { durability: "full" },
        })
        await engine.start({ workflowId: `bytes-${count}` })
        perStep.push(stats.bytes / count)
      }
      results.push([
        "Bytes per step, 10 vs 50 steps",
        perStep.map((b) => b.toFixed(0)).join(" vs "),
        "flat",
      ])
      expect(perStep[1]).toBeLessThan(perStep[0] * 1.25)
    })

    it.each([
      ["inline, shared instance", "inline"],
      ["server to worker, Redis notifier", "notify"],
      ["server to worker, polling", "poll"],
    ])("wake-up after an outside completion: %s", async (label, kind) => {
      const definition = defineWorkflow({
        id: `wakeup-${kind}`,
        steps: [
          {
            id: "confirm",
            invoke: async () => ({ kind: "wait" }),
            options: { async: true },
          },
          { id: "after", invoke: async () => "after" },
        ],
        options: { retentionTimeMs: 60_000 },
      })
      const redisClients: Redis[] = []
      const make = (mode: "shared" | "server" | "worker") => {
        const redis = () => {
          const client = new Redis(REDIS_URL)
          redisClients.push(client)
          return client
        }
        const engine = createEngine({
          store: new PostgresStore({ client: fromPg(pool) }),
          mode,
          pollIntervalMs: TARGETS.pollIntervalMs,
          notifier:
            kind === "notify"
              ? createRedisNotifier({
                  publisher: redis(),
                  subscriber: redis(),
                })
              : undefined,
          logger: { error: () => {}, warn: () => {} },
        })
        engine.register(definition)
        return engine
      }

      const engines =
        kind === "inline" ? [make("shared")] : [make("server"), make("worker")]
      await Promise.all(engines.map((e) => e.boot()))
      const caller = engines[0]

      const samples: number[] = []
      for (let i = 0; i < 5; i++) {
        const transactionId = `t-${i}`
        await caller.start({ workflowId: `wakeup-${kind}`, transactionId })
        while (
          (await caller.findRun(`wakeup-${kind}`, transactionId, {
            steps: true,
          }))!.steps!.find((s) => s.stepId === "confirm")?.status !== "waiting"
        ) {
          await new Promise((resolve) => setTimeout(resolve, 5))
        }
        const start = process.hrtime.bigint()
        await caller.completeStep(
          { workflowId: `wakeup-${kind}`, transactionId, stepId: "confirm" },
          { output: "ok" }
        )
        while (
          (await caller.findRun(`wakeup-${kind}`, transactionId))!.status !==
          "succeeded"
        ) {
          await new Promise((resolve) => setTimeout(resolve, 5))
        }
        samples.push(Number(process.hrtime.bigint() - start) / 1e6)
      }
      await Promise.all(engines.map((e) => e.shutdown({ graceMs: 0 })))
      redisClients.forEach((client) => client.disconnect())

      samples.sort((a, b) => a - b)
      const median = samples[Math.floor(samples.length / 2)]
      const target =
        kind === "poll" ? TARGETS.pollIntervalMs : TARGETS.wakeupNotifierMs
      results.push([
        `Wake-up, ${label}`,
        `${median.toFixed(1)} ms`,
        `< ${target} ms`,
      ])
      expect(median).toBeLessThan(target * MARGIN)
    })
  })
})
