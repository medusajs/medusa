import { AuditLogDTO } from "@medusajs/framework/types"
import { selectColumns, toRow } from "../query"

describe("toRow", () => {
  it("serializes the json columns and keeps the others as they are", () => {
    const startedAt = new Date()
    const row = toRow({
      id: "audlog_1",
      started_at: startedAt,
      ended_at: startedAt,
      actor_type: "system",
      actor_id: null,
      impersonator_id: null,
      action: "a",
      resource_type: null,
      resource_id: null,
      outcome: "succeeded",
      request: null,
      request_data: { ids: ["a", "b"] },
      response_data: null,
      metadata: { nested: { ok: true } },
    } as AuditLogDTO)

    expect(row.started_at).toBe(startedAt)
    expect(row.request).toBeNull()
    expect(row.request_data).toBe('{"ids":["a","b"]}')
    expect(row.metadata).toBe('{"nested":{"ok":true}}')
  })
})

describe("selectColumns", () => {
  it("selects every column by default", () => {
    expect(selectColumns({})).toContain("metadata")
  })

  it("always keeps the id and ignores unknown columns", () => {
    expect(selectColumns({ select: ["action", "nope" as any] })).toEqual([
      "id",
      "action",
    ])
  })
})
