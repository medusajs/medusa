import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { MedusaContainer } from "@medusajs/types"
import { composeMessage, ModuleRegistrationName } from "@medusajs/utils"
import testEventPayloadHandlerMock from "../../dist/subscribers/test-event-payload"

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    let container!: MedusaContainer

    describe("EventBusModule", () => {
      beforeAll(() => {
        container = getContainer()
      })

      it(`should emit event with the expected shape to be received by the subscribers`, async () => {
        const eventBus = container.resolve(ModuleRegistrationName.EVENT_BUS)
        const eventName = "test-event-payload"

        await eventBus.emit(
          composeMessage(eventName, {
            data: {
              test: "foo",
            },
            object: "object",
            source: "source",
            action: "action",
          })
        )

        expect(testEventPayloadHandlerMock).toHaveBeenCalled()
        expect(
          testEventPayloadHandlerMock.mock.calls[0][0].pluginOptions
        ).toEqual({})
        expect(testEventPayloadHandlerMock.mock.calls[0][0].event).toEqual({
          name: eventName,
          data: {
            test: "foo",
          },
          metadata: {
            object: "object",
            source: "source",
            action: "action",
          },
        })
      })
    })
  },
})
