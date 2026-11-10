import { IEventBusModuleService } from "@medusajs/types"
import {
  EventGroupRouter,
  GROUPED_EVENT_BUS_TARGET,
  SET_EVENT_GROUP_ROUTER,
  withEventGrouping,
} from "../grouping-event-bus"

const message = (name: string, eventGroupId?: string) => ({
  name,
  data: {},
  metadata: eventGroupId ? { eventGroupId } : {},
})

describe("withEventGrouping", () => {
  let bus: jest.Mocked<
    Pick<
      IEventBusModuleService,
      "emit" | "releaseGroupedEvents" | "clearGroupedEvents"
    >
  >
  let router: jest.Mocked<EventGroupRouter>
  let wrapped: IEventBusModuleService

  beforeEach(() => {
    bus = {
      emit: jest.fn(),
      releaseGroupedEvents: jest.fn(),
      clearGroupedEvents: jest.fn(),
    }
    router = {
      owns: jest.fn((id) => id === "owned"),
      stage: jest.fn(),
      release: jest.fn(),
      discard: jest.fn(),
    }
    wrapped = withEventGrouping(bus as unknown as IEventBusModuleService)
  })

  const setRouter = (next?: EventGroupRouter) =>
    (wrapped as any)[SET_EVENT_GROUP_ROUTER](next)

  it("passes everything through until a router is set", async () => {
    await wrapped.emit(message("a", "owned"), { delay: 1 } as any)
    await wrapped.releaseGroupedEvents("owned")

    expect(bus.emit).toHaveBeenCalledWith(message("a", "owned"), { delay: 1 })
    expect(bus.releaseGroupedEvents).toHaveBeenCalledWith("owned")
  })

  it("stages messages of owned groups and passes the rest through", async () => {
    setRouter(router)

    await wrapped.emit([
      message("a", "owned"),
      message("b", "other"),
      message("c"),
      message("d", "owned"),
    ])

    expect(router.stage).toHaveBeenCalledTimes(1)
    expect(router.stage).toHaveBeenCalledWith("owned", [
      message("a", "owned"),
      message("d", "owned"),
    ])
    expect(bus.emit).toHaveBeenCalledWith(
      [message("b", "other"), message("c")],
      {}
    )
  })

  it("keeps a single message a single message when passing it through", async () => {
    setRouter(router)

    await wrapped.emit(message("b", "other"))

    expect(bus.emit).toHaveBeenCalledWith(message("b", "other"), {})
  })

  it("does not call the bus when every message is staged", async () => {
    setRouter(router)

    await wrapped.emit(message("a", "owned"))

    expect(bus.emit).not.toHaveBeenCalled()
  })

  it("routes release and clear of owned groups to the router", async () => {
    setRouter(router)

    await wrapped.releaseGroupedEvents("owned")
    await wrapped.clearGroupedEvents("owned", { eventNames: ["a"] })
    await wrapped.releaseGroupedEvents("other")
    await wrapped.clearGroupedEvents("other")

    expect(router.release).toHaveBeenCalledWith("owned")
    expect(router.discard).toHaveBeenCalledWith("owned", { eventNames: ["a"] })
    expect(bus.releaseGroupedEvents).toHaveBeenCalledWith("other")
    expect(bus.clearGroupedEvents).toHaveBeenCalledWith("other", undefined)
  })

  it("keeps the emit options on staged messages", async () => {
    setRouter(router)

    await wrapped.emit(
      [
        message("a", "owned"),
        { ...message("b", "owned"), options: { attempts: 5 } },
      ],
      { attempts: 3, delay: 10, groupedEventsTTL: 60 } as any
    )

    expect(router.stage).toHaveBeenCalledWith("owned", [
      { ...message("a", "owned"), options: { attempts: 3, delay: 10 } },
      { ...message("b", "owned"), options: { attempts: 5, delay: 10 } },
    ])
  })

  it("exposes the wrapped bus", () => {
    expect((wrapped as any)[GROUPED_EVENT_BUS_TARGET]).toBe(bus)
  })

  it("returns the same bound method on every access", () => {
    const withMethod = withEventGrouping({
      ...bus,
      subscribe() {
        return this
      },
    } as unknown as IEventBusModuleService)

    expect(withMethod.subscribe).toBe(withMethod.subscribe)
  })

  it("goes back to the bus when the router is removed", async () => {
    setRouter(router)
    setRouter(undefined)

    await wrapped.emit(message("a", "owned"))

    expect(router.stage).not.toHaveBeenCalled()
    expect(bus.emit).toHaveBeenCalled()
  })

  it("lets a spy replace emit without calling itself", async () => {
    setRouter(router)
    const spy = jest.spyOn(wrapped, "emit")

    await wrapped.emit(message("b", "other"))

    expect(spy).toHaveBeenCalledTimes(1)
    expect(bus.emit).toHaveBeenCalledWith(message("b", "other"), {})
    spy.mockRestore()
  })
})
