import { WorkflowRegistry } from "../definition/registry"
import { handleTimer, TimerHandlerDeps } from "../engine/timer-handler"
import type { Executor } from "../runtime/executor"
import { MemoryStore } from "../store/memory/memory-store"
import { TimerRecord } from "../store/store"
import { FakeClock } from "../testing"

function setup(active?: Partial<Executor>) {
  const clock = new FakeClock()
  const store = new MemoryStore({ clock })
  const continueRun = jest.fn(async () => ({ outcome: "done" as const }))
  const deps: TimerHandlerDeps = {
    store,
    clock,
    owner: "me",
    leaseTtlMs: 1000,
    runTimeoutTakeoverMs: 60_000,
    registry: new WorkflowRegistry(),
    activeExecutor: () => active as Executor | undefined,
    continueRun,
  }
  return { clock, store, deps, continueRun }
}

const timer = (overrides: Partial<TimerRecord>): TimerRecord => ({
  id: "t",
  kind: "resume",
  runId: "run",
  workflowId: "wf",
  definitionHash: "hash",
  dueAt: new Date(0),
  generation: 1,
  ...overrides,
})

describe("handleTimer", () => {
  it("defers a run timeout while the active executor parks", async () => {
    const requestTimeout = jest.fn()
    const { store, deps } = setup({ parking: true, requestTimeout })
    const defer = jest.spyOn(store, "deferTimer")
    const complete = jest.spyOn(store, "completeTimer")

    await handleTimer(
      deps,
      timer({ id: "run_timeout:run", kind: "run_timeout" })
    )

    expect(requestTimeout).not.toHaveBeenCalled()
    expect(defer).toHaveBeenCalledWith("run_timeout:run", 1, 50)
    expect(complete).not.toHaveBeenCalled()
  })

  it("tells a running executor that its run timed out", async () => {
    const requestTimeout = jest.fn()
    const { store, deps } = setup({ parking: false, requestTimeout })
    const complete = jest.spyOn(store, "completeTimer")

    await handleTimer(
      deps,
      timer({ id: "run_timeout:run", kind: "run_timeout" })
    )

    expect(requestTimeout).toHaveBeenCalled()
    expect(complete).toHaveBeenCalledWith("run_timeout:run", 1)
  })

  it("continues the run for a resume timer", async () => {
    const { deps, continueRun } = setup()

    await handleTimer(deps, timer({ kind: "resume" }))

    expect(continueRun).toHaveBeenCalledWith("run")
  })

  it("rejects a timer of an unknown kind instead of resuming", async () => {
    const { deps, continueRun } = setup()

    await expect(
      handleTimer(deps, timer({ kind: "bogus" as TimerRecord["kind"] }))
    ).rejects.toThrow('Unknown timer kind "bogus"')
    expect(continueRun).not.toHaveBeenCalled()
  })
})
