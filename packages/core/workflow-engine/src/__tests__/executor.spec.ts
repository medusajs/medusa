import { setTimeout as wait } from "timers/promises"
import { defineWorkflow } from "../definition/builder"
import { createEngine, Engine } from "../engine"
import { NonRetryableError } from "../errors"
import { MemoryStore } from "../store/memory/memory-store"
import { Lease, RunChanges, Store } from "../store/store"
import { collectEvents } from "../testing"

function countingStore() {
  const store = new MemoryStore()
  const writes: string[] = []
  const wrap = <K extends keyof Store>(name: K) => {
    const original = (store as any)[name].bind(store)
    ;(store as any)[name] = (...args: any[]) => {
      writes.push(name)
      return original(...args)
    }
  }
  wrap("createRun")
  wrap("commit")
  wrap("completeWaitingStep")
  return { store, writes }
}

describe("Executor", () => {
  let engine: Engine

  beforeEach(() => {
    engine = createEngine()
  })

  afterEach(async () => {
    await engine.shutdown()
  })

  it("runs a sequence and resolves the result", async () => {
    const order: string[] = []
    engine.register(
      defineWorkflow({
        id: "sequence",
        steps: [
          { id: "a", invoke: async () => (order.push("a"), 1) },
          {
            id: "b",
            invoke: async (ctx) => (
              order.push("b"), (ctx.results.get("a") as number) + 1
            ),
          },
        ],
        result: (ctx) => ctx.results.get("b"),
      })
    )

    const handle = await engine.start({ workflowId: "sequence", input: {} })

    expect(order).toEqual(["a", "b"])
    expect(handle.status).toEqual("succeeded")
    expect(handle.result).toEqual(2)
  })

  it("runs parallel steps concurrently and waits for all of them", async () => {
    const started: string[] = []
    let release!: () => void
    const gate = new Promise<void>((resolve) => (release = resolve))

    engine.register(
      defineWorkflow({
        id: "parallel",
        steps: [
          { id: "root", invoke: async () => "root" },
          {
            id: "a",
            dependsOn: ["root"],
            invoke: async () => {
              started.push("a")
              await gate
              return "a"
            },
          },
          {
            id: "b",
            dependsOn: ["root"],
            invoke: async () => {
              started.push("b")
              release()
              return "b"
            },
          },
          {
            id: "after",
            dependsOn: ["a", "b"],
            invoke: async (ctx) => [ctx.results.get("a"), ctx.results.get("b")],
          },
        ],
        result: (ctx) => ctx.results.get("after"),
      })
    )

    const handle = await engine.start({ workflowId: "parallel" })

    expect(started.sort()).toEqual(["a", "b"])
    expect(handle.result).toEqual(["a", "b"])
  })

  it("compensates succeeded and failed steps deepest first after a failure", async () => {
    const compensated: Array<[string, unknown]> = []
    const compensate = (id: string) => async (input: unknown) => {
      compensated.push([id, input])
    }

    engine.register(
      defineWorkflow({
        id: "failing",
        steps: [
          { id: "a", invoke: async () => "a", compensate: compensate("a") },
          { id: "b", invoke: async () => "b", compensate: compensate("b") },
          {
            id: "c",
            invoke: async () => {
              throw new Error("boom")
            },
            compensate: compensate("c"),
          },
          { id: "d", invoke: async () => "d", compensate: compensate("d") },
        ],
      })
    )

    const handle = await engine.start({ workflowId: "failing" })

    expect(handle.status).toEqual("compensated")
    expect(compensated).toEqual([
      ["c", undefined],
      ["b", "b"],
      ["a", "a"],
    ])
    expect(handle.errors).toHaveLength(1)
    expect(handle.errors[0]).toEqual(
      expect.objectContaining({ stepId: "c", action: "invoke" })
    )
    expect((handle.errors[0].cause as Error).message).toEqual("boom")
  })

  it("lets running siblings finish before compensating them", async () => {
    const compensated: string[] = []
    engine.register(
      defineWorkflow({
        id: "sibling-failure",
        steps: [
          { id: "root", invoke: async () => "root" },
          {
            id: "slow",
            dependsOn: ["root"],
            invoke: async () => {
              await wait(20)
              return "slow"
            },
            compensate: async () => {
              compensated.push("slow")
            },
          },
          {
            id: "fail",
            dependsOn: ["root"],
            invoke: async () => {
              throw new Error("fail")
            },
          },
          {
            id: "never",
            dependsOn: ["slow", "fail"],
            invoke: async () => "never",
          },
        ],
      })
    )

    const handle = await engine.start({ workflowId: "sibling-failure" })

    expect(handle.status).toEqual("compensated")
    expect(compensated).toEqual(["slow"])
    expect(handle.run.steps!.find((s) => s.stepId === "never")!.status).toEqual(
      "pending"
    )
  })

  it("ends failed when a compensation fails", async () => {
    engine.register(
      defineWorkflow({
        id: "compensation-fails",
        steps: [
          {
            id: "a",
            invoke: async () => "a",
            compensate: async () => {
              throw new Error("cannot undo")
            },
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

    const handle = await engine.start({ workflowId: "compensation-fails" })

    expect(handle.status).toEqual("failed")
    expect(handle.errors.map((e) => [e.stepId, e.action])).toEqual([
      ["b", "invoke"],
      ["a", "compensate"],
    ])
  })

  it("continues past a failed step with continueOnPermanentFailure", async () => {
    engine.register(
      defineWorkflow({
        id: "continue",
        steps: [
          {
            id: "a",
            invoke: async () => {
              throw new Error("ignored")
            },
            options: { continueOnPermanentFailure: true },
          },
          { id: "b", invoke: async () => "b" },
        ],
        result: (ctx) => ctx.results.get("b"),
      })
    )

    const handle = await engine.start({ workflowId: "continue" })

    expect(handle.status).toEqual("succeeded")
    expect(handle.result).toEqual("b")
    expect(handle.run.flags.hasFailedSteps).toBe(true)
  })

  it("skips dependents up to the named step with skipOnPermanentFailure", async () => {
    const ran: string[] = []
    const step = (id: string) => ({
      id,
      invoke: async () => {
        ran.push(id)
        return id
      },
    })

    engine.register(
      defineWorkflow({
        id: "skip-to",
        steps: [
          {
            id: "a",
            invoke: async () => {
              throw new Error("a")
            },
            options: { skipOnPermanentFailure: "d" },
          },
          step("b"),
          step("c"),
          step("d"),
          step("e"),
        ],
      })
    )

    const handle = await engine.start({ workflowId: "skip-to" })

    expect(handle.status).toEqual("succeeded")
    expect(ran).toEqual(["d", "e"])
    const statuses = Object.fromEntries(
      handle.run.steps!.map((s) => [s.stepId, s.status])
    )
    expect(statuses).toEqual({
      a: "failed",
      b: "skipped",
      c: "skipped",
      d: "succeeded",
      e: "succeeded",
    })
    expect(handle.run.flags.hasSkippedOnFailureSteps).toBe(true)
  })

  it("does not stop dependents of a skipped step", async () => {
    engine.register(
      defineWorkflow({
        id: "skip",
        steps: [
          { id: "a", invoke: async () => ({ kind: "skip" }) },
          { id: "b", invoke: async (ctx) => ctx.results.get("a") ?? "none" },
        ],
        result: (ctx) => ctx.results.get("b"),
      })
    )

    const handle = await engine.start({ workflowId: "skip" })

    expect(handle.result).toEqual("none")
    expect(handle.run.flags.hasSkippedSteps).toBe(true)
  })

  it("retries inline up to maxRetries", async () => {
    let calls = 0
    engine.register(
      defineWorkflow({
        id: "retries",
        steps: [
          {
            id: "a",
            invoke: async (ctx) => {
              calls++
              if (ctx.attempt < 3) {
                throw new Error("again")
              }
              return ctx.attempt
            },
            options: { maxRetries: 2 },
          },
        ],
        result: (ctx) => ctx.results.get("a"),
      })
    )

    const handle = await engine.start({ workflowId: "retries" })

    expect(calls).toEqual(3)
    expect(handle.result).toEqual(3)
  })

  it("does not retry a NonRetryableError and passes its data to compensation", async () => {
    let calls = 0
    let received: unknown
    engine.register(
      defineWorkflow({
        id: "non-retryable",
        steps: [
          {
            id: "a",
            invoke: async () => {
              calls++
              throw new NonRetryableError("stop", { partial: true })
            },
            compensate: async (input) => {
              received = input
            },
            options: { maxRetries: 5 },
          },
        ],
      })
    )

    await engine.start({ workflowId: "non-retryable" })

    expect(calls).toEqual(1)
    expect(received).toEqual({ partial: true })
  })

  it("waits inside start for a retryInterval retry", async () => {
    let calls = 0
    engine.register(
      defineWorkflow({
        id: "retry-interval",
        steps: [
          {
            id: "a",
            invoke: async () => {
              calls++
              if (calls === 1) {
                throw new Error("once")
              }
              return "ok"
            },
            options: { maxRetries: 1, retryIntervalMs: 10 },
          },
        ],
        result: (ctx) => ctx.results.get("a"),
      })
    )

    const handle = await engine.start({ workflowId: "retry-interval" })

    expect(handle.status).toEqual("succeeded")
    expect(handle.result).toEqual("ok")
  })

  it("parks on an async step and continues after completeStep", async () => {
    const events = collectEvents(engine)
    engine.register(
      defineWorkflow({
        id: "async-wait",
        steps: [
          { id: "a", invoke: async () => "a" },
          {
            id: "confirm",
            invoke: async () => ({ kind: "wait" }),
            options: { async: true },
          },
          { id: "c", invoke: async (ctx) => ctx.results.get("confirm") },
        ],
        options: { retentionTimeMs: 60_000 },
        result: (ctx) => ctx.results.get("c"),
      })
    )

    const first = await engine.start({
      workflowId: "async-wait",
      transactionId: "trx-1",
    })
    expect(first.status).toEqual("waiting")

    await expect(
      engine.start({ workflowId: "async-wait", transactionId: "trx-1" })
    ).rejects.toThrow("Transaction already started for transactionId: trx-1")

    const done = await engine.completeStep(
      { workflowId: "async-wait", transactionId: "trx-1", stepId: "confirm" },
      { output: "confirmed" }
    )

    expect(done.status).toEqual("succeeded")
    expect(done.result).toEqual("confirmed")
    expect(events.map((e) => e.name)).toContain("stepWaiting")

    await expect(
      engine.completeStep(
        { workflowId: "async-wait", transactionId: "trx-1", stepId: "confirm" },
        { output: "again" }
      )
    ).rejects.toThrow("Cannot set step success when status is succeeded")
  })

  it("completes an async step in the background when its handler returns", async () => {
    engine.register(
      defineWorkflow({
        id: "background",
        steps: [
          {
            id: "work",
            invoke: async () => {
              await wait(10)
              return "done"
            },
            options: { async: true },
          },
          { id: "after", invoke: async (ctx) => ctx.results.get("work") },
        ],
        result: (ctx) => ctx.results.get("after"),
      })
    )

    const first = await engine.start({ workflowId: "background" })
    expect(first.status).toEqual("waiting")

    const finished = await first.wait()
    expect(finished.status).toEqual("succeeded")
    expect(finished.result).toEqual("done")
  })

  it("applies the failure policy to an async step failed from outside", async () => {
    engine.register(
      defineWorkflow({
        id: "async-fail",
        steps: [
          {
            id: "a",
            invoke: async () => "a",
            compensate: async () => {},
          },
          {
            id: "confirm",
            invoke: async () => ({ kind: "wait" }),
            options: { async: true },
          },
        ],
        options: { retentionTimeMs: 60_000 },
      })
    )

    await engine.start({ workflowId: "async-fail", transactionId: "t" })
    const handle = await engine.failStep(
      { workflowId: "async-fail", transactionId: "t", stepId: "confirm" },
      new Error("rejected")
    )

    expect(handle.status).toEqual("compensated")
  })

  it("cancels a retained, finished run by compensating it", async () => {
    const compensated: string[] = []
    engine.register(
      defineWorkflow({
        id: "cancel-finished",
        steps: [
          {
            id: "a",
            invoke: async () => "a",
            compensate: async () => {
              compensated.push("a")
            },
          },
        ],
        options: { retentionTimeMs: 60_000 },
      })
    )

    await engine.start({ workflowId: "cancel-finished", transactionId: "t" })
    const handle = await engine.cancel({
      workflowId: "cancel-finished",
      transactionId: "t",
    })

    expect(handle.status).toEqual("cancelled")
    expect(compensated).toEqual(["a"])

    await expect(
      engine.cancel({ workflowId: "missing", transactionId: "t" })
    ).rejects.toThrow()
  })

  it("times out a step, discards its result and compensates", async () => {
    const compensated: string[] = []
    engine.register(
      defineWorkflow({
        id: "step-timeout",
        steps: [
          {
            id: "a",
            invoke: async () => "a",
            compensate: async () => {
              compensated.push("a")
            },
          },
          {
            id: "slow",
            invoke: async () => {
              await wait(30)
              return "late"
            },
            options: { timeoutMs: 5 },
          },
        ],
      })
    )

    const handle = await engine.start({ workflowId: "step-timeout" })

    expect(handle.status).toEqual("compensated")
    expect(handle.run.steps!.find((s) => s.stepId === "slow")!.status).toEqual(
      "compensated"
    )
    expect(compensated).toEqual(["a"])
  })

  it("completes a waiting parent step when its child run finishes", async () => {
    engine.register(
      defineWorkflow({
        id: "child",
        steps: [{ id: "child-step", invoke: async () => "from-child" }],
        options: { durability: "full" },
        result: (ctx) => ctx.results.get("child-step"),
      })
    )
    engine.register(
      defineWorkflow({
        id: "parent",
        steps: [
          {
            id: "child-as-step",
            invoke: async (ctx) => {
              await engine.start({
                workflowId: "child",
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
          {
            id: "after",
            invoke: async (ctx) => ctx.results.get("child-as-step"),
          },
        ],
        result: (ctx) => ctx.results.get("after"),
      })
    )

    const handle = await engine.start({ workflowId: "parent" })
    const finished = await handle.wait()

    expect(finished.status).toEqual("succeeded")
    expect(finished.result).toEqual("from-child")
  })

  it("returns the stored result for a finished idempotent run", async () => {
    let calls = 0
    engine.register(
      defineWorkflow({
        id: "idempotent",
        steps: [{ id: "a", invoke: async () => ++calls }],
        options: { idempotent: true, retentionTimeMs: 60_000 },
        result: (ctx) => ctx.results.get("a"),
      })
    )

    const first = await engine.start({
      workflowId: "idempotent",
      transactionId: "t",
    })
    const second = await engine.start({
      workflowId: "idempotent",
      transactionId: "t",
    })

    expect(first.result).toEqual(1)
    expect(second.existing).toBe(true)
    expect(second.result).toEqual(1)
    expect(calls).toEqual(1)
  })

  it("starts a new run for a finished, non-idempotent transaction id", async () => {
    engine.register(
      defineWorkflow({
        id: "rerun",
        steps: [{ id: "a", invoke: async () => "a" }],
        options: { retentionTimeMs: 60_000 },
      })
    )

    const first = await engine.start({
      workflowId: "rerun",
      transactionId: "t",
    })
    const second = await engine.start({
      workflowId: "rerun",
      transactionId: "t",
    })

    expect(second.runId).not.toEqual(first.runId)
  })

  describe("writes per durability", () => {
    const twoSteps = (options = {}) =>
      defineWorkflow({
        id: "two",
        steps: [
          { id: "a", invoke: async () => "a" },
          { id: "b", invoke: async () => "b" },
        ],
        options,
      })

    it("writes nothing for none", async () => {
      const { store, writes } = countingStore()
      const engine = createEngine({ store })
      engine.register(twoSteps())
      await engine.start({ workflowId: "two" })
      expect(writes).toEqual([])
    })

    it("writes twice for summary", async () => {
      const { store, writes } = countingStore()
      const engine = createEngine({ store })
      engine.register(twoSteps({ retentionTimeMs: 1000 }))
      await engine.start({ workflowId: "two" })
      expect(writes).toEqual(["createRun", "commit"])
    })

    it("writes four times for a two-step full run", async () => {
      const { store, writes } = countingStore()
      const engine = createEngine({ store })
      engine.register(twoSteps({ durability: "full", retentionTimeMs: 1000 }))
      await engine.start({ workflowId: "two" })
      expect(writes).toEqual(["createRun", "commit", "commit", "commit"])
    })
  })

  it("fences commits after the lease is lost", async () => {
    const store = new MemoryStore()
    const engine = createEngine({ store })
    const created = await store.createRun(
      {
        id: "run",
        workflowId: "w",
        transactionId: "t",
        status: "running",
        durability: "full",
        definitionHash: "h",
        input: {},
        context: {},
        metadata: {},
        errors: [],
        flags: {},
        idempotent: false,
      },
      { unique: true, idempotent: false },
      { owner: "me", ttlMs: 1 }
    )
    await wait(5)
    const other = await store.acquireLease("run", "other", 1000)
    expect(other.ok).toBe(true)

    const changes: RunChanges = { status: "waiting" }
    await expect(
      store.commit((created as { lease: Lease }).lease, changes)
    ).rejects.toThrow("Lease lost")
    await engine.shutdown()
  })
})

describe("Executor scheduling and writes", () => {
  function recordingStore() {
    const store = new MemoryStore()
    const commits: RunChanges[] = []
    const commit = store.commit.bind(store)
    store.commit = async (lease, changes) => {
      commits.push(changes)
      return commit(lease, changes)
    }
    return { store, commits }
  }

  it("launches steps that become ready together in declaration order, past skipped branches", async () => {
    const engine = createEngine()
    const events = collectEvents(engine)
    engine.register(
      defineWorkflow({
        id: "branches",
        steps: [
          { id: "root", invoke: async () => "root" },
          { id: "c", dependsOn: ["root"], invoke: async () => "c" },
          {
            id: "skipped",
            dependsOn: ["root"],
            invoke: async () => ({ kind: "skip" }),
          },
          { id: "a", dependsOn: ["root"], invoke: async () => "a" },
          {
            id: "after-skipped",
            dependsOn: ["skipped"],
            invoke: async () => "after-skipped",
          },
          {
            id: "join",
            dependsOn: ["c", "a", "after-skipped"],
            invoke: async (ctx) => [
              ctx.results.get("c"),
              ctx.results.get("a"),
              ctx.results.get("after-skipped"),
            ],
          },
        ],
        result: (ctx) => ctx.results.get("join"),
      })
    )

    const handle = await engine.start({ workflowId: "branches" })

    const started = events
      .filter((event) => event.name === "stepStarted")
      .map((event) => event.stepId)
    expect(started.slice(0, 4)).toEqual(["root", "c", "skipped", "a"])
    expect(started.indexOf("after-skipped")).toBeGreaterThan(
      started.indexOf("skipped")
    )
    expect(started[started.length - 1]).toEqual("join")
    expect(handle.status).toEqual("succeeded")
    expect(handle.result).toEqual(["c", "a", "after-skipped"])
    await engine.shutdown()
  })

  it("does not launch a dependent of a skipped step before its other dependencies resolve", async () => {
    const engine = createEngine()
    let release!: () => void
    const gate = new Promise<void>((resolve) => (release = resolve))
    const ran: string[] = []
    engine.register(
      defineWorkflow({
        id: "skip-join",
        steps: [
          {
            id: "skipped",
            dependsOn: [],
            invoke: async () => ({ kind: "skip" }),
          },
          {
            id: "slow",
            dependsOn: [],
            invoke: async () => {
              await gate
              ran.push("slow")
              return "slow"
            },
          },
          {
            id: "join",
            dependsOn: ["skipped", "slow"],
            invoke: async () => {
              ran.push("join")
            },
          },
        ],
      })
    )

    const running = engine.start({ workflowId: "skip-join" })
    await wait(5)
    expect(ran).toEqual([])
    release()
    const handle = await running

    expect(ran).toEqual(["slow", "join"])
    expect(handle.status).toEqual("succeeded")
    await engine.shutdown()
  })

  it("only writes the run's errors when they changed", async () => {
    const { store, commits } = recordingStore()
    const engine = createEngine({ store })
    engine.register(
      defineWorkflow({
        id: "errors-once",
        steps: [
          { id: "a", invoke: async () => "a" },
          {
            id: "b",
            invoke: async () => {
              throw new Error("boom")
            },
            options: { continueOnPermanentFailure: true },
          },
          { id: "c", invoke: async () => "c" },
        ],
        options: { durability: "full", retentionTimeMs: 1000 },
      })
    )

    const handle = await engine.start({ workflowId: "errors-once" })

    expect(handle.status).toEqual("succeeded")
    const progress = commits.filter((changes) => !changes.finished)
    expect(progress.map((changes) => "errors" in changes)).toEqual([
      false,
      true,
      false,
    ])
    expect(progress[1].errors).toEqual([
      expect.objectContaining({ stepId: "b", action: "invoke" }),
    ])
    const final = commits.find((changes) => changes.finished)!
    expect(final.errors).toHaveLength(1)
    await engine.shutdown()
  })

  it("writes async steps that become ready together in one commit before their handlers start", async () => {
    const { store, commits } = recordingStore()
    const engine = createEngine({ store })
    const seen: Record<string, number> = {}
    const asyncStep = (id: string) => ({
      id,
      dependsOn: ["root"],
      invoke: async () => {
        seen[id] = commits.length
        return { kind: "wait" as const }
      },
      options: { async: true },
    })
    engine.register(
      defineWorkflow({
        id: "async-batch",
        steps: [
          { id: "root", invoke: async () => "root" },
          asyncStep("a"),
          asyncStep("b"),
        ],
        options: { retentionTimeMs: 1000 },
      })
    )

    const handle = await engine.start({ workflowId: "async-batch" })
    await wait(5)

    expect(handle.status).toEqual("waiting")
    const launch = commits.findIndex((changes) =>
      (changes.steps ?? []).some((step) => step.status === "waiting")
    )
    expect(
      commits[launch].steps!.map((step) => [step.stepId, step.status])
    ).toEqual([
      ["a", "waiting"],
      ["b", "waiting"],
    ])
    expect(seen).toEqual({ a: launch + 1, b: launch + 1 })
    await engine.shutdown()
  })
})
