import {
  CreateNotificationDTO,
  INotificationModuleService,
} from "@medusajs/framework/types"
import {
  CommonEvents,
  composeMessage,
  Module,
  Modules,
  NotificationEvents,
  NotificationStatus,
} from "@medusajs/framework/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "@medusajs/test-utils"
import { NotificationProviderServiceFixtures } from "../../__fixtures__/providers/default-provider"
import { NotificationModuleService } from "@services"
import { resolve } from "path"

let moduleOptions = {
  providers: [
    {
      resolve: resolve(
        process.cwd() +
          "/integration-tests/__fixtures__/providers/default-provider"
      ),
      id: "test-provider",
      options: {
        name: "Test provider",
        channels: ["email"],
      },
    },
  ],
}

jest.setTimeout(30000)

moduleIntegrationTestRunner<INotificationModuleService>({
  moduleName: Modules.NOTIFICATION,
  moduleOptions,
  testSuite: ({ service }) =>
    describe("Notification Module Service", () => {
      let eventBusEmitSpy

      beforeEach(() => {
        eventBusEmitSpy = jest.spyOn(MockEventBusService.prototype, "emit")
      })

      afterEach(() => {
        eventBusEmitSpy.mockClear()
      })

      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.NOTIFICATION, {
          service: NotificationModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual(["notification"])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          notification: {
            id: {
              linkable: "notification_id",
              entity: "Notification",
              primaryKey: "id",
              serviceName: "notification",
              field: "notification",
            },
          },
        })
      })

      it("should send a notification and stores it in the database", async () => {
        const notification = {
          to: "admin@medusa.com",
          from: "sender@verified.com",
          template: "some-template",
          channel: "email",
          data: { link: "http://test.com" },
          provider_data: { cc: "cc@test.com" },
        } as CreateNotificationDTO

        const result = await service.createNotifications(notification)
        const retrieved = await service.retrieveNotification(result.id)

        const expected = {
          to: "admin@medusa.com",
          from: "sender@verified.com",
          template: "some-template",
          channel: "email",
          data: { link: "http://test.com" },
          provider_data: { cc: "cc@test.com" },
          provider_id: "test-provider",
          external_id: "external_id",
          status: NotificationStatus.SUCCESS,
        }
        expect(result).toEqual(expect.objectContaining(expected))
        expect(retrieved).toEqual(expect.objectContaining(expected))
      })

      it("should send a notification and don't store the content in the database", async () => {
        const notification = {
          to: "admin@medusa.com",
          template: "signup-template",
          channel: "email",
          data: {},
          content: {
            html: "<p>Welcome to medusa</p>",
          },
        }

        const result = await service.createNotifications(notification)
        const dbEntry = await service.retrieveNotification(result.id)

        expect(dbEntry).toEqual(
          expect.objectContaining({
            provider_id: "test-provider",
            external_id: "external_id",
            status: NotificationStatus.SUCCESS,
            template: "signup-template",
          })
        )
        expect(dbEntry).not.toHaveProperty("content")
      })

      it("should send a notification without a template", async () => {
        const notification = {
          to: "admin@medusa.com",
          channel: "email",
          content: {
            html: "<p>Welcome to medusa</p>",
          },
        }

        const result = await service.createNotifications(notification)
        const dbEntry = await service.retrieveNotification(result.id)

        expect(dbEntry).toEqual(
          expect.objectContaining({
            provider_id: "test-provider",
            external_id: "external_id",
            status: NotificationStatus.SUCCESS,
            template: null,
          })
        )
        expect(dbEntry).not.toHaveProperty("content")
      })

      it("should emit an event when a notification is created", async () => {
        const notification = {
          to: "admin@medusa.com",
          template: "some-template",
          channel: "email",
          data: {},
        }

        const result = await service.createNotifications(notification)

        expect(eventBusEmitSpy).toHaveBeenCalledTimes(1)
        expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(2)
        expect(eventBusEmitSpy).toHaveBeenNthCalledWith(
          1,
          expect.arrayContaining([
            composeMessage(NotificationEvents.NOTIFICATION_CREATED, {
              data: { id: result.id },
              object: "notification",
              source: Modules.NOTIFICATION,
              action: CommonEvents.CREATED,
            }),
            composeMessage(NotificationEvents.NOTIFICATION_UPDATED, {
              data: { id: result.id },
              object: "notification",
              source: Modules.NOTIFICATION,
              action: CommonEvents.UPDATED,
            }),
          ]),
          {
            internal: true,
          }
        )
      })

      it("should ensures the same notification is not sent twice", async () => {
        const notification = {
          to: "admin@medusa.com",
          template: "some-template",
          channel: "email",
          data: {},
          idempotency_key: "idempotency-key",
        }

        const result = await service.createNotifications(notification)
        expect(result).toEqual(
          expect.objectContaining({
            provider_id: "test-provider",
            external_id: "external_id",
            status: NotificationStatus.SUCCESS,
          })
        )

        const secondResult = await service.createNotifications(notification)
        expect(secondResult).toBe(undefined)
      })

      it("should manage the status of multiple notification properly in any scenarios", async () => {
        const notification1 = {
          to: "admin@medusa.com",
          template: "some-template",
          channel: "email",
          data: {},
          idempotency_key: "idempotency-key",
        }

        const notification2 = {
          to: "0000000000",
          template: "some-template",
          channel: "sms",
          data: {},
          idempotency_key: "idempotency-key-2",
        }

        const notification3 = {
          to: "admin@medusa.com",
          template: "some-template",
          channel: "email",
          data: {},
          idempotency_key: "idempotency-key-3",
        }

        const notification4 = {
          to: "fail",
          template: "some-template",
          channel: "email",
          data: {},
          idempotency_key: "idempotency-key-4",
        }

        const err = await service
          .createNotifications([
            notification1,
            notification2,
            notification3,
            notification4,
          ])
          .catch((e) => e)

        const notifications = await service.listNotifications()

        expect(notifications).toHaveLength(4)

        const notification1Result = notifications.find(
          (n) => n.idempotency_key === "idempotency-key"
        )!
        expect(notification1Result.status).toEqual(NotificationStatus.SUCCESS)

        const notification2Result = notifications.find(
          (n) => n.idempotency_key === "idempotency-key-2"
        )!
        expect(notification2Result.status).toEqual(NotificationStatus.FAILURE)

        const notification3Result = notifications.find(
          (n) => n.idempotency_key === "idempotency-key-3"
        )!
        expect(notification3Result.status).toEqual(NotificationStatus.SUCCESS)

        const notification4Result = notifications.find(
          (n) => n.idempotency_key === "idempotency-key-4"
        )!
        expect(notification4Result.status).toEqual(NotificationStatus.FAILURE)

        expect(err).toBeTruthy()
        expect(err.message).toEqual(
          `Could not find a notification provider for channel: sms for notification id ${notification2Result.id}
Failed to send notification with id ${notification4Result.id}:
Failed to send notification`
        )
      })
      it("should retry a notification that previously failed and flip the existing entry to success", async () => {
        const sendSpy = jest.spyOn(
          NotificationProviderServiceFixtures.prototype,
          "send"
        )

        const failingNotification = {
          to: "fail",
          template: "some-template",
          channel: "email",
          data: {},
          idempotency_key: "idempotency-key-retry",
        }

        const err = await service
          .createNotifications(failingNotification)
          .catch((e) => e)

        expect(err).toBeTruthy()

        const [failed] = await service.listNotifications({
          idempotency_key: "idempotency-key-retry",
        })
        expect(failed.status).toEqual(NotificationStatus.FAILURE)

        sendSpy.mockClear()

        await service.createNotifications({
          ...failingNotification,
          to: "admin@medusa.com",
        })

        expect(sendSpy).toHaveBeenCalledTimes(1)

        const notifications = await service.listNotifications({
          idempotency_key: "idempotency-key-retry",
        })

        expect(notifications).toHaveLength(1)
        expect(notifications[0]).toEqual(
          expect.objectContaining({
            id: failed.id,
            external_id: "external_id",
            status: NotificationStatus.SUCCESS,
          })
        )

        sendSpy.mockRestore()
      })

      it("should not send a notification again once a previously failed one succeeded", async () => {
        const notification = {
          to: "fail",
          template: "some-template",
          channel: "email",
          data: {},
          idempotency_key: "idempotency-key-retry-once",
        }

        await service.createNotifications(notification).catch((e) => e)
        await service.createNotifications({
          ...notification,
          to: "admin@medusa.com",
        })

        const sendSpy = jest.spyOn(
          NotificationProviderServiceFixtures.prototype,
          "send"
        )

        const result = await service.createNotifications({
          ...notification,
          to: "admin@medusa.com",
        })

        expect(result).toBeUndefined()
        expect(sendSpy).not.toHaveBeenCalled()

        const notifications = await service.listNotifications({
          idempotency_key: "idempotency-key-retry-once",
        })
        expect(notifications).toHaveLength(1)
        expect(notifications[0].status).toEqual(NotificationStatus.SUCCESS)

        sendSpy.mockRestore()
      })

      it("should persist the status of the other notifications of a batch containing a retried one", async () => {
        const failingNotification = {
          to: "fail",
          template: "some-template",
          channel: "email",
          data: {},
          idempotency_key: "idempotency-key-retry-batch",
        }

        await service.createNotifications(failingNotification).catch((e) => e)

        await service.createNotifications([
          { ...failingNotification, to: "admin@medusa.com" },
          {
            to: "admin@medusa.com",
            template: "some-template",
            channel: "email",
            data: {},
            idempotency_key: "idempotency-key-retry-batch-sibling",
          },
        ])

        const [sibling] = await service.listNotifications({
          idempotency_key: "idempotency-key-retry-batch-sibling",
        })
        expect(sibling.status).toEqual(NotificationStatus.SUCCESS)

        const [retried] = await service.listNotifications({
          idempotency_key: "idempotency-key-retry-batch",
        })
        expect(retried.status).toEqual(NotificationStatus.SUCCESS)
      })

    }),
})
