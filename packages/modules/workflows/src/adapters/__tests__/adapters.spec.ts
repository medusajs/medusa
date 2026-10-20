import { MedusaContextType, TransactionState } from "@medusajs/framework/utils"
import type { RunHandle, RunRecord } from "@medusajs/workflow-engine"
import { LegacyTransactionView } from "../../legacy/transaction-view"
import { toRunOptions } from "../run-options"
import { toLegacyRunState, toLegacyStepStatus } from "../state"
import { toLegacyEventName } from "../../legacy/transaction-view"
import { toWorkflowResult } from "../workflow-result"

const run = (overrides: Partial<RunRecord> = {}): RunRecord => ({
  id: "run_1",
  workflowId: "wf",
  transactionId: "trx",
  status: "succeeded",
  durability: "none",
  definitionHash: "hash",
  input: { a: 1 },
  context: { eventGroupId: "group" },
  metadata: {},
  errors: [],
  flags: {},
  idempotent: false,
  createdAt: new Date(0),
  updatedAt: new Date(0),
  steps: [
    {
      stepId: "s1",
      status: "succeeded",
      attempt: 1,
      output: "out",
      compensateInput: "comp",
    },
  ],
  ...overrides,
})

const handle = (
  record: RunRecord,
  extra: Partial<RunHandle> = {}
): RunHandle => ({
  runId: record.id,
  workflowId: record.workflowId,
  transactionId: record.transactionId,
  status: record.status,
  finished: true,
  run: record,
  result: "result",
  errors: [],
  wait: async () => handle(record),
  ...extra,
})

describe("state mapping", () => {
  it.each([
    ["pending", TransactionState.NOT_STARTED],
    ["running", TransactionState.INVOKING],
    ["waiting", TransactionState.INVOKING],
    ["compensating", TransactionState.COMPENSATING],
    ["succeeded", TransactionState.DONE],
    ["compensated", TransactionState.REVERTED],
    ["cancelled", TransactionState.REVERTED],
    ["failed", TransactionState.FAILED],
  ] as const)("maps run status %s to %s", (status, state) => {
    expect(toLegacyRunState(status)).toEqual(state)
  })

  it("names legacy step statuses in completion errors", () => {
    expect(toLegacyStepStatus("succeeded")).toEqual("ok")
    expect(toLegacyStepStatus("pending")).toEqual("idle")
    expect(toLegacyStepStatus("compensated")).toEqual("ok")
  })
})

describe("LegacyTransactionView", () => {
  it("builds the legacy context and flow", () => {
    const transaction = new LegacyTransactionView(run())

    expect(transaction.getState()).toEqual("done")
    expect(transaction.hasFinished()).toBe(true)
    expect(transaction.getContext()).toEqual({
      payload: { a: 1 },
      invoke: {
        s1: {
          __type: "Symbol(WorkflowWorkflowData)",
          output: {
            __type: "Symbol(WorkflowStepResponse)",
            output: "out",
            compensateInput: "comp",
          },
        },
      },
      compensate: {},
    })
    expect(Object.keys(transaction.getFlow().steps)).toEqual(["_root.s1"])
    expect(transaction.getFlow().metadata.eventGroupId).toEqual("group")
  })

  it("keeps only the run record when serialized", () => {
    const json = JSON.parse(JSON.stringify(new LegacyTransactionView(run())))
    expect(json.snapshot.id).toEqual("run_1")
  })
})

describe("toRunOptions", () => {
  it("defaults to an auto transaction id and a new root event group", () => {
    const options = toRunOptions({ input: 1 })

    expect(options.transactionId).toMatch(/^auto-/)
    expect(options.unique).toBe(false)
    expect(options.context.eventGroupId).toBeTruthy()
    expect(options.context.preventReleaseEvents).toBe(false)
    expect(options.context.__type).toEqual(MedusaContextType)
  })

  it("starts a new event group when the caller's group is not passed", () => {
    const options = toRunOptions(
      { transactionId: "manual" },
      { eventGroupId: "parent-group" }
    )

    expect(options.unique).toBe(true)
    expect(options.context.eventGroupId).not.toEqual("parent-group")
    expect(options.context.preventReleaseEvents).toBe(false)
  })

  it("joins the caller's event group when it is passed", () => {
    const options = toRunOptions(
      { context: { eventGroupId: "parent-group" } },
      { eventGroupId: "parent-group" }
    )

    expect(options.context.eventGroupId).toEqual("parent-group")
    expect(options.context.preventReleaseEvents).toBe(true)
  })

  it("joins the caller's event group when asked not to release", () => {
    const options = toRunOptions(
      { context: { preventReleaseEvents: true } },
      { eventGroupId: "parent-group" }
    )

    expect(options.context.eventGroupId).toEqual("parent-group")
    expect(options.context.preventReleaseEvents).toBe(true)
  })

  it("drops managers from the caller's context", () => {
    const options = toRunOptions({}, {
      manager: {},
      transactionManager: {},
    } as any)
    expect(options.context.manager).toBeUndefined()
    expect(options.context.transactionManager).toBeUndefined()
  })
})

describe("toWorkflowResult", () => {
  const failed = run({
    status: "compensated",
    errors: [{ stepId: "s1", action: "invoke", error: { message: "boom" } }],
  })
  const cause = new Error("boom")
  const failedHandle = () =>
    handle(failed, {
      errors: [
        { stepId: "s1", action: "invoke", error: { message: "boom" }, cause },
      ],
    })

  it("throws the first invoke error of a failed run", () => {
    expect(() =>
      toWorkflowResult(failedHandle(), { operation: "run", throwOnError: true })
    ).toThrow(cause)
  })

  it("returns errors without throwing when asked", () => {
    const result = toWorkflowResult(failedHandle(), {
      operation: "run",
      throwOnError: false,
    })
    expect(result.errors).toEqual([
      { action: "s1", handlerType: "invoke", error: cause },
    ])
    expect(result.acknowledgement.hasFailed).toBe(true)
  })

  it("does not throw for a cancel that reverted", () => {
    expect(() =>
      toWorkflowResult(failedHandle(), {
        operation: "cancel",
        throwOnError: true,
      })
    ).not.toThrow()
  })

  it("throws the compensation error of a cancel that failed", () => {
    const compensateCause = new Error("compensation boom")
    const cancelFailed = run({
      status: "failed",
      errors: [
        {
          stepId: "s1",
          action: "compensate",
          error: { message: "compensation boom" },
        },
      ],
    })
    const cancelHandle = handle(cancelFailed, {
      errors: [
        {
          stepId: "s1",
          action: "compensate",
          error: { message: "compensation boom" },
          cause: compensateCause,
        },
      ],
    })

    expect(() =>
      toWorkflowResult(cancelHandle, {
        operation: "cancel",
        throwOnError: true,
      })
    ).toThrow(compensateCause)

    const result = toWorkflowResult(cancelHandle, {
      operation: "cancel",
      throwOnError: false,
    })
    expect(result.errors).toEqual([
      { action: "s1", handlerType: "compensate", error: compensateCause },
    ])
    expect(result.acknowledgement.hasFailed).toBe(true)
  })
})

describe("subscriber event names", () => {
  it.each([
    ["runStarted", "onBegin"],
    ["stepSucceeded", "onStepSuccess"],
    ["stepSkipped", "onStepSkipped"],
    ["stepCompensationFailed", "onCompensateStepFailure"],
    ["runFinished", "onFinish"],
  ] as const)("maps %s to %s", (name, legacy) => {
    expect(toLegacyEventName(name)).toEqual(legacy)
  })
})
