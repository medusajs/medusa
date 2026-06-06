import { EventBusTypes } from "@zjedene-medusa/types"
import { AbstractEventBusModuleService } from ".."

class MockEventBusModuleService extends AbstractEventBusModuleService {
  constructor() {
    super({}, {}, {} as any)
  }

  async emit<T>(
    data: EventBusTypes.Message<T> | EventBusTypes.Message<T>[],
    options: Record<string, unknown>
  ): Promise<void> {
    return Promise.resolve()
  }

  async releaseGroupedEvents(eventGroupId: string): Promise<void> {
    return Promise.resolve()
  }

  async clearGroupedEvents(eventGroupId: string): Promise<void> {
    return Promise.resolve()
  }
}

describe("AbstractEventBusModuleService", () => {
  it("should be able to subscribe to an event", () => {
    const eventBus = new MockEventBusModuleService()
    const subscriber = jest.fn()
    eventBus.subscribe("test", subscriber)
    expect(eventBus.eventToSubscribersMap.get("test")).toEqual([
      { id: (subscriber as any).subscriberId, subscriber },
    ])
  })

  it("should throw an error if a subscriber with the same id is already subscribed to an event", () => {
    const eventBus = new MockEventBusModuleService()
    const subscriber = jest.fn()
    const subscriberId = "test"
    eventBus.subscribe("test", subscriber, { subscriberId })
    expect(() =>
      eventBus.subscribe("test", subscriber, { subscriberId })
    ).toThrow()
  })

  it("should be able to unsubscribe from an event", () => {
    const eventBus = new MockEventBusModuleService()
    const subscriber = jest.fn()
    eventBus.subscribe("test", subscriber)
    eventBus.unsubscribe("test", subscriber)
    expect(eventBus.eventToSubscribersMap.get("test")).toEqual([])
  })
})
