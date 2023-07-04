import NotificationService from "../notification"
import { MockManager, MockRepository } from "medusa-test-utils"

describe("NotificationService", () => {
  const notificationRepository = MockRepository({ create: c => c })

  const container = {
    manager: MockManager,
    notificationRepository,
    noti_test: {
      sendNotification: jest.fn(() =>
        Promise.resolve({
          to: "test@mail.com",
          data: { id: "something" },
        })
      ),
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("send", () =>{ 

    it("successfully calls provider and saves noti", async () => {
      const notificationService = new NotificationService(container)

      await notificationService.send("event.test", { id: "test" }, "test")

      expect(container.noti_test.sendNotification).toHaveBeenCalledTimes(1)
      expect(container.noti_test.sendNotification).toHaveBeenCalledWith(
        "event.test",
        { id: "test" },
        null
      )

      const constructed = {
        resource_type: "event",
        resource_id: "test",
        customer_id: null,
        to: "test@mail.com",
        data: { id: "something" },
        event_name: "event.test",
        provider_id: "test",
      }

      expect(notificationRepository.create).toHaveBeenCalledTimes(1)
      expect(notificationRepository.create).toHaveBeenCalledWith(constructed)

      expect(notificationRepository.save).toHaveBeenCalledTimes(1)
      expect(notificationRepository.save).toHaveBeenCalledWith(constructed)
    })
  })

  describe("handleEvent", () => {

    it("cancels notification if no_notification is set", async () => {
      const notificationService = new NotificationService(container)
      const event = "event.test"
      notificationService.subscribe(event, "test")

      await notificationService.handleEvent(event, {id: "id",
        return_id: "id",
        no_notification: true})

      expect(container.noti_test.sendNotification).not.toHaveBeenCalled()
    })

    it("if no_notification is not set notification is send", async () => {
      const notificationService = new NotificationService(container)
      const event = "event.test"
      notificationService.subscribe(event, "test")

      await notificationService.handleEvent(event, {id: "id", return_id: "id"})

      expect(container.noti_test.sendNotification).toHaveBeenCalledTimes(1)
    })

  })
})
