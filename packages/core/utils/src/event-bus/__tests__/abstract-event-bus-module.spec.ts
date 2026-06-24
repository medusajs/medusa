import { EventBusTypes } from "@medusajs/types"
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

  public testWithCreatedAtMetadata(metadata?: EventBusTypes.EventMetadata) {
    return this.withCreatedAtMetadata(metadata)
  }

  public testWithPublishedAtMetadata(metadata?: EventBusTypes.EventMetadata) {
    return this.withPublishedAtMetadata(metadata)
  }

  public testParseEventMetadataDates(metadata?: EventBusTypes.EventMetadata) {
    return this.parseEventMetadataDates(metadata)
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

  describe("event metadata timestamps", () => {
    it("should add created_at to metadata", () => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date("2026-06-20T10:00:00.000Z"))

      const eventBus = new MockEventBusModuleService()
      const metadata = eventBus.testWithCreatedAtMetadata({
        source: "test",
      })

      expect(metadata).toEqual({
        source: "test",
        created_at: new Date("2026-06-20T10:00:00.000Z"),
      })
      expect(metadata.published_at).toBeUndefined()

      jest.useRealTimers()
    })

    it("should add published_at to metadata", () => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date("2026-06-20T11:00:00.000Z"))

      const eventBus = new MockEventBusModuleService()
      const metadata = eventBus.testWithPublishedAtMetadata({
        created_at: new Date("2026-06-20T10:00:00.000Z"),
      })

      expect(metadata.created_at).toEqual(new Date("2026-06-20T10:00:00.000Z"))
      expect(metadata.published_at).toEqual(
        new Date("2026-06-20T11:00:00.000Z")
      )

      jest.useRealTimers()
    })

    it("should parse serialized metadata dates", () => {
      const eventBus = new MockEventBusModuleService()
      const metadata = eventBus.testParseEventMetadataDates({
        created_at: "2026-06-20T10:00:00.000Z" as unknown as Date,
        published_at: "2026-06-20T11:00:00.000Z" as unknown as Date,
      })

      expect(metadata?.created_at).toEqual(new Date("2026-06-20T10:00:00.000Z"))
      expect(metadata?.published_at).toEqual(
        new Date("2026-06-20T11:00:00.000Z")
      )
    })
  })
})
