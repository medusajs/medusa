import NotificationService from "../notification"
import { IdMap, MockManager, MockRepository } from "medusa-test-utils"

describe("NotificationService", () => {
  describe("send", () => {
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

    const notificationService = new NotificationService(container)

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully calls provider and saves noti", async () => {
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
})
