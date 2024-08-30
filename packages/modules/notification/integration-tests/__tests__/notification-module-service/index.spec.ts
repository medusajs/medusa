import { INotificationModuleService } from "@medusajs/types"
import {
  CommonEvents,
  composeMessage,
  Module,
  Modules,
  NotificationEvents,
  NotificationStatus,
} from "@medusajs/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "medusa-test-utils"
import { resolve } from "path"
import { NotificationModuleService } from "@services"

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
          template: "some-template",
          channel: "email",
          data: {},
        }

        const result = await service.createNotifications(notification)
        expect(result).toEqual(
          expect.objectContaining({
            provider_id: "test-provider",
            external_id: "external_id",
            status: NotificationStatus.SUCCESS,
          })
        )
      })

      it("should emit an event when a notification is created", async () => {
        const notification = {
          to: "admin@medusa.com",
          template: "some-template",
          channel: "email",
          data: {},
        }

        const result = await service.createNotifications(notification)

        expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(1)
        expect(eventBusEmitSpy).toHaveBeenCalledWith(
          [
            composeMessage(NotificationEvents.NOTIFICATION_CREATED, {
              data: { id: result.id },
              object: "notification",
              source: Modules.NOTIFICATION,
              action: CommonEvents.CREATED,
            }),
          ],
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

        const err = await service
          .createNotifications([notification1, notification2, notification3])
          .catch((e) => e)

        expect(err).toBeTruthy()
        expect(err.message).toEqual(
          "Could not find a notification provider for channel: sms"
        )

        const notifications = await service.listNotifications()

        expect(notifications).toHaveLength(3)

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
      })
    }),
})
