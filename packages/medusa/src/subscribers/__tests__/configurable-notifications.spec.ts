import configurableNotifications, { config } from "../configurable-notifications"

jest.mock("@medusajs/framework/utils", () => ({
  ContainerRegistrationKeys: { LOGGER: "logger", QUERY: "query" },
  Modules: { NOTIFICATION: "notification" },
  OrderWorkflowEvents: { PLACED: "order.placed" },
  pickValueFromObject: (path: string, obj: any) =>
    path.split(".").reduce<unknown>((o, k) => (o as any)?.[k], obj),
  promiseAll: (promises: Promise<unknown>[]) => Promise.all(promises),
}))
jest.mock("@medusajs/framework/types", () => ({}))

const makeContainer = (overrides: Record<string, unknown> = {}) => {
  const created: unknown[] = []
  const logs: string[] = []

  const query = {
    graph: jest.fn(async () => ({
      data: [{ id: "order_1", email: "customer@example.org" }],
    })),
    ...(overrides.query as object),
  }

  const notificationService = {
    createNotifications: jest.fn(async (data: unknown) => {
      created.push(data)
    }),
  }

  const container = {
    resolve: (key: string) => {
      if (key === "logger") {
        return {
          error: (...args: unknown[]) => logs.push(`error:${JSON.stringify(args)}`),
          warn: (...args: unknown[]) => logs.push(`warn:${JSON.stringify(args)}`),
        }
      }
      if (key === "query") return query
      if (key === "notification") return notificationService
      throw new Error(`unexpected container key: ${key}`)
    },
  }

  return { container, query, notificationService, created, logs }
}

describe("configurable-notifications", () => {
  it("subscribes to order.placed, not the never-emitted order.created", () => {
    // #16555: the order module has no CREATED workflow event, so the old
    // subscription could never fire.
    expect(config.event).toEqual(["order.placed"])
  })

  it("ignores the old never-emitted event name", async () => {
    const { container, notificationService } = makeContainer()

    await configurableNotifications(
      { event: { name: "order.created", data: { id: "order_1" } }, container } as any
    )

    expect(notificationService.createNotifications).not.toHaveBeenCalled()
  })

  it("loads the order behind order.placed and sends to its email", async () => {
    const { container, notificationService, query } = makeContainer()

    await configurableNotifications(
      { event: { name: "order.placed", data: { id: "order_1" } }, container } as any
    )

    // The payload of order.placed only carries { id } — the handler must
    // resolve the resource before reading order.email / order.id paths.
    expect(query.graph).toHaveBeenCalledWith({
      entity: "orders",
      fields: ["id", "email"],
      filters: { id: "order_1" },
    })
    expect(notificationService.createNotifications).toHaveBeenCalledWith({
      template: "order-placed-template",
      channel: "email",
      to: "customer@example.org",
      trigger_type: "order.placed",
      resource_id: "order_1",
      data: { order_id: "order_1" },
    })
  })

  it("skips the notification when the order cannot be loaded", async () => {
    const { container, notificationService, logs } = makeContainer({
      query: {
        graph: jest.fn(async () => ({ data: [] })),
      },
    })

    await configurableNotifications(
      { event: { name: "order.placed", data: { id: "order_gone" } }, container } as any
    )

    expect(notificationService.createNotifications).not.toHaveBeenCalled()
    expect(logs.some((l) => l.startsWith("warn:"))).toBe(true)
  })

  it("skips the notification when loading the order fails, without throwing", async () => {
    const { container, notificationService, logs } = makeContainer({
      query: {
        graph: jest.fn(async () => {
          throw new Error("store offline")
        }),
      },
    })

    await expect(
      configurableNotifications(
        { event: { name: "order.placed", data: { id: "order_1" } }, container } as any
      )
    ).resolves.toBeUndefined()

    expect(notificationService.createNotifications).not.toHaveBeenCalled()
    expect(logs.some((l) => l.startsWith("error:"))).toBe(true)
  })
})
