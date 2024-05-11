import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateNotificationDTO,
  INotificationModuleService,
  Logger,
} from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    describe("Notification module", () => {
      let service: INotificationModuleService
      let logger: Logger

      beforeAll(async () => {
        service = getContainer().resolve(ModuleRegistrationName.NOTIFICATION)
        logger = getContainer().resolve(ContainerRegistrationKeys.LOGGER)
      })

      afterEach(() => {
        jest.restoreAllMocks()
      })

      it("should successfully send a notification for an available channel", async () => {
        const logSpy = jest.spyOn(logger, "info")
        const notification = {
          to: "test@medusajs.com",
          channel: "email",
          template: "order-created",
          data: { username: "john-doe" },
          trigger_type: "order-created",
          resource_id: "order-id",
          resource_type: "order",
        } as CreateNotificationDTO

        const result = await service.create(notification)
        const fromDB = await service.retrieve(result.id)

        expect(result).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            to: "test@medusajs.com",
            provider_id: "local-notification-provider",
          })
        )

        delete fromDB.original_notification_id
        delete fromDB.external_id
        delete fromDB.receiver_id
        delete (fromDB as any).idempotency_key
        delete (fromDB as any).provider

        expect(result).toEqual(fromDB)
        expect(logSpy).toHaveBeenCalledWith(
          'Attempting to send a notification to: test@medusajs.com on the channel: email with template: order-created and data: {"username":"john-doe"}'
        )
      })

      it("should throw an exception if there is no provider for the channel", async () => {
        const notification = {
          to: "test@medusajs.com",
          channel: "sms",
        } as CreateNotificationDTO

        const error = await service.create(notification).catch((e) => e)
        expect(error.message).toEqual(
          "Could not find a notification provider for channel: sms"
        )
      })

      it("should allow listing all notifications with filters", async () => {
        const notification1 = {
          to: "test@medusajs.com",
          channel: "email",
          template: "order-created",
        } as CreateNotificationDTO

        const notification2 = {
          to: "test@medusajs.com",
          channel: "log",
          template: "product-created",
        } as CreateNotificationDTO

        await service.create([notification1, notification2])

        const notifications = await service.list({ channel: "log" })
        expect(notifications).toHaveLength(1)
        expect(notifications[0]).toEqual(
          expect.objectContaining({
            to: "test@medusajs.com",
            channel: "log",
            template: "product-created",
          })
        )
      })

      it("should allow retrieving a notification", async () => {
        const notification1 = {
          to: "test@medusajs.com",
          channel: "email",
          template: "order-created",
        } as CreateNotificationDTO

        const notification2 = {
          to: "test@medusajs.com",
          channel: "log",
          template: "product-created",
        } as CreateNotificationDTO

        const [first] = await service.create([notification1, notification2])

        const notification = await service.retrieve(first.id)
        expect(notification).toEqual(
          expect.objectContaining({
            to: "test@medusajs.com",
            channel: "email",
            template: "order-created",
          })
        )
      })
    })
  },
})
