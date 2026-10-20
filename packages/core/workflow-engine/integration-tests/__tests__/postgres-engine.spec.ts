import { setTimeout as wait } from "timers/promises"
import { defineWorkflow } from "../../src/definition/builder"
import { createEngine, Engine } from "../../src/engine"
import { fromPg, PostgresStore, SqlClient } from "../../src/store/postgres"
import { createTestDatabase } from "../utils/database"

jest.setTimeout(30_000)

const WRITE = /^\s*(INSERT|UPDATE|DELETE|WITH)/i

function countingClient(client: SqlClient) {
  const writes: string[] = []
  return {
    writes,
    client: {
      query(sql: string, params?: unknown[]) {
        if (WRITE.test(sql)) {
          writes.push(sql.trim().split(/\s+/)[0].toUpperCase())
        }
        return client.query(sql, params)
      },
    } as SqlClient,
  }
}

const confirmWorkflow = () =>
  defineWorkflow({
    id: "confirm",
    steps: [
      { id: "prepare", invoke: async () => "prepared" },
      {
        id: "confirm",
        invoke: async () => ({ kind: "wait" }),
        options: { async: true },
      },
      {
        id: "finish",
        invoke: async (ctx) => [
          ctx.results.get("prepare"),
          ctx.results.get("confirm"),
        ],
      },
    ],
    options: { retentionTimeMs: 60_000 },
    result: (ctx) => ctx.results.get("finish"),
  })

describe("Engine on Postgres", () => {
  let database: Awaited<ReturnType<typeof createTestDatabase>>
  let engines: Engine[] = []

  const engine = (client?: SqlClient) => {
    const instance = createEngine({
      store: new PostgresStore({ client: client ?? fromPg(database.pool) }),
      // Counted writes cover runs only, not the engine's own start-up.
      autoBoot: !client,
    })
    engines.push(instance)
    return instance
  }

  beforeAll(async () => {
    database = await createTestDatabase()
  })

  afterEach(async () => {
    await Promise.all(engines.map((e) => e.shutdown()))
    engines = []
  })

  afterAll(async () => {
    await database.drop()
  })

  it("continues a run on another instance after an outside completion", async () => {
    const first = engine()
    const second = engine()
    first.register(confirmWorkflow())
    second.register(confirmWorkflow())

    const started = await first.start({
      workflowId: "confirm",
      transactionId: "order-1",
    })
    expect(started.status).toEqual("waiting")

    const finished = await second.completeStep(
      { workflowId: "confirm", transactionId: "order-1", stepId: "confirm" },
      { output: "confirmed" }
    )

    expect(finished.status).toEqual("succeeded")
    expect(finished.result).toEqual(["prepared", "confirmed"])

    const stored = await first.findRun("confirm", "order-1")
    expect(stored!.status).toEqual("succeeded")
    expect(stored!.result).toEqual(["prepared", "confirmed"])
  })

  it("rejects a second start of an active transaction id across instances", async () => {
    const first = engine()
    const second = engine()
    first.register(confirmWorkflow())
    second.register(confirmWorkflow())

    await first.start({ workflowId: "confirm", transactionId: "order-2" })
    await expect(
      second.start({ workflowId: "confirm", transactionId: "order-2" })
    ).rejects.toThrow("Transaction already started for transactionId: order-2")
  })

  it("completes a background step and continues", async () => {
    const instance = engine()
    instance.register(
      defineWorkflow({
        id: "background",
        steps: [
          {
            id: "work",
            invoke: async () => {
              await wait(20)
              return "done"
            },
            options: { async: true },
          },
          { id: "after", invoke: async (ctx) => ctx.results.get("work") },
        ],
        result: (ctx) => ctx.results.get("after"),
      })
    )

    const handle = await instance.start({ workflowId: "background" })
    const finished = await handle.wait()
    expect(finished.result).toEqual("done")
  })

  it("compensates after a failure and stores the errors", async () => {
    const instance = engine()
    const compensated: string[] = []
    instance.register(
      defineWorkflow({
        id: "failing",
        steps: [
          {
            id: "a",
            invoke: async () => "a",
            compensate: async (input) => {
              compensated.push(input as string)
            },
          },
          {
            id: "b",
            invoke: async () => {
              throw new Error("boom")
            },
          },
        ],
        options: { durability: "full", retentionTimeMs: 60_000 },
      })
    )

    const handle = await instance.start({
      workflowId: "failing",
      transactionId: "f-1",
    })
    expect(handle.status).toEqual("compensated")
    expect(compensated).toEqual(["a"])

    const stored = await instance.findRun("failing", "f-1", { steps: true })
    expect(stored!.errors[0]).toEqual(
      expect.objectContaining({ stepId: "b", action: "invoke" })
    )
    expect(stored!.steps!.map((s) => [s.stepId, s.status]).sort()).toEqual([
      ["a", "compensated"],
      ["b", "compensated"],
    ])
  })

  it("marks an interrupted summary run as failed", async () => {
    const store = new PostgresStore({ client: fromPg(database.pool) })
    const survivor = createEngine({
      store,
      pollIntervalMs: 20,
      recovery: {
        heartbeatIntervalMs: 20,
        reaperIntervalMs: 20,
        leaseTtlMs: 200,
      },
    })
    engines.push(survivor)
    const compiled = survivor.register(
      defineWorkflow({
        id: "summary",
        steps: [{ id: "a", invoke: async () => "a" }],
        options: { retentionTimeMs: 60_000 },
      })
    )
    await store.createRun(
      {
        id: "interrupted",
        workflowId: "summary",
        transactionId: "interrupted",
        status: "running",
        durability: "summary",
        definitionHash: compiled.hash,
        input: {},
        context: {},
        metadata: {},
        errors: [],
        flags: {},
        idempotent: false,
        retentionMs: 60_000,
      },
      { unique: true, idempotent: false },
      { owner: "dead", ttlMs: 1 }
    )
    await survivor.boot()

    const deadline = Date.now() + 5_000
    while ((await store.loadRun("interrupted"))?.status !== "failed") {
      if (Date.now() > deadline) {
        throw new Error("The interrupted run was not failed in time")
      }
      await wait(20)
    }
  })

  describe("writes per durability", () => {
    const twoSteps = (options: Record<string, unknown>) =>
      defineWorkflow({
        id: "two",
        steps: [
          { id: "a", invoke: async () => "a" },
          { id: "b", invoke: async () => "b" },
        ],
        options,
      })

    it.each([
      [{}, 0],
      [{ retentionTimeMs: 60_000 }, 2],
      [{ durability: "full", retentionTimeMs: 60_000 }, 4],
    ])("writes for options %j: %i", async (options, expected) => {
      const counting = countingClient(fromPg(database.pool))
      const instance = engine(counting.client)
      instance.register(twoSteps(options))
      await instance.start({ workflowId: "two" })
      expect(counting.writes).toHaveLength(expected)
    })
  })

  it("counts timer due times from the database clock", async () => {
    const store = new PostgresStore({ client: fromPg(database.pool) })
    const realNow = Date.now()
    const spy = jest.spyOn(Date, "now").mockReturnValue(realNow + 60 * 60_000)
    try {
      await store.scheduleTimers([
        {
          id: "clock-timer",
          kind: "resume",
          runId: "clock-run",
          workflowId: "clock",
          definitionHash: "hash",
          dueAt: new Date(Date.now()),
        },
      ])
    } finally {
      spy.mockRestore()
    }

    const claimed = await store.claimDueTimers(
      "instance",
      10,
      [{ workflowId: "clock", hash: "hash" }],
      { claimMs: 30_000, mismatchGraceMs: 60_000 }
    )
    expect(claimed.map((t) => t.id)).toEqual(["clock-timer"])
  })
})
