import { MedusaContainer } from "@medusajs/types"
import { Modules, composeMessage } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import testEventPayloadHandlerMock from "../../src/subscribers/test-event-payload"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    let container!: MedusaContainer

    describe("EventBusModule", () => {
      beforeAll(() => {
        container = getContainer()
      })

      it(`should emit event with the expected shape to be received by the subscribers`, async () => {
        const eventBus = container.resolve(Modules.EVENT_BUS)
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
        ).toEqual(expect.any(Object))
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
