import { INotificationModuleService } from "@medusajs/types"
import {
  CommonEvents,
  Module,
  Modules,
  NotificationEvents,
  composeMessage,
} from "@medusajs/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
  SuiteOptions,
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

moduleIntegrationTestRunner({
  moduleName: Modules.NOTIFICATION,
  moduleOptions,
  testSuite: ({ service }: SuiteOptions<INotificationModuleService>) =>
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

      it("sends a notification and stores it in the database", async () => {
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
          })
        )
      })

      it("emits an event when a notification is created", async () => {
        const notification = {
          to: "admin@medusa.com",
          template: "some-template",
          channel: "email",
          data: {},
        }

        const result = await service.createNotifications(notification)

        expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(1)
        expect(eventBusEmitSpy).toHaveBeenCalledWith([
          composeMessage(NotificationEvents.NOTIFICATION_CREATED, {
            data: { id: result.id },
            object: "notification",
            source: Modules.NOTIFICATION,
            action: CommonEvents.CREATED,
          }),
        ])
      })

      it("ensures the same notification is not sent twice", async () => {
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
          })
        )

        const secondResult = await service.createNotifications(notification)
        expect(secondResult).toBe(undefined)
      })
    }),
})
