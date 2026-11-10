import Redis from "ioredis"
import { setTimeout as wait } from "timers/promises"
import { defineWorkflow } from "../../src/definition/builder"
import { createEngine, Engine } from "../../src/engine"
import { createRedisNotifier } from "../../src/signals/redis"
import { Notifier, NotifierMessage } from "../../src/signals/notifier"
import { fromPg, PostgresStore } from "../../src/store/postgres"
import { createTestDatabase } from "../utils/database"

jest.setTimeout(30_000)

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379"
// Long enough that only a notification explains a quick continue.
const POLL_INTERVAL_MS = 10_000

async function roundTrip(notifier: Notifier) {
  const received: NotifierMessage[] = []
  const unsubscribe = await notifier.subscribe((message) =>
    received.push(message)
  )
  await notifier.publish({ type: "wake", origin: "test" })
  const start = Date.now()
  while (!received.length && Date.now() - start < 5000) {
    await wait(10)
  }
  await unsubscribe()
  return received
}

describe("notifiers", () => {
  let database: Awaited<ReturnType<typeof createTestDatabase>>

  beforeAll(async () => {
    database = await createTestDatabase()
  })

  afterAll(async () => {
    await database.drop()
  })

  const redisClients: Redis[] = []
  const redisNotifier = () => {
    const publisher = new Redis(REDIS_URL)
    const subscriber = new Redis(REDIS_URL)
    redisClients.push(publisher, subscriber)
    return createRedisNotifier({ publisher, subscriber })
  }

  afterEach(() => {
    redisClients.splice(0).forEach((client) => client.disconnect())
  })

  it("delivers messages over Redis pub/sub", async () => {
    expect(await roundTrip(redisNotifier())).toEqual([
      { type: "wake", origin: "test" },
    ])
  })

  describe("wake-ups between a server and a worker", () => {
    const engines: Engine[] = []

    afterEach(async () => {
      await Promise.all(
        engines.splice(0).map((e) => e.shutdown({ graceMs: 0 }))
      )
    })

    it("continues on the worker well before its poll interval", async () => {
      const definition = defineWorkflow({
        id: "notified",
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

      const make = (mode: "server" | "worker") => {
        const engine = createEngine({
          store: new PostgresStore({ client: fromPg(database.pool) }),
          mode,
          pollIntervalMs: POLL_INTERVAL_MS,
          notifier: redisNotifier(),
          logger: { error: () => {}, warn: () => {} },
        })
        engine.register(definition)
        engines.push(engine)
        return engine
      }

      const server = make("server")
      const worker = make("worker")
      await worker.boot()
      await server.boot()

      await server.start({ workflowId: "notified", transactionId: "t" })
      const findStatus = async () =>
        (await server.findRun("notified", "t", { steps: true }))!.steps!.find(
          (s) => s.stepId === "confirm"
        )?.status
      const startedAt = Date.now()
      while ((await findStatus()) !== "waiting") {
        await wait(10)
      }
      expect(Date.now() - startedAt).toBeLessThan(POLL_INTERVAL_MS / 2)

      const completedAt = Date.now()
      await server.completeStep(
        { workflowId: "notified", transactionId: "t", stepId: "confirm" },
        { output: "ok" }
      )
      while ((await server.findRun("notified", "t"))!.status !== "succeeded") {
        await wait(10)
      }
      expect(Date.now() - completedAt).toBeLessThan(POLL_INTERVAL_MS / 2)
    })
  })
})

describe("an unavailable notifier", () => {
  it("leaves the engine running on polling", async () => {
    const warnings: string[] = []
    const engine = createEngine({
      notifier: {
        publish: async () => {
          throw new Error("down")
        },
        subscribe: async () => {
          throw new Error("down")
        },
      },
      pollIntervalMs: 20,
      logger: { error: () => {}, warn: (message) => warnings.push(message) },
    })
    engine.register(
      defineWorkflow({
        id: "plain",
        steps: [{ id: "a", invoke: async () => 1 }],
      })
    )

    await engine.boot()
    expect((await engine.start({ workflowId: "plain" })).status).toEqual(
      "succeeded"
    )
    expect(warnings[0]).toContain("falling back to polling")
    await engine.shutdown({ graceMs: 0 })
  })
})
