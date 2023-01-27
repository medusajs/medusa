import { EntityManager } from "typeorm"
import { AbstractEventBusModuleService } from "../services/event-bus"

class EventBus extends AbstractEventBusModuleService {
  protected manager_!: EntityManager
  protected transactionManager_!: EntityManager

  constructor(protected readonly container) {
    super()
    this.container = container
  }

  async emit(eventName: string): Promise<void> {
    console.log(
      `[${eventName}] Local Event Bus installed. Emitting events has no effect.`
    )
  }
}

describe("AbstractEventBusService", () => {
  let eventBus

  describe("subscribe", () => {
    beforeAll(() => {
      jest.resetAllMocks()
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
      jest.resetAllMocks()
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
