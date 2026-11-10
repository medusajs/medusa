import { MedusaError } from "@medusajs/framework/utils"
import { toOrder, toPage, toRunFilter } from "../execution-dto"

const invalidData = expect.objectContaining({
  type: MedusaError.Types.INVALID_DATA,
})

describe("toRunFilter", () => {
  it("maps ids, workflow and transaction ids", () => {
    expect(
      toRunFilter({
        id: "run_1",
        workflow_id: ["wf"],
        transaction_id: { $in: ["a", "b"] },
        q: "search",
      })
    ).toEqual({
      ids: ["run_1"],
      workflowId: ["wf"],
      transactionId: ["a", "b"],
      q: "search",
    })
  })

  it("maps run_id to the run's id", () => {
    expect(toRunFilter({ run_id: ["run_1", "run_2"] } as any)).toEqual({
      ids: ["run_1", "run_2"],
    })
  })

  it("matches both id and run_id when both are given", () => {
    expect(
      toRunFilter({ id: ["run_1", "run_2"], run_id: "run_2" } as any)
    ).toEqual({ ids: ["run_2"] })
  })

  it("maps legacy states to run statuses", () => {
    expect(toRunFilter({ state: "invoking" })).toEqual({
      status: ["running", "waiting"],
    })
    expect(toRunFilter({ state: ["done", "reverted"] })).toEqual({
      status: ["succeeded", "compensated", "cancelled"],
    })
  })

  it("combines $eq with $in and $ne with $nin instead of overwriting", () => {
    expect(
      toRunFilter({
        state: { $in: ["done", "failed"], $eq: "done" },
      } as any)
    ).toEqual({ status: ["succeeded"] })

    expect(
      toRunFilter({
        state: { $nin: ["done"], $ne: "failed" },
      } as any)
    ).toEqual({ statusNot: ["succeeded", "failed"] })
  })

  it("maps created_at ranges", () => {
    expect(
      toRunFilter({
        created_at: { $gte: "2026-01-01", $lt: "2026-02-01" },
      } as any)
    ).toEqual({
      createdAfter: new Date("2026-01-01"),
      createdBefore: new Date("2026-02-01"),
    })
  })

  it("ignores undefined filters", () => {
    expect(toRunFilter({ id: undefined, q: undefined })).toEqual({})
  })

  it("rejects filters it cannot apply", () => {
    expect(() => toRunFilter({ updated_at: { $gt: "x" } } as any)).toThrow(
      invalidData
    )
    expect(() => toRunFilter({ context: {} } as any)).toThrow(invalidData)
    expect(() => toRunFilter({ $or: [] } as any)).toThrow(invalidData)
    expect(() => toRunFilter({ id: { $like: "x" } } as any)).toThrow(
      invalidData
    )
    expect(() => toRunFilter({ created_at: { $ne: "x" } } as any)).toThrow(
      invalidData
    )
  })
})

describe("toPage", () => {
  it("defaults to newest first with steps", () => {
    expect(toPage()).toEqual({
      limit: undefined,
      offset: undefined,
      order: "desc",
      withSteps: true,
    })
  })

  it("maps pagination and direction", () => {
    expect(
      toPage({ take: 10, skip: 20, order: { created_at: "ASC" } })
    ).toEqual(expect.objectContaining({ limit: 10, offset: 20, order: "asc" }))
  })

  it("loads steps only when a field built from them is selected", () => {
    expect(toPage({ select: ["id", "state"] }).withSteps).toBe(false)
    expect(toPage({ select: ["id", "execution"] }).withSteps).toBe(true)
    expect(toPage({ select: ["context.data"] } as any).withSteps).toBe(true)
    expect(toPage({ select: ["*"] } as any).withSteps).toBe(true)
  })

  it("rejects order fields it cannot apply", () => {
    expect(() => toPage({ order: { state: "ASC" } } as any)).toThrow(
      invalidData
    )
  })
})

describe("toOrder", () => {
  it("orders by updated_at when asked", () => {
    expect(toOrder({ order: { updated_at: "ASC" } } as any)).toEqual({
      field: "updated_at",
      direction: "asc",
    })
  })

  it("orders by id like created_at", () => {
    expect(toOrder({ order: { id: "DESC" } } as any)).toEqual({
      field: "created_at",
      direction: "desc",
    })
  })

  it("rejects ordering by more than one field", () => {
    expect(() =>
      toOrder({ order: { created_at: "ASC", updated_at: "DESC" } } as any)
    ).toThrow(invalidData)
  })
})
