import { defineWorkflow } from "../definition/builder"
import { createEngine, Engine } from "../engine"
import { createOutbox, Outbox } from "../outbox/outbox"
import { MemoryStore } from "../store/memory/memory-store"

type Message = { name: string }

describe("outbox", () => {
  let store: MemoryStore
  let engine: Engine
  let outbox: Outbox
  let published: Message[][]
  let failPublish: boolean

  beforeEach(() => {
    store = new MemoryStore()
    published = []
    failPublish = false
    outbox = createOutbox(store, {
      publish: async (messages) => {
        if (failPublish) {
          throw new Error("transport down")
        }
        published.push(messages as Message[])
      },
      groupOf: (run) => run.context?.group as string | undefined,
      releases: (run) => !run.context?.child,
      republishIntervalMs: 20,
    })
    engine = createEngine({
      store,
      extensions: [outbox.extension],
      pollIntervalMs: 20,
      logger: { error: () => {}, warn: () => {} },
    })
  })

  afterEach(async () => {
    await engine.shutdown({ graceMs: 0 })
  })

  const emit =
    (...names: string[]) =>
    () =>
      outbox.stage(
        "g",
        names.map((name) => ({ name }))
      )

  it("publishes staged messages in order once the root run succeeds", async () => {
    engine.register(
      defineWorkflow({
        id: "ok",
        steps: [
          { id: "a", invoke: emit("a1", "a2") },
          { id: "b", invoke: emit("b1") },
        ],
      })
    )

    await engine.start({ workflowId: "ok", context: { group: "g" } })

    expect(published).toEqual([
      [{ name: "a1" }, { name: "a2" }, { name: "b1" }],
    ])
  })

  it("drops the group when the root run fails", async () => {
    engine.register(
      defineWorkflow({
        id: "failing",
        steps: [
          { id: "a", invoke: emit("a1") },
          {
            id: "b",
            invoke: async () => {
              throw new Error("boom")
            },
          },
        ],
        options: { durability: "full" },
      })
    )

    await engine.start({ workflowId: "failing", context: { group: "g" } })

    expect(published).toEqual([])
    expect(await store.claimOutbox("x", 100, 1000)).toEqual([])
  })

  it("drops the messages of an attempt that is retried", async () => {
    engine.register(
      defineWorkflow({
        id: "retry",
        steps: [
          {
            id: "a",
            invoke: async (ctx) => {
              await outbox.stage("g", [{ name: `attempt-${ctx.attempt}` }])
              if (ctx.attempt === 1) {
                throw new Error("again")
              }
              return "ok"
            },
            options: { maxRetries: 1 },
          },
        ],
        options: { durability: "full" },
      })
    )

    await engine.start({ workflowId: "retry", context: { group: "g" } })

    expect(published).toEqual([[{ name: "attempt-2" }]])
  })

  it("drops a compensated step's messages, but keeps a continued run's", async () => {
    engine.register(
      defineWorkflow({
        id: "child",
        steps: [
          { id: "c", invoke: emit("child") },
          {
            id: "fail",
            invoke: async () => {
              throw new Error("child failed")
            },
          },
        ],
      })
    )
    engine.register(
      defineWorkflow({
        id: "parent",
        steps: [
          { id: "p", invoke: emit("parent") },
          {
            id: "run-child",
            invoke: async (ctx) => {
              await engine
                .start({
                  workflowId: "child",
                  context: { group: "g", child: true },
                  parent: { runId: ctx.runId, stepId: ctx.stepId },
                })
                .catch(() => undefined)
              return "continued"
            },
          },
        ],
      })
    )

    await engine.start({ workflowId: "parent", context: { group: "g" } })

    expect(published).toEqual([[{ name: "parent" }]])
  })

  it("publishes early on release", async () => {
    engine.register(
      defineWorkflow({
        id: "early",
        steps: [
          { id: "a", invoke: emit("a1") },
          { id: "release", invoke: () => outbox.release("g") },
          { id: "b", invoke: emit("b1") },
        ],
        options: { durability: "full" },
      })
    )

    await engine.start({ workflowId: "early", context: { group: "g" } })

    expect(published).toEqual([[{ name: "a1" }], [{ name: "b1" }]])
  })

  it("publishes again after a failed publish, without failing the run", async () => {
    engine.register(
      defineWorkflow({
        id: "retry-publish",
        steps: [{ id: "a", invoke: emit("a1") }],
      })
    )
    await engine.boot()

    failPublish = true
    const handle = await engine.start({
      workflowId: "retry-publish",
      context: { group: "g" },
    })
    expect(handle.status).toEqual("succeeded")
    expect(published).toEqual([])

    failPublish = false
    const start = Date.now()
    while (!published.length && Date.now() - start < 2000) {
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    expect(published).toEqual([[{ name: "a1" }]])
  })

  it("stops retrying a message after the last attempt and logs it once", async () => {
    const warnings: string[] = []
    const deadStore = new MemoryStore()
    const deadOutbox = createOutbox(deadStore, {
      publish: async () => {
        throw new Error("transport down")
      },
      groupOf: (run) => run.context?.group as string | undefined,
      releases: () => true,
      republishIntervalMs: 5,
      maxPublishAttempts: 3,
      logger: { warn: (message) => warnings.push(message) },
    })
    const deadEngine = createEngine({
      store: deadStore,
      extensions: [deadOutbox.extension],
      pollIntervalMs: 5,
      logger: { error: () => {}, warn: () => {} },
    })
    try {
      deadEngine.register(
        defineWorkflow({
          id: "dead-publish",
          steps: [
            {
              id: "a",
              invoke: () => deadOutbox.stage("g", [{ name: "a1" }]),
            },
          ],
          options: { durability: "full" },
        })
      )
      await deadEngine.boot()
      await deadEngine.start({
        workflowId: "dead-publish",
        context: { group: "g" },
      })

      const start = Date.now()
      while (!warnings.length && Date.now() - start < 2000) {
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(warnings).toHaveLength(1)
      expect(warnings[0]).toContain("a1")
      expect(warnings[0]).toContain("transport down")
      expect(await deadStore.claimOutbox("x", 10, 1000)).toEqual([])
    } finally {
      await deadEngine.shutdown({ graceMs: 0 })
    }
  })

  describe("store round trips", () => {
    const spies = () => ({
      stage: jest.spyOn(store, "stageOutbox"),
      ready: jest.spyOn(store, "markOutboxReady"),
      claim: jest.spyOn(store, "claimOutbox"),
      deleteBy: jest.spyOn(store, "deleteOutbox"),
      deleteIds: jest.spyOn(store, "deleteOutboxIds"),
    })

    it("writes a stored run's messages with its commits and claims them in the final one", async () => {
      engine.register(
        defineWorkflow({
          id: "stored",
          steps: [
            { id: "a", invoke: emit("a1", "a2") },
            { id: "b", invoke: emit("b1") },
          ],
          options: { durability: "full" },
        })
      )
      const calls = spies()

      await engine.start({ workflowId: "stored", context: { group: "g" } })

      expect(published).toEqual([
        [{ name: "a1" }, { name: "a2" }, { name: "b1" }],
      ])
      expect(calls.stage).not.toHaveBeenCalled()
      expect(calls.claim).not.toHaveBeenCalled()
      expect(calls.ready).not.toHaveBeenCalled()
      await engine.shutdown({ graceMs: 0 })
      expect(calls.deleteIds).toHaveBeenCalledTimes(1)
      expect(await store.claimOutbox("x", 100, 1000)).toEqual([])
    })

    it("does not reach the store for a run that is not stored", async () => {
      engine.register(
        defineWorkflow({
          id: "not-stored",
          steps: [{ id: "a", invoke: emit("a1") }],
        })
      )
      const calls = spies()

      await engine.start({ workflowId: "not-stored", context: { group: "g" } })

      expect(published).toEqual([[{ name: "a1" }]])
      for (const spy of Object.values(calls)) {
        expect(spy).not.toHaveBeenCalled()
      }
    })

    it("writes an async step's messages at once", async () => {
      engine.register(
        defineWorkflow({
          id: "async-stage",
          steps: [
            {
              id: "a",
              invoke: async () => {
                await outbox.stage("g", [{ name: "a1" }])
                return { kind: "wait" }
              },
              options: { async: true },
            },
          ],
          options: { retentionTimeMs: 60_000 },
        })
      )
      const calls = spies()

      const handle = await engine.start({
        workflowId: "async-stage",
        transactionId: "t",
        context: { group: "g" },
      })
      expect(handle.status).toEqual("waiting")
      expect(calls.stage).toHaveBeenCalledTimes(1)

      await engine.completeStep(
        { workflowId: "async-stage", transactionId: "t", stepId: "a" },
        { output: "ok" }
      )
      const start = Date.now()
      while (!published.length && Date.now() - start < 2000) {
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
      expect(published).toEqual([[{ name: "a1" }]])
    })

    it("drops a retried attempt's messages without a store write when they were never written", async () => {
      engine.register(
        defineWorkflow({
          id: "retried",
          steps: [
            {
              id: "a",
              invoke: async (ctx) => {
                await outbox.stage("g", [{ name: `attempt-${ctx.attempt}` }])
                if (ctx.attempt === 1) {
                  throw new Error("again")
                }
                return "ok"
              },
              options: { maxRetries: 1 },
            },
          ],
          options: { durability: "full" },
        })
      )
      const calls = spies()

      await engine.start({ workflowId: "retried", context: { group: "g" } })

      expect(published).toEqual([[{ name: "attempt-2" }]])
      expect(calls.deleteBy).not.toHaveBeenCalled()
    })

    it("deletes the published messages of concurrent runs together", async () => {
      engine.register(
        defineWorkflow({
          id: "concurrent",
          steps: [
            {
              id: "a",
              invoke: (ctx) =>
                outbox.stage(ctx.context.group as string, [{ name: "a1" }]),
            },
          ],
          options: { durability: "full" },
        })
      )
      const calls = spies()

      await Promise.all(
        ["g1", "g2", "g3"].map((group) =>
          engine.start({ workflowId: "concurrent", context: { group } })
        )
      )
      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(published).toHaveLength(3)
      expect(calls.deleteIds).toHaveBeenCalledTimes(1)
      expect(calls.deleteIds.mock.calls[0][0]).toHaveLength(3)
    })
  })
})
