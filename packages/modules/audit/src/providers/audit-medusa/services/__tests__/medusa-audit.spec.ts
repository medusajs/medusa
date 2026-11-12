import { AuditLogDTO } from "@medusajs/framework/types"
import { MedusaAuditService } from "../medusa-audit"

const options = {
  api_key: "medusa_key",
  endpoint: "https://audit.medusa.example/",
  environment_handle: "test-env",
}

const record: AuditLogDTO = {
  id: "audlog_1",
  started_at: new Date("2026-11-11T09:00:00.000Z"),
  ended_at: new Date("2026-11-11T09:00:01.000Z"),
  actor_type: "user",
  actor_id: "user_1",
  impersonator_id: null,
  action: "order.cancel",
  resource_type: "order",
  resource_id: "order_1",
  outcome: "succeeded",
  request: null,
  request_data: null,
  response_data: null,
  metadata: null,
}

const wire = (value: AuditLogDTO) => JSON.parse(JSON.stringify(value))

const respond = (status: number, body: unknown) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
})

const createProvider = (...responses: ReturnType<typeof respond>[]) => {
  const fetchImpl = jest.fn()
  for (const response of responses) {
    fetchImpl.mockResolvedValueOnce(response)
  }

  const provider = new MedusaAuditService(undefined, {
    ...options,
    fetch: fetchImpl as unknown as typeof fetch,
  })

  return { provider, fetchImpl }
}

const call = (fetchImpl: jest.Mock, index = 0) => {
  const [url, init] = fetchImpl.mock.calls[index] as [string, RequestInit]
  return {
    url: new URL(url),
    init,
    headers: init.headers as Record<string, string>,
  }
}

describe("MedusaAuditService", () => {
  it("posts a batch to /records with the Cloud auth headers", async () => {
    const { provider, fetchImpl } = createProvider(respond(202, {}))

    await provider.write([record])

    const { url, init, headers } = call(fetchImpl)
    expect(url.toString()).toBe("https://audit.medusa.example/records")
    expect(init.method).toBe("POST")
    expect(headers.Authorization).toBe("Basic medusa_key")
    expect(headers["x-medusa-environment-handle"]).toBe("test-env")
    expect(JSON.parse(init.body as string)).toEqual({
      records: [wire(record)],
    })
  })

  it("lists with filters and pagination in the query and parses dates", async () => {
    const { provider, fetchImpl } = createProvider(
      respond(200, { records: [wire(record)], count: 7 })
    )

    const [records, count] = await provider.listAndCount(
      {
        actor_id: ["user_1", "user_2"],
        outcome: "denied",
        started_at: { $gte: new Date("2026-11-01T00:00:00.000Z") },
        q: "cancel",
      },
      { skip: 20, take: 10, order: { started_at: "ASC" }, select: ["id"] }
    )

    const { url, init } = call(fetchImpl)
    expect(init.method).toBe("GET")
    expect(url.pathname).toBe("/records")
    expect(url.searchParams.getAll("actor_id")).toEqual(["user_1", "user_2"])
    expect(url.searchParams.get("outcome")).toBe("denied")
    expect(url.searchParams.get("started_at[$gte]")).toBe(
      "2026-11-01T00:00:00.000Z"
    )
    expect(url.searchParams.get("q")).toBe("cancel")
    expect(url.searchParams.get("offset")).toBe("20")
    expect(url.searchParams.get("limit")).toBe("10")
    expect(url.searchParams.get("order")).toBe("started_at")
    expect(url.searchParams.get("fields")).toBe("id")

    expect(count).toBe(7)
    expect(records).toEqual([record])
    expect(records[0].started_at).toBeInstanceOf(Date)
  })

  it("sends newest first as -started_at", async () => {
    const { provider, fetchImpl } = createProvider(
      respond(200, { records: [wire(record)] })
    )

    await expect(
      provider.list({}, { order: { started_at: "desc" } })
    ).resolves.toEqual([record])

    expect(call(fetchImpl).url.searchParams.get("order")).toBe("-started_at")
  })

  it("retrieves one record and maps a 404 to null", async () => {
    const { provider, fetchImpl } = createProvider(
      respond(200, { record: wire(record) }),
      respond(404, { type: "not_found", message: "Not found" })
    )

    await expect(provider.retrieve("audlog_1", {})).resolves.toEqual(record)
    await expect(provider.retrieve("audlog_2", {})).resolves.toBeNull()

    expect(call(fetchImpl, 0).url.pathname).toBe("/records/audlog_1")
  })

  it("throws with the status and message for other failures", async () => {
    const { provider } = createProvider(
      respond(503, { type: "unavailable", message: "Try again later" })
    )

    await expect(provider.write([record])).rejects.toThrow(
      "Medusa Cloud audit service answered 503: Try again later"
    )
  })

  it("never sends update or delete requests", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(respond(200, {}))
    const provider = new MedusaAuditService(undefined, {
      ...options,
      fetch: fetchImpl as unknown as typeof fetch,
    })

    await provider.write([record])
    await provider.list({}, {})
    await provider.listAndCount({}, {})
    await provider.retrieve("audlog_1", {})

    const methods = fetchImpl.mock.calls.map(([, init]) => init.method)
    expect(new Set(methods)).toEqual(new Set(["POST", "GET"]))
  })

  it.each(["endpoint", "api_key", "environment_handle"])(
    "requires %s",
    (key) => {
      expect(
        () =>
          new MedusaAuditService(undefined, { ...options, [key]: undefined })
      ).toThrow(`"${key}"`)
    }
  )
})
