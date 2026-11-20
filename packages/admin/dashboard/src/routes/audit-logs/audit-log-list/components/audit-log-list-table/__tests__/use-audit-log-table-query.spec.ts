import { describe, expect, it } from "vitest"

import { buildAuditLogListParams } from "../use-audit-log-table-query"

const LIST_FIELDS =
  "id,started_at,actor_type,actor_id,impersonator_id,action,resource_type,resource_id,outcome"

describe("buildAuditLogListParams", () => {
  it("requests the newest first page with only the list fields by default", () => {
    expect(buildAuditLogListParams({})).toEqual({
      limit: 20,
      offset: 0,
      order: "-started_at",
      q: undefined,
      outcome: undefined,
      actor_type: undefined,
      action: undefined,
      resource_type: undefined,
      started_at: undefined,
      fields: LIST_FIELDS,
    })
  })

  it("never requests the data or metadata fields", () => {
    const { fields } = buildAuditLogListParams({})

    expect(fields).not.toMatch(/request_data|response_data|metadata|request\b/)
  })

  it("sorts oldest first when the order is toggled", () => {
    expect(buildAuditLogListParams({ order: "started_at" }).order).toBe(
      "started_at"
    )
    expect(buildAuditLogListParams({ order: "-started_at" }).order).toBe(
      "-started_at"
    )
  })

  it("falls back to newest first for an unsupported order", () => {
    expect(buildAuditLogListParams({ order: "action" }).order).toBe(
      "-started_at"
    )
  })

  it("maps offset pagination", () => {
    expect(buildAuditLogListParams({ offset: "40" })).toMatchObject({
      limit: 20,
      offset: 40,
    })
    expect(buildAuditLogListParams({ offset: "abc" }).offset).toBe(0)
  })

  it("passes the search and filters from the table's query params", () => {
    const started_at = {
      $gte: "2026-11-01T00:00:00.000Z",
      $lte: "2026-11-19T00:00:00.000Z",
    }

    expect(
      buildAuditLogListParams({
        q: "order_123",
        outcome: JSON.stringify(["denied", "failed"]),
        actor_type: JSON.stringify("user"),
        action: JSON.stringify("order.cancel"),
        resource_type: JSON.stringify("order"),
        started_at: JSON.stringify(started_at),
      })
    ).toMatchObject({
      q: "order_123",
      outcome: ["denied", "failed"],
      actor_type: "user",
      action: "order.cancel",
      resource_type: "order",
      started_at,
    })
  })

  it("omits an empty search", () => {
    expect(buildAuditLogListParams({ q: "" }).q).toBeUndefined()
  })
})
