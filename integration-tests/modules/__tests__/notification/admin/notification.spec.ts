import {
  CreateNotificationDTO,
  IEventBusModuleService,
  INotificationModuleService,
  Logger,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
} from "@medusajs/utils"
import { TestEventUtils, medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Notifications", () => {
      let service: INotificationModuleService
      let logger: Logger

      beforeAll(async () => {
        service = getContainer().resolve(ModuleRegistrationName.NOTIFICATION)
        logger = getContainer().resolve(ContainerRegistrationKeys.LOGGER)
      })

      afterEach(() => {
        jest.restoreAllMocks()
      })

      describe("Notifications module", () => {
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

          const result = await service.createNotifications(notification)
          const fromDB = await service.retrieveNotification(result.id)

          expect(result).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              to: "test@medusajs.com",
              provider_id: "local-notification-provider",
            })
          )

          expect(result).toEqual(
            expect.objectContaining({
              to: "test@medusajs.com",
              channel: "email",
              data: {
                username: "john-doe",
              },
              id: expect.any(String),
              provider_id: "local-notification-provider",
              resource_id: "order-id",
              resource_type: "order",
              template: "order-created",
              trigger_type: "order-created",
            })
          )

          expect(fromDB).toEqual(
            expect.objectContaining({
              to: "test@medusajs.com",
              channel: "email",
              data: {
                username: "john-doe",
              },
              id: expect.any(String),
              provider_id: "local-notification-provider",
              resource_id: "order-id",
              resource_type: "order",
              template: "order-created",
              trigger_type: "order-created",
            })
          )

          expect(logSpy).toHaveBeenCalledWith(
            `Attempting to send a notification to: 'test@medusajs.com' on the channel: 'email' with template: 'order-created' and data: '{\"username\":\"john-doe\"}'`
          )
        })

        it("should throw an exception if there is no provider for the channel", async () => {
          const notification = {
            to: "test@medusajs.com",
            channel: "sms",
          } as CreateNotificationDTO

          const error = await service
            .createNotifications(notification)
            .catch((e) => e)
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

          await service.createNotifications([notification1, notification2])

          const notifications = await service.listNotifications({
            channel: "log",
          })
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

          const [first] = await service.createNotifications([
            notification1,
            notification2,
          ])

          const notification = await service.retrieveNotification(first.id)
          expect(notification).toEqual(
            expect.objectContaining({
              to: "test@medusajs.com",
              channel: "email",
              template: "order-created",
            })
          )
        })
      })

      describe("Configurable notification subscriber", () => {
        let eventBus: IEventBusModuleService
        beforeAll(async () => {
          eventBus = getContainer().resolve(ModuleRegistrationName.EVENT_BUS)
        })

        it("should successfully sent a notification when an order is created (based on configuration)", async () => {
          const subscriberExecution = TestEventUtils.waitSubscribersExecution(
            "order.created",
            eventBus
          )
          const logSpy = jest.spyOn(logger, "info")

          await eventBus.emit({
            eventName: "order.created",
            data: {
              order: {
                id: "1234",
                email: "test@medusajs.com",
              },
            },
          })
          await subscriberExecution

          const notifications = await service.listNotifications()

          expect(logSpy).toHaveBeenLastCalledWith(
            `Attempting to send a notification to: 'test@medusajs.com' on the channel: 'email' with template: 'order-created-template' and data: '{\"order_id\":\"1234\"}'`
          )
          expect(notifications).toHaveLength(1)
          expect(notifications[0]).toEqual(
            expect.objectContaining({
              to: "test@medusajs.com",
              channel: "email",
              template: "order-created-template",
            })
          )
        })
      })
    })
  },
})
