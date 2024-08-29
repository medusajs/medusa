import { EmitEvents } from "../emit-events"
import { MedusaContext } from "../context-parameter"
import { Context } from "@medusajs/types"
import { InjectSharedContext } from "../inject-shared-context"

describe("EmitEvents", () => {
  it(`should call the emit event method from the base service including the messages and their options`, async () => {
    const mock = jest.fn()

    class FakeService {
      async emitEvents_(...args) {
        return mock(...args)
      }

      @InjectSharedContext()
      @EmitEvents({ internal: true })
      async method(@MedusaContext() sharedContext: Context = {}) {
        sharedContext.messageAggregator?.saveRawMessageData({
          data: { id: 1 },
          object: "test",
          action: "create",
          source: "test",
          eventName: "test-event",
        })
      }
    }

    const service = new FakeService()
    await service.method()

    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith({
      default: [
        {
          name: "test-event",
          metadata: {
            source: "test",
            object: "test",
            action: "create",
          },
          data: {
            id: 1,
          },
          options: {
            internal: true,
          },
        },
      ],
    })
  })

  it(`should call the emit event method from the base service with grouped messages`, async () => {
    const mock = jest.fn()

    class FakeService {
      async emitEvents_(...args) {
        return mock(...args)
      }

      @InjectSharedContext()
      @EmitEvents({ internal: true, groupBy: ["name"] })
      async method(@MedusaContext() sharedContext: Context = {}) {
        sharedContext.messageAggregator?.saveRawMessageData({
          data: { id: 1 },
          object: "test",
          action: "create",
          source: "test",
          eventName: "test-event",
        })
      }
    }

    const service = new FakeService()
    await service.method()

    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith({
      "test-event": [
        {
          name: "test-event",
          metadata: {
            source: "test",
            object: "test",
            action: "create",
          },
          data: {
            id: 1,
          },
          options: {
            internal: true,
          },
        },
      ],
    })
  })
})
