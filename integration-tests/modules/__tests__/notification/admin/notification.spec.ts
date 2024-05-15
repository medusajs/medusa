import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateNotificationDTO,
  IEventBusModuleService,
  INotificationModuleService,
  Logger,
} from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { promisify } from "util"
import LocalEventBusService from "@medusajs/event-bus-local/dist/services/event-bus-local"

export const sleep = promisify(setTimeout)

const waitAllSubscribersExecution = (
  eventName: string,
  eventBus: IEventBusModuleService
) => {
  const subscriberPromises: Promise<any>[] = []

  ;(eventBus as any).eventEmitter_.listeners(eventName).forEach((listner) => {
    ;(eventBus as any).eventEmitter_.removeListener("order.created", listner)

    let ok, nok
    const promise = new Promise((resolve, reject) => {
      ok = resolve
      nok = reject
    })
    subscriberPromises.push(promise)

    const newListener = async (...args2) => {
      return await listner.apply(eventBus, args2).then(ok).catch(nok)
    }

    ;(eventBus as any).eventEmitter_.on("order.created", newListener)
  })

  return Promise.all(subscriberPromises)
}

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    beforeAll(async () => {
      const container = getContainer()
      const eventBus = container.resolve(
        ModuleRegistrationName.EVENT_BUS
      ) as LocalEventBusService
    })

    describe("Notifications", () => {
      let service: INotificationModuleService
      let logger: Logger

      beforeAll(async () => {
        service = getContainer().resolve(ModuleRegistrationName.NOTIFICATION)
        logger = getContainer().resolve(ContainerRegistrationKeys.LOGGER)
      })

      afterEach(() => {
        jest.clearAllMocks()
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

      describe.only("Configurable notification subscriber", () => {
        let eventBus: IEventBusModuleService
        beforeAll(async () => {
          eventBus = getContainer().resolve(ModuleRegistrationName.EVENT_BUS)
        })

        it("should successfully sent a notification when an order is created (based on configuration)", async () => {
          const promise = waitAllSubscribersExecution("order.created", eventBus)
          const logSpy = jest.spyOn(logger, "info")

          await eventBus.emit("order.created", {
            data: {
              order: {
                id: "1234",
                email: "test@medusajs.com",
              },
            },
          })

          await promise

          const notifications = await service.list()

          expect(logSpy).toHaveBeenLastCalledWith(
            'Attempting to send a notification to: test@medusajs.com on the channel: email with template: order-created-template and data: {"order_id":"1234"}'
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
