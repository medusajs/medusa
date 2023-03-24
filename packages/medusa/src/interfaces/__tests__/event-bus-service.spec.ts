import { EventBusTypes } from "@medusajs/types"
import { EventBusUtils } from "@medusajs/utils"
import { EntityManager } from "typeorm"

class EventBus extends EventBusUtils.AbstractEventBusModuleService {
  protected manager_!: EntityManager

  constructor(protected readonly container) {
    super()
    this.container = container
  }

  async emit<T>(
    eventName: string,
    data: T,
    options: Record<string, unknown>
  ): Promise<void>
  async emit<T>(data: EventBusTypes.EmitData<T>[]): Promise<void>

  async emit<T, TInput extends string | EventBusTypes.EmitData<T>[] = string>(
    eventOrData: TInput,
    data?: T,
    options: Record<string, unknown> = {}
  ): Promise<void> {
    const isBulkEmit = Array.isArray(eventOrData)
    const event = isBulkEmit ? eventOrData[0].eventName : eventOrData

    console.log(
      `[${event}] Local Event Bus installed. Emitting events has no effect.`
    )
  }
}

describe("AbstractEventBusService", () => {
  let eventBus

  describe("subscribe", () => {
    beforeAll(() => {
      jest.clearAllMocks()
    })

    beforeEach(() => {
      eventBus = new EventBus({})
    })

    it("successfully adds subscriber", () => {
      eventBus.subscribe("eventName", () => "test", {
        subscriberId: "my-subscriber",
      })

      expect(eventBus.eventToSubscribersMap_.get("eventName").length).toEqual(1)
    })

    it("successfully adds multiple subscribers with explicit ids", () => {
      eventBus.subscribe("eventName", () => "test", {
        subscriberId: "my-subscriber-1",
      })

      eventBus.subscribe("eventName", () => "test", {
        subscriberId: "my-subscriber-2",
      })

      expect(eventBus.eventToSubscribersMap_.get("eventName").length).toEqual(2)
    })

    it("successfully adds multiple subscribers with generates ids", () => {
      eventBus.subscribe("eventName", () => "test")

      eventBus.subscribe("eventName", () => "test")

      expect(eventBus.eventToSubscribersMap_.get("eventName").length).toEqual(2)
    })

    it("throws when subscriber already exists", async () => {
      expect.assertions(1)

      eventBus.subscribe("eventName", () => "test", {
        subscriberId: "my-subscriber",
      })

      try {
        eventBus.subscribe("eventName", () => "new", {
          subscriberId: "my-subscriber",
        })
      } catch (error) {
        expect(error.message).toBe(
          "Subscriber with id my-subscriber already exists"
        )
      }
    })

    it("throws when subscriber is not a function", async () => {
      expect.assertions(1)

      try {
        eventBus.subscribe("eventName", "definitely-not-a-function")
      } catch (error) {
        expect(error.message).toBe("Subscriber must be a function")
      }
    })
  })

  describe("unsubscribe", () => {
    beforeAll(() => {
      jest.clearAllMocks()
    })

    beforeEach(() => {
      eventBus = new EventBus({})

      eventBus.subscribe("eventName", () => "test", { subscriberId: "test" })
    })

    it("successfully removes subscriber", () => {
      eventBus.unsubscribe("eventName", () => "test", { subscriberId: "test" })

      expect(eventBus.eventToSubscribersMap_.get("eventName").length).toEqual(0)
    })

    it("does nothing if subscriber does not exist", () => {
      eventBus.unsubscribe("eventName", () => "non-existing")

      expect(eventBus.eventToSubscribersMap_.get("eventName").length).toEqual(1)
    })

    it("does nothing if event has no subcribers", () => {
      eventBus.unsubscribe("non-existing", () => "test")

      expect(eventBus.eventToSubscribersMap_.get("eventName").length).toEqual(1)
    })
  })
})
