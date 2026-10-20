import { AsyncLocalStorage } from "node:async_hooks"
import { setTimeout as wait } from "timers/promises"
import { defineWorkflow } from "../definition/builder"
import { createEngine, Engine, EngineConfig, RunHandle } from "../engine"
import { EngineStoppedError, RunInterruptedError } from "../errors"
import { EngineExtension } from "../runtime/middleware"
import { retryTimer } from "../scheduling/timers"
import { createMemoryNotifier } from "../signals/memory"
import { NotifierMessage } from "../signals/notifier"
import { MemoryStore } from "../store/memory/memory-store"
import { collectEvents, FakeClock, flushPromises } from "../testing"

const engines: Engine[] = []

function logger() {
  return { error: jest.fn(), warn: jest.fn() }
}

function engine(config: EngineConfig = {}) {
  const instance = createEngine({ logger: logger(), ...config })
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

function within(promise: Promise<RunHandle>, ms = 1000) {
  return Promise.race([promise, wait(ms).then(() => "timed out" as const)])
}

const waitingWorkflow = (id: string) =>
  defineWorkflow({
    id,
    steps: [
      {
        id: "confirm",
        invoke: async () => ({ kind: "wait" }),
        options: { async: true },
      },
    ],
    options: { retentionTimeMs: 60_000 },
    result: (ctx) => ctx.results.get("confirm"),
  })

afterEach(async () => {
  await Promise.all(engines.splice(0).map((e) => e.shutdown({ graceMs: 0 })))
})

describe("step timeouts", () => {
  it("fails a step permanently when its handler honours the timeout signal", async () => {
    let calls = 0
    const instance = engine()
    instance.register(
      defineWorkflow({
        id: "honours-timeout",
        steps: [
          {
            id: "slow",
            invoke: async (ctx) => {
              calls++
              if (ctx.signal.aborted) {
                throw new Error("aborted")
              }
              await new Promise((_, reject) =>
                ctx.signal.addEventListener("abort", () =>
                  reject(new Error("aborted"))
                )
              )
            },
            options: { timeoutMs: 5, maxRetries: 2 },
          },
        ],
      })
    )

    const handle = await instance.start({ workflowId: "honours-timeout" })

    expect(calls).toEqual(1)
    expect(handle.status).toEqual("compensated")
    expect((handle.errors[0].cause as Error).message).toContain("timed out")
  })
})

describe("extension hooks", () => {
  const broken: EngineExtension = {
    name: "broken",
    onStepAttemptFailed: () => {
      throw new Error("hook failed")
    },
    onStepCompensated: async () => {
      throw new Error("hook failed")
    },
  }

  it("retries a step when onStepAttemptFailed throws", async () => {
    const log = logger()
    const instance = engine({ extensions: [broken], logger: log })
    instance.register(
      defineWorkflow({
        id: "retry-with-broken-hook",
        steps: [
          {
            id: "a",
            invoke: async (ctx) => {
              if (ctx.attempt === 1) {
                throw new Error("once")
              }
              return "ok"
            },
            options: { maxRetries: 1 },
          },
        ],
        result: (ctx) => ctx.results.get("a"),
      })
    )

    const handle = await instance.start({
      workflowId: "retry-with-broken-hook",
    })

    expect(handle.status).toEqual("succeeded")
    expect(handle.result).toEqual("ok")
    expect(log.error).toHaveBeenCalledWith(
      expect.stringContaining('Extension "broken"'),
      expect.objectContaining({ message: "hook failed" })
    )
  })

  it("compensates a step once when onStepCompensated throws", async () => {
    const compensated: string[] = []
    const instance = engine({ extensions: [broken] })
    instance.register(
      defineWorkflow({
        id: "compensate-with-broken-hook",
        steps: [
          {
            id: "a",
            invoke: async () => "a",
            compensate: async () => {
              compensated.push("a")
            },
            options: { maxRetries: 2 },
          },
          {
            id: "b",
            invoke: async () => {
              throw new Error("boom")
            },
          },
        ],
      })
    )

    const handle = await instance.start({
      workflowId: "compensate-with-broken-hook",
    })

    expect(handle.status).toEqual("compensated")
    expect(compensated).toEqual(["a"])
  })
})

describe("runs failed on resume", () => {
  it("finishes an interrupted child like any other run", async () => {
    const store = new MemoryStore()
    const log = logger()
    const finished: Array<[string, string]> = []
    const instance = engine({
      store,
      logger: log,
      autoBoot: false,
      extensions: [
        {
          name: "observer",
          onRunFinished: (run) => {
            finished.push([run.id, run.status])
          },
        },
      ],
    })
    const events = collectEvents(instance)
    instance.register(
      defineWorkflow({
        id: "parent",
        steps: [
          {
            id: "child",
            invoke: async () => ({ kind: "wait" }),
            options: { async: true, nested: true },
          },
        ],
        options: { retentionTimeMs: 60_000 },
      })
    )
    const child = instance.register(
      defineWorkflow({
        id: "child",
        steps: [{ id: "a", invoke: async () => "a" }],
        options: { retentionTimeMs: 60_000 },
      })
    )

    const parent = await instance.start({ workflowId: "parent" })
    expect(parent.status).toEqual("waiting")

    await store.createRun(
      {
        id: "child-run",
        workflowId: "child",
        transactionId: "t-child",
        status: "running",
        durability: "summary",
        definitionHash: child.hash,
        input: {},
        context: {},
        metadata: { completesParentStep: true },
        errors: [],
        flags: {},
        parentRunId: parent.runId,
        parentStepId: "child",
        idempotent: false,
        retentionMs: 60_000,
      },
      { unique: true, idempotent: false },
      { owner: "dead", ttlMs: 1 }
    )

    const resumed = await instance.resume("child-run", { force: true })

    expect(resumed.status).toEqual("failed")
    expect(finished).toContainEqual(["child-run", "failed"])
    expect(log.error).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(RunInterruptedError)
    )
    expect(
      events.some((e) => e.name === "runFinished" && e.runId === "child-run")
    ).toBe(true)

    await until(
      async () => (await store.loadRun(parent.runId))?.status === "compensated"
    )
  })
})

describe("published events", () => {
  it("publishes runStarted and runResumed to other instances", async () => {
    const published: NotifierMessage[] = []
    const instance = engine({
      notifier: {
        publish: async (message) => {
          published.push(message)
        },
        subscribe: async () => () => {},
      },
    })
    instance.register(waitingWorkflow("published"))

    const started = await instance.start({ workflowId: "published" })
    await instance.completeStep(
      { runId: started.runId, stepId: "confirm" },
      { output: "ok" }
    )

    const names = published.flatMap((m) => (m.type === "event" ? [m.name] : []))
    expect(names).toContain("runStarted")
    expect(names).toContain("runResumed")
    expect(names).toContain("runFinished")
  })
})

describe("RunHandle.wait", () => {
  it("resolves by polling when the run finishes on another instance", async () => {
    const store = new MemoryStore()
    const first = engine({ store, autoBoot: false, pollIntervalMs: 20 })
    const second = engine({ store, autoBoot: false })
    first.register(waitingWorkflow("elsewhere"))
    second.register(waitingWorkflow("elsewhere"))

    const handle = await first.start({ workflowId: "elsewhere" })
    expect(handle.status).toEqual("waiting")
    const waited = handle.wait()

    const done = await second.completeStep(
      { runId: handle.runId, stepId: "confirm" },
      { output: "ok" }
    )
    expect(done.status).toEqual("succeeded")

    expect(await within(waited)).toEqual(
      expect.objectContaining({ status: "succeeded", result: "ok" })
    )
  })

  it("resolves from the notifier when the run finishes on another instance", async () => {
    const store = new MemoryStore()
    const notifier = createMemoryNotifier()
    const first = engine({ store, notifier, pollIntervalMs: 60_000 })
    const second = engine({ store, notifier, autoBoot: false })
    first.register(waitingWorkflow("notified"))
    second.register(waitingWorkflow("notified"))
    await first.boot()

    const handle = await first.start({ workflowId: "notified" })
    const waited = handle.wait()

    await second.completeStep(
      { runId: handle.runId, stepId: "confirm" },
      { output: "ok" }
    )

    expect(await within(waited)).toEqual(
      expect.objectContaining({ status: "succeeded", result: "ok" })
    )
  })
})

describe("locals", () => {
  it("drops the caller's locals once the run parks", async () => {
    const instance = engine({
      extensions: [
        { name: "locals", resolveLocals: () => ({ tag: "resolved" }) },
      ],
    })
    instance.register(
      defineWorkflow({
        id: "parked-locals",
        steps: [
          { id: "confirm", invoke: async () => ({ kind: "wait" }) },
          { id: "after", invoke: async (ctx) => ctx.locals.tag },
        ],
        options: { durability: "full", retentionTimeMs: 60_000 },
        result: (ctx) => ctx.results.get("after"),
      })
    )

    const started = await instance.start({
      workflowId: "parked-locals",
      locals: { tag: "start" },
    })
    expect(started.status).toEqual("waiting")

    const done = await instance.completeStep(
      { runId: started.runId, stepId: "confirm" },
      { output: "ok" }
    )
    expect(done.result).toEqual("resolved")
  })

  it("fails a run that is not stored when a step waits", async () => {
    const instance = engine()
    instance.register(
      defineWorkflow({
        id: "unstored-wait",
        steps: [{ id: "confirm", invoke: async () => ({ kind: "wait" }) }],
      })
    )

    const handle = await instance.start({ workflowId: "unstored-wait" })

    expect(handle.finished).toBe(true)
    expect(handle.status).toEqual("compensated")
    expect((handle.errors[0].cause as Error).message).toContain(
      "could never resume"
    )
  })
})

describe("async step handlers", () => {
  it("aborts a running async handler when the run is cancelled", async () => {
    let aborted = false
    const instance = engine()
    instance.register(
      defineWorkflow({
        id: "abort-on-cancel",
        steps: [
          {
            id: "work",
            invoke: async (ctx) => {
              await new Promise<void>((resolve) => {
                if (ctx.signal.aborted) {
                  aborted = true
                  return resolve()
                }
                ctx.signal.addEventListener("abort", () => {
                  aborted = true
                  resolve()
                })
              })
              return { kind: "wait" }
            },
            options: { async: true },
          },
        ],
        options: { retentionTimeMs: 60_000 },
      })
    )

    const started = await instance.start({ workflowId: "abort-on-cancel" })
    expect(started.status).toEqual("waiting")

    const cancelled = await instance.cancel({ runId: started.runId })

    expect(cancelled.status).toEqual("cancelled")
    expect(aborted).toBe(true)
  })
})

describe("parent continuation", () => {
  it("continues the parent outside the finishing child's context", async () => {
    const storage = new AsyncLocalStorage<string>()
    const entries: Array<{ workflowId: string; inside?: string }> = []
    const instance = engine({
      extensions: [
        {
          name: "context",
          aroundRun: (invocation, next) => {
            entries.push({
              workflowId: invocation.run.workflowId,
              inside: storage.getStore(),
            })
            return storage.run(invocation.run.workflowId, next)
          },
        },
      ],
    })

    let release!: () => void
    const gate = new Promise<void>((resolve) => (release = resolve))
    instance.register(
      defineWorkflow({
        id: "ctx-child",
        steps: [
          {
            id: "child-step",
            invoke: async () => {
              await gate
              return "from-child"
            },
          },
        ],
        result: (ctx) => ctx.results.get("child-step"),
      })
    )
    instance.register(
      defineWorkflow({
        id: "ctx-parent",
        steps: [
          {
            id: "spawn",
            invoke: async (ctx) => {
              await instance.start({
                workflowId: "ctx-child",
                parent: {
                  runId: ctx.runId,
                  stepId: ctx.stepId,
                  completeStep: true,
                },
              })
              return { kind: "wait" }
            },
            options: { async: true, nested: true },
          },
          { id: "after", invoke: async (ctx) => ctx.results.get("spawn") },
        ],
        result: (ctx) => ctx.results.get("after"),
      })
    )

    const handle = await instance.start({ workflowId: "ctx-parent" })
    expect(handle.status).toEqual("waiting")
    const finished = handle.wait()
    release()

    expect(await within(finished, 3000)).toEqual(
      expect.objectContaining({ status: "succeeded", result: "from-child" })
    )
    const parentSegments = entries.filter((e) => e.workflowId === "ctx-parent")
    expect(parentSegments).toHaveLength(2)
    expect(parentSegments[1].inside).toBeUndefined()
  })
})

describe("timers and parking", () => {
  it("drops a retry timer for a step that already moved on", async () => {
    const clock = new FakeClock()
    const store = new MemoryStore({ clock })
    const instance = engine({ clock, store, pollIntervalMs: 1000 })
    const compiled = instance.register(
      defineWorkflow({
        id: "stale-retry",
        steps: [
          { id: "a", invoke: async () => "a" },
          {
            id: "confirm",
            invoke: async () => ({ kind: "wait" }),
            options: { async: true },
          },
        ],
        options: { retentionTimeMs: 60_000 },
      })
    )
    const created = await store.createRun(
      {
        id: "stale",
        workflowId: "stale-retry",
        transactionId: "t",
        status: "waiting",
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
      { owner: "other", ttlMs: 60_000 }
    )
    const lease = (created as { lease: any }).lease
    await store.commit(lease, {
      steps: [
        { stepId: "a", status: "succeeded", attempt: 1 },
        { stepId: "confirm", status: "waiting", attempt: 1 },
      ],
    })
    await store.releaseLease(lease)
    await store.scheduleTimers([
      retryTimer(
        {
          id: "stale",
          workflowId: "stale-retry",
          definitionHash: compiled.hash,
        },
        "a",
        new Date(clock.now())
      ),
    ])
    const acquire = jest.spyOn(store, "acquireLease")

    await instance.boot()
    await clock.advance(10)
    await flushPromises(50)

    expect(acquire).not.toHaveBeenCalled()
    expect(await store.nextTimerDueAt()).toBeNull()
  })

  it("logs a result that cannot be resolved while the run waits", async () => {
    const log = logger()
    const instance = engine({ logger: log })
    instance.register(
      defineWorkflow({
        id: "park-result",
        steps: [
          {
            id: "confirm",
            invoke: async () => ({ kind: "wait" }),
            options: { async: true },
          },
        ],
        result: () => {
          throw new Error("not yet")
        },
      })
    )

    const handle = await instance.start({ workflowId: "park-result" })

    expect(handle.status).toEqual("waiting")
    expect(log.warn).toHaveBeenCalledWith(expect.stringContaining("not yet"))
  })
})

async function storedRun(
  store: MemoryStore,
  hash: string,
  workflowId: string,
  steps: Array<{ stepId: string; status: any; attempt: number }>
) {
  const created = await store.createRun(
    {
      id: `run_${workflowId}`,
      workflowId,
      transactionId: "t",
      status: "waiting",
      durability: "full",
      definitionHash: hash,
      input: {},
      context: {},
      metadata: {},
      errors: [],
      flags: {},
      idempotent: false,
      retentionMs: 60_000,
    },
    { unique: true, idempotent: false },
    { owner: "other", ttlMs: 60_000 }
  )
  const lease = (created as { lease: any }).lease
  await store.commit(lease, { steps })
  await store.releaseLease(lease)
  return { id: `run_${workflowId}`, workflowId, definitionHash: hash }
}

describe("stale retry timers", () => {
  it("does not relaunch a step that is waiting on its next attempt", async () => {
    const clock = new FakeClock()
    const store = new MemoryStore({ clock })
    const instance = engine({ clock, store, pollIntervalMs: 1000 })
    const compiled = instance.register(waitingWorkflow("stale-async-retry"))
    const run = await storedRun(store, compiled.hash, "stale-async-retry", [
      { stepId: "confirm", status: "waiting", attempt: 2 },
    ])
    await store.scheduleTimers([
      retryTimer(run, "confirm", new Date(clock.now())),
    ])
    const acquire = jest.spyOn(store, "acquireLease")

    await instance.boot()
    await clock.advance(10)
    await flushPromises(50)

    expect(acquire).not.toHaveBeenCalled()
    const step = (await store.loadRun(run.id, { steps: true }))!.steps![0]
    expect(step).toEqual(
      expect.objectContaining({ status: "waiting", attempt: 2 })
    )
  })

  it("deletes the step's retry timer when the step is retried by hand", async () => {
    const clock = new FakeClock()
    const store = new MemoryStore({ clock })
    const instance = engine({ clock, store, autoBoot: false })
    const compiled = instance.register(waitingWorkflow("manual-retry"))
    const run = await storedRun(store, compiled.hash, "manual-retry", [
      { stepId: "confirm", status: "retry_scheduled", attempt: 1 },
    ])
    await store.scheduleTimers([
      retryTimer(run, "confirm", new Date(clock.now() + 60_000)),
    ])

    const handle = await instance.retryStep({
      runId: run.id,
      stepId: "confirm",
    })

    expect(handle.status).toEqual("waiting")
    expect(await store.nextTimerDueAt()).toBeNull()
    expect(
      await store.requestStepRetry(run.id, "confirm", undefined, {
        scheduledOnly: true,
      })
    ).toEqual({ ok: false, status: "waiting" })
  })
})

describe("unexpected executor failures", () => {
  it("releases the lease and schedules a resume", async () => {
    const clock = new FakeClock()
    const store = new MemoryStore({ clock })
    const instance = engine({
      clock,
      store,
      autoBoot: false,
      extensions: [
        {
          name: "boom",
          aroundRun: async () => {
            throw new Error("boom")
          },
        },
      ],
    })
    instance.register(waitingWorkflow("fails-unexpectedly"))

    await expect(
      instance.start({ workflowId: "fails-unexpectedly", transactionId: "t" })
    ).rejects.toThrow("boom")

    const run = (await store.findRun("fails-unexpectedly", "t"))!
    expect((await store.acquireLease(run.id, "other", 1000)).ok).toBe(true)
    expect(await store.nextTimerDueAt()).toEqual(new Date(clock.now() + 5000))
  })
})

describe("shutdown", () => {
  it("settles pending waits and refuses new runs", async () => {
    const instance = engine()
    instance.register(waitingWorkflow("stopped-wait"))
    const handle = await instance.start({ workflowId: "stopped-wait" })
    const waiting = handle.wait()

    await instance.shutdown({ graceMs: 0 })

    await expect(waiting).rejects.toBeInstanceOf(EngineStoppedError)
    await expect(handle.wait()).rejects.toBeInstanceOf(EngineStoppedError)
    await expect(
      instance.start({ workflowId: "stopped-wait" })
    ).rejects.toBeInstanceOf(EngineStoppedError)
  })

  it("leaves a run completed on a stopped instance to another one", async () => {
    const store = new MemoryStore()
    const first = engine({ store })
    first.register(waitingWorkflow("handed-over"))
    const started = await first.start({ workflowId: "handed-over" })
    await first.shutdown({ graceMs: 0 })
    const acquire = jest.spyOn(store, "acquireLease")

    const completed = await first.completeStep(
      { runId: started.runId, stepId: "confirm" },
      { output: "ok" }
    )
    expect(completed.status).toEqual("waiting")
    expect(acquire).not.toHaveBeenCalled()
    acquire.mockRestore()

    const second = engine({ store, pollIntervalMs: 20 })
    second.register(waitingWorkflow("handed-over"))
    await second.boot()
    await until(
      async () => (await store.loadRun(started.runId))!.status === "succeeded"
    )
  })
})

describe("children finishing before their parent waits", () => {
  it("completes the parent's step before it parks", async () => {
    const log = logger()
    const instance = engine({ logger: log })
    instance.register(
      defineWorkflow({
        id: "quick-child",
        steps: [{ id: "only", invoke: async () => "from-child" }],
        result: (ctx) => ctx.results.get("only"),
      })
    )
    instance.register(
      defineWorkflow({
        id: "slow-parent",
        steps: [
          {
            id: "spawn",
            invoke: async (ctx) => {
              await instance.start({
                workflowId: "quick-child",
                parent: {
                  runId: ctx.runId,
                  stepId: ctx.stepId,
                  completeStep: true,
                },
              })
              return { kind: "wait" }
            },
            options: { nested: true },
          },
          { id: "after", invoke: async (ctx) => ctx.results.get("spawn") },
        ],
        options: { retentionTimeMs: 60_000 },
        result: (ctx) => ctx.results.get("after"),
      })
    )

    const handle = await instance.start({ workflowId: "slow-parent" })

    expect(handle).toEqual(
      expect.objectContaining({ status: "succeeded", result: "from-child" })
    )
    expect(log.warn).toHaveBeenCalledWith(
      expect.stringContaining('could not complete step "spawn"')
    )
  })
})

describe("run timeouts with steps still running", () => {
  it("waits for a running step instead of spinning", async () => {
    const instance = engine({ pollIntervalMs: 5 })
    instance.register(
      defineWorkflow({
        id: "slow-step-timeout",
        steps: [
          {
            id: "slow",
            // Ignores the abort signal, so it is still running at the timeout.
            invoke: async () => {
              await wait(200)
              return { kind: "output", output: "late" }
            },
          },
        ],
        options: { timeoutMs: 20 },
      })
    )

    const handle = await within(
      instance.start({ workflowId: "slow-step-timeout" }),
      3000
    )

    expect(handle).not.toEqual("timed out")
    expect((handle as RunHandle).status).toEqual("compensated")
  })
})

describe("skipped nested steps", () => {
  it("continues past a step that skips before starting its child", async () => {
    const instance = engine({ store: new MemoryStore() })
    instance.register(
      defineWorkflow({
        id: "skip-parent",
        steps: [
          {
            id: "spawn",
            invoke: async () => ({ kind: "skip" }),
            options: { async: true, nested: true },
          },
          { id: "after", invoke: async () => "after" },
        ],
        result: (ctx) => ctx.results.get("after"),
        options: { retentionTimeMs: 60_000 },
      })
    )

    const handle = await instance.start({ workflowId: "skip-parent" })

    expect(await within(handle.wait(), 3000)).toEqual(
      expect.objectContaining({ status: "succeeded", result: "after" })
    )
  })
})
