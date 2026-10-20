import { setTimeout as wait } from "timers/promises"
import { defineWorkflow } from "../definition/builder"
import { createEngine, Engine, EngineConfig } from "../engine"
import { Dispatcher } from "../scheduling/dispatcher"
import { createMemoryNotifier } from "../signals/memory"
import { MemoryStore } from "../store/memory/memory-store"
import { FakeClock, flushPromises } from "../testing"

const engines: Engine[] = []

function engine(config: EngineConfig) {
  const instance = createEngine({
    logger: { error: () => {}, warn: () => {} },
    ...config,
  })
  engines.push(instance)
  return instance
}

async function until(
  check: () => boolean | Promise<boolean>,
  timeoutMs = 3000
) {
  const start = Date.now()
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) {
      throw new Error("Condition not met in time")
    }
    await wait(10)
  }
}

afterEach(async () => {
  await Promise.all(engines.splice(0).map((e) => e.shutdown({ graceMs: 0 })))
})

describe("durable timers", () => {
  let clock: FakeClock
  let instance: Engine

  beforeEach(async () => {
    clock = new FakeClock()
    instance = engine({
      clock,
      store: new MemoryStore({ clock }),
      pollIntervalMs: 1000,
    })
    await instance.boot()
  })

  it("times out an async step and compensates", async () => {
    const compensated: string[] = []
    instance.register(
      defineWorkflow({
        id: "async-timeout",
        steps: [
          {
            id: "a",
            invoke: async () => "a",
            compensate: async () => {
              compensated.push("a")
            },
          },
          {
            id: "wait",
            invoke: async () => ({ kind: "wait" }),
            options: { async: true, timeoutMs: 5000 },
          },
        ],
        options: { retentionTimeMs: 60_000 },
      })
    )

    const started = await instance.start({
      workflowId: "async-timeout",
      transactionId: "t",
    })
    expect(started.status).toEqual("waiting")

    await clock.advance(5001)
    await flushPromises(50)

    const run = await instance.findRun("async-timeout", "t", { steps: true })
    expect(run!.status).toEqual("compensated")
    expect(compensated).toEqual(["a"])
  })

  it("retries a failed async step after its interval", async () => {
    let attempts = 0
    instance.register(
      defineWorkflow({
        id: "async-retry",
        steps: [
          {
            id: "work",
            invoke: async (ctx) => {
              attempts++
              return ctx.attempt === 1 ? { kind: "wait" } : "second"
            },
            options: { async: true, maxRetries: 1, retryIntervalMs: 1000 },
          },
        ],
        options: { retentionTimeMs: 60_000 },
        result: (ctx) => ctx.results.get("work"),
      })
    )

    await instance.start({ workflowId: "async-retry", transactionId: "t" })
    const failed = await instance.failStep(
      { workflowId: "async-retry", transactionId: "t", stepId: "work" },
      new Error("try again")
    )
    expect(failed.status).toEqual("waiting")

    await clock.advance(1001)
    await flushPromises(50)

    const run = await instance.findRun("async-retry", "t")
    expect(attempts).toEqual(2)
    expect(run!.status).toEqual("succeeded")
    expect(run!.result).toEqual("second")
  })

  it("times out a waiting workflow", async () => {
    instance.register(
      defineWorkflow({
        id: "run-timeout",
        steps: [
          {
            id: "wait",
            invoke: async () => ({ kind: "wait" }),
            options: { async: true },
          },
        ],
        options: { timeoutMs: 2000, retentionTimeMs: 60_000 },
      })
    )

    await instance.start({ workflowId: "run-timeout", transactionId: "t" })
    await clock.advance(2001)
    await flushPromises(50)

    const run = await instance.findRun("run-timeout", "t")
    expect(run!.status).toEqual("compensated")
    expect(run!.flags.timedOut).toBe(true)
  })
})

describe("schedules", () => {
  let clock: FakeClock
  let store: MemoryStore

  beforeEach(() => {
    clock = new FakeClock()
    store = new MemoryStore({ clock })
  })

  const scheduled = (
    instance: Engine,
    id: string,
    invoke: (input: unknown) => Promise<unknown>,
    schedule: Record<string, unknown>
  ) =>
    instance.register(
      defineWorkflow({
        id,
        steps: [{ id: "job", invoke: async (ctx) => invoke(ctx.input) }],
        options: { schedule },
      })
    )

  it("fires an interval schedule the given number of times", async () => {
    const inputs: unknown[] = []
    const instance = engine({ clock, store, pollIntervalMs: 100 })
    scheduled(
      instance,
      "every-second",
      async (input) => {
        inputs.push(input)
      },
      { intervalMs: 1000, numberOfExecutions: 3 }
    )
    await instance.boot()

    for (let i = 0; i < 5; i++) {
      await clock.advance(1000)
      await flushPromises(30)
    }

    expect(inputs).toHaveLength(3)
    expect(inputs[0]).toEqual({
      scheduledFor: new Date(Date.UTC(2026, 0, 1) + 1000).toISOString(),
    })
  })

  it("fires on time with the long poll interval of a notified instance", async () => {
    const fired: number[] = []
    const instance = engine({
      clock,
      store,
      notifier: createMemoryNotifier(),
    })
    scheduled(
      instance,
      "every-second-notified",
      async () => {
        fired.push(clock.now())
      },
      { intervalMs: 1000, numberOfExecutions: 3 }
    )
    const start = clock.now()
    await instance.boot()

    for (let i = 0; i < 3; i++) {
      await clock.advance(1000)
      await flushPromises(30)
    }

    expect(fired.map((at) => at - start)).toEqual([1000, 2000, 3000])
  })

  it("keeps firing after a run fails", async () => {
    let calls = 0
    const instance = engine({ clock, store, pollIntervalMs: 100 })
    scheduled(
      instance,
      "failing-job",
      async () => {
        calls++
        throw new Error("job failed")
      },
      { intervalMs: 1000 }
    )
    await instance.boot()

    for (let i = 0; i < 3; i++) {
      await clock.advance(1000)
      await flushPromises(30)
    }

    expect(calls).toEqual(3)
  })

  it("skips a fire while the previous run is still running", async () => {
    let calls = 0
    const instance = engine({ clock, store, pollIntervalMs: 100 })
    instance.register(
      defineWorkflow({
        id: "slow-job",
        steps: [
          {
            id: "job",
            invoke: async () => {
              calls++
              return { kind: "wait" }
            },
            options: { async: true },
          },
        ],
        options: { schedule: { intervalMs: 1000, concurrency: "forbid" } },
      })
    )
    await instance.boot()

    for (let i = 0; i < 3; i++) {
      await clock.advance(1000)
      await flushPromises(30)
    }

    expect(calls).toEqual(1)
  })

  it("does not spin on a cron that fires rarely", async () => {
    const instance = engine({ clock, store, pollIntervalMs: 1000 })
    scheduled(instance, "monthly", async () => {}, { cron: "0 0 1 * *" })
    const claims = jest.spyOn(store, "claimDueSchedules")
    await instance.boot()

    await clock.advance(10_000)
    await flushPromises(30)

    expect(claims.mock.calls.length).toBeLessThan(20)
  })
})

describe("several instances on one store", () => {
  let store: MemoryStore
  const notifier = createMemoryNotifier()
  const fast = { pollIntervalMs: 20, notifier }

  beforeEach(() => {
    store = new MemoryStore()
  })

  const handOff = (ran: string[], name: string) =>
    defineWorkflow({
      id: "hand-off",
      steps: [
        { id: "first", invoke: async () => ran.push(`${name}:first`) },
        {
          id: "background",
          invoke: async () => {
            ran.push(`${name}:background`)
            return "done"
          },
          options: { async: true },
        },
        {
          id: "confirm",
          invoke: async () => ({ kind: "wait" }),
          options: { async: true },
        },
        { id: "last", invoke: async () => ran.push(`${name}:last`) },
      ],
      options: { retentionTimeMs: 60_000 },
    })

  it("leaves async steps and continuations to workers", async () => {
    const ran: string[] = []
    const server = engine({ ...fast, store, mode: "server" })
    const worker = engine({ ...fast, store, mode: "worker" })
    server.register(handOff(ran, "server"))
    worker.register(handOff(ran, "worker"))
    await server.boot()
    await worker.boot()

    const started = await server.start({
      workflowId: "hand-off",
      transactionId: "t",
    })
    expect(started.status).toEqual("waiting")

    await until(async () => {
      const run = await store.findRun("hand-off", "t", { steps: true })
      return run!.steps!.some(
        (s) => s.stepId === "confirm" && s.status === "waiting"
      )
    })

    const completed = await server.completeStep(
      { workflowId: "hand-off", transactionId: "t", stepId: "confirm" },
      { output: "ok" }
    )
    expect(completed.status).toEqual("waiting")

    await until(
      async () => (await store.findRun("hand-off", "t"))!.status === "succeeded"
    )
    expect(ran).toEqual(["server:first", "worker:background", "worker:last"])
  })

  it("times out a run on the worker it waits on, without waiting for a poll", async () => {
    // Like the Postgres store, which cannot tell when the next timer is due,
    // and with the default interval, which is long with a notifier.
    Object.defineProperty(store, "nextTimerDueAt", { value: undefined })
    const definition = defineWorkflow({
      id: "timed-out",
      steps: [
        {
          id: "confirm",
          invoke: async () => ({ kind: "wait" }),
          options: { async: true },
        },
      ],
      options: { retentionTimeMs: 60_000, timeoutMs: 200 },
    })
    const server = engine({ store, notifier, mode: "server" })
    const worker = engine({ store, notifier, mode: "worker" })
    server.register(definition)
    worker.register(definition)
    await worker.boot()
    await server.boot()

    await server.start({ workflowId: "timed-out", transactionId: "t" })

    await until(async () => {
      const run = await store.findRun("timed-out", "t")
      return run!.status !== "running" && run!.status !== "waiting"
    }, 5000)
  })

  it("hands runs over on graceful shutdown", async () => {
    const runs: string[] = []
    let release!: () => void
    const blocked = new Promise<void>((resolve) => (release = resolve))
    const definition = (name: string) =>
      defineWorkflow({
        id: "long",
        steps: [
          {
            id: "slow",
            invoke: async () => {
              runs.push(name)
              if (name === "first") {
                await blocked
              }
              return name
            },
          },
        ],
        options: { durability: "full", retentionTimeMs: 60_000 },
        result: (ctx) => ctx.results.get("slow"),
      })

    const first = engine({ ...fast, store })
    const second = engine({ ...fast, store })
    first.register(definition("first"))
    second.register(definition("second"))
    await second.boot()

    const running = first.start({ workflowId: "long", transactionId: "t" })
    await until(() => runs.length === 1)
    await first.shutdown({ graceMs: 10 })

    await until(
      async () => (await store.findRun("long", "t"))!.status === "succeeded"
    )
    expect((await store.findRun("long", "t"))!.result).toEqual("second")

    // The first instance finishes its step late; its write is fenced off.
    release()
    const late = await running
    expect(late.finished).toBe(false)
  })

  it("fails a run whose completed steps no longer exist", async () => {
    const before = engine({ ...fast, store, autoBoot: false })
    before.register(
      defineWorkflow({
        id: "changing",
        steps: [
          { id: "old", invoke: async () => "old" },
          {
            id: "confirm",
            invoke: async () => ({ kind: "wait" }),
            options: { async: true },
          },
        ],
        options: { retentionTimeMs: 60_000 },
      })
    )
    await before.start({ workflowId: "changing", transactionId: "t" })

    const after = engine({ ...fast, store, autoBoot: false })
    after.register(
      defineWorkflow({
        id: "changing",
        steps: [
          { id: "new", invoke: async () => "new" },
          {
            id: "confirm",
            invoke: async () => ({ kind: "wait" }),
            options: { async: true },
          },
        ],
        options: { retentionTimeMs: 60_000 },
      })
    )
    const handle = await after.completeStep(
      { workflowId: "changing", transactionId: "t", stepId: "confirm" },
      { output: "ok" }
    )

    expect(handle.status).toEqual("failed")
    expect(handle.errors[0].error.message).toContain('"old"')
  })

  it("takes over a stuck run by force when recovery is off", async () => {
    const instance = engine({ ...fast, store })
    const compiled = instance.register(
      defineWorkflow({
        id: "stuck",
        steps: [{ id: "a", invoke: async () => "resumed" }],
        options: { durability: "full", retentionTimeMs: 60_000 },
        result: (ctx) => ctx.results.get("a"),
      })
    )
    await store.createRun(
      {
        id: "stuck-run",
        workflowId: "stuck",
        transactionId: "t",
        status: "running",
        durability: "full",
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
      { owner: "dead", ttlMs: 24 * 60 * 60 * 1000 }
    )

    expect((await instance.resume("stuck-run")).status).toEqual("running")
    const handle = await instance.resume("stuck-run", { force: true })
    expect(handle.status).toEqual("succeeded")
    expect(handle.result).toEqual("resumed")
  })
})

describe("dispatcher", () => {
  function dispatcher(
    clock: FakeClock,
    store: MemoryStore,
    capacity: () => number = () => 10
  ) {
    const instance = new Dispatcher({
      store,
      clock,
      owner: "me",
      pollIntervalMs: 1000,
      batchSize: 10,
      claimMs: 30_000,
      mismatchGraceMs: 60_000,
      capacity,
      known: () => [{ workflowId: "wf", hash: "hash" }],
      scheduledWorkflows: () => [],
      onTimer: async () => {},
      onSchedule: async () => {},
      onError: () => {},
    })
    instance.start()
    return instance
  }

  const dueTimer = (clock: FakeClock, workflowId: string, inMs = 0) => ({
    id: `resume:${workflowId}`,
    kind: "resume" as const,
    runId: workflowId,
    workflowId,
    definitionHash: "hash",
    dueAt: new Date(clock.now() + inMs),
  })

  it("polls instead of spinning on due timers it cannot claim", async () => {
    const clock = new FakeClock()
    const store = new MemoryStore({ clock })
    await store.scheduleTimers([dueTimer(clock, "unknown")])
    const claim = jest.spyOn(store, "claimDueTimers")
    const next = jest.spyOn(store, "nextTimerDueAt")

    const running = dispatcher(clock, store)
    await flushPromises(50)
    expect(claim).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(["wf"])

    // The poll is jittered to between 80% and 100% of the interval.
    await clock.advance(799)
    expect(claim).toHaveBeenCalledTimes(1)
    await clock.advance(201)
    expect(claim).toHaveBeenCalledTimes(2)
    await running.stop()
  })

  it("wakes up when a timer this instance armed is due", async () => {
    const clock = new FakeClock()
    const store = new MemoryStore({ clock })
    // Like the Postgres store, which cannot tell when the next timer is due.
    Object.defineProperty(store, "nextTimerDueAt", { value: undefined })
    const claim = jest.spyOn(store, "claimDueTimers")

    const running = dispatcher(clock, store)
    await flushPromises(50)
    expect(claim).toHaveBeenCalledTimes(1)

    running.wakeAt(new Date(clock.now() + 100))
    await flushPromises(50)
    await clock.advance(99)
    expect(claim).toHaveBeenCalledTimes(2)
    await clock.advance(1)
    expect(claim).toHaveBeenCalledTimes(3)
    await running.stop()
  })

  it("keeps every wake-up time, not only the earliest", async () => {
    const clock = new FakeClock()
    const store = new MemoryStore({ clock })
    Object.defineProperty(store, "nextTimerDueAt", { value: undefined })
    const claim = jest.spyOn(store, "claimDueTimers")

    const running = dispatcher(clock, store)
    await flushPromises(50)
    running.wakeAt(new Date(clock.now() + 300))
    running.wakeAt(new Date(clock.now() + 100))
    await flushPromises(50)
    const before = claim.mock.calls.length

    await clock.advance(100)
    expect(claim.mock.calls.length).toEqual(before + 1)
    await clock.advance(200)
    expect(claim.mock.calls.length).toEqual(before + 2)
    await running.stop()
  })

  it("sleeps only until a future timer is due", async () => {
    const clock = new FakeClock()
    const store = new MemoryStore({ clock })
    await store.scheduleTimers([dueTimer(clock, "wf", 100)])
    const claim = jest.spyOn(store, "claimDueTimers")

    const running = dispatcher(clock, store)
    await flushPromises(50)
    expect(claim).toHaveBeenCalledTimes(1)

    await clock.advance(99)
    expect(claim).toHaveBeenCalledTimes(1)
    await clock.advance(1)
    expect(claim.mock.calls.length).toBeGreaterThanOrEqual(2)
    await running.stop()
  })

  it("does not look for the next timer without capacity", async () => {
    const clock = new FakeClock()
    const store = new MemoryStore({ clock })
    const next = jest.spyOn(store, "nextTimerDueAt")

    const running = dispatcher(clock, store, () => 0)
    await flushPromises(50)

    expect(next).not.toHaveBeenCalled()
    await running.stop()
  })
})

describe("memory store claims", () => {
  it("keeps a timer claimed until its claim has passed, as Postgres does", async () => {
    const clock = new FakeClock()
    const store = new MemoryStore({ clock })
    const known = [{ workflowId: "wf", hash: "hash" }]
    const opts = { claimMs: 1000, mismatchGraceMs: 0 }
    await store.scheduleTimers([
      {
        id: "resume:run",
        kind: "resume",
        runId: "run",
        workflowId: "wf",
        definitionHash: "hash",
        dueAt: new Date(clock.now()),
      },
    ])

    expect(await store.claimDueTimers("a", 10, known, opts)).toHaveLength(1)
    await clock.advance(1000)
    expect(await store.claimDueTimers("b", 10, known, opts)).toEqual([])
    await clock.advance(1)
    expect(await store.claimDueTimers("b", 10, known, opts)).toHaveLength(1)
  })
})
