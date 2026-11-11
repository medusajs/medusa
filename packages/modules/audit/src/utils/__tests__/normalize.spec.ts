import { normalizeAuditLog } from "../normalize"

describe("normalizeAuditLog", () => {
  const now = new Date("2026-11-11T10:00:00.000Z")

  it("fills defaults and generates an audlog id", () => {
    const { entry, error } = normalizeAuditLog(
      { action: "catalog.import" },
      now
    )

    expect(error).toBeUndefined()
    expect(entry).toEqual({
      id: expect.stringMatching(/^audlog_/),
      started_at: now,
      ended_at: now,
      actor_type: "system",
      actor_id: null,
      impersonator_id: null,
      action: "catalog.import",
      resource_type: null,
      resource_id: null,
      outcome: "succeeded",
      request: null,
      request_data: null,
      response_data: null,
      metadata: null,
    })
  })

  it("parses date strings and keeps the given fields", () => {
    const { entry } = normalizeAuditLog(
      {
        action: "POST /admin/orders/:id/cancel",
        actor_type: "user",
        actor_id: "user_1",
        resource_type: "order",
        resource_id: "order_1",
        outcome: "denied",
        started_at: "2026-11-11T09:00:00.000Z",
        ended_at: "2026-11-11T09:00:01.000Z",
        request: {
          method: "POST",
          route: "/admin/orders/:id/cancel",
          path: "/admin/orders/order_1/cancel",
          status_code: 403,
          request_id: "req_1",
          ip_address: "127.0.0.1",
          user_agent: "jest",
        },
        request_data: { no_notification: true },
      },
      now
    )

    expect(entry!.started_at).toEqual(new Date("2026-11-11T09:00:00.000Z"))
    expect(entry!.ended_at).toEqual(new Date("2026-11-11T09:00:01.000Z"))
    expect(entry!.outcome).toBe("denied")
    expect(entry!.request!.status_code).toBe(403)
    expect(entry!.request_data).toEqual({ no_notification: true })
  })

  it("never returns the caller's own date object", () => {
    const startedAt = new Date("2026-11-11T09:00:00.000Z")
    const { entry } = normalizeAuditLog({ action: "a", started_at: startedAt })

    expect(entry!.started_at).toEqual(startedAt)
    expect(entry!.started_at).not.toBe(startedAt)
  })

  it.each([
    [{}, '"action"'],
    [{ action: "  " }, '"action"'],
    [{ action: "a", actor_type: "robot" }, '"actor_type"'],
    [{ action: "a", outcome: "maybe" }, '"outcome"'],
    [{ action: "a", started_at: "not a date" }, '"started_at"'],
    [{ action: "a", ended_at: "not a date" }, '"ended_at"'],
  ])("rejects %j", (input, reason) => {
    const result = normalizeAuditLog(input as any, now)

    expect(result.entry).toBeUndefined()
    expect(result.error).toContain(reason)
  })

  it("rejects input that is not an object", () => {
    expect(normalizeAuditLog(null as any).error).toBeDefined()
    expect(normalizeAuditLog("x" as any).error).toBeDefined()
  })

  it("drops data fields that are not plain objects", () => {
    const { entry } = normalizeAuditLog(
      { action: "a", metadata: ["x"] as any, request_data: "x" as any },
      now
    )

    expect(entry!.metadata).toBeNull()
    expect(entry!.request_data).toBeNull()
  })
})
