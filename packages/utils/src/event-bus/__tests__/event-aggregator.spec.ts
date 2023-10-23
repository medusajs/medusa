import { EventAggregator } from "../event-aggregator"

const eventBus = {
  emit: jest.fn((events) => {}),
} as any

describe("EventAggregator", function () {
  afterEach(() => {
    jest.resetAllMocks
  })

  it("should group events by any given group of keys", function () {
    const aggregator = new EventAggregator(eventBus)
    aggregator.emit({
      eventName: "ProductVariant.created",
      body: {
        metadata: {
          service: "ProductService",
          action: "created",
          object: "ProductVariant",
          eventGroupId: "1",
        },
        data: { id: 999 },
      },
    })
    aggregator.emit({
      eventName: "Product.created",
      body: {
        metadata: {
          service: "ProductService",
          action: "created",
          object: "Product",
          eventGroupId: "1",
        },
        data: { id: 1 },
      },
    })
    aggregator.emit({
      eventName: "ProductVariant.created",
      body: {
        metadata: {
          service: "ProductService",
          action: "created",
          object: "ProductVariant",
          eventGroupId: "1",
        },
        data: { id: 222 },
      },
    })
    aggregator.emit({
      eventName: "ProductType.dettached",
      body: {
        metadata: {
          service: "ProductService",
          action: "dettached",
          object: "ProductType",
          eventGroupId: "1",
        },
        data: { id: 333 },
      },
    })
    aggregator.emit({
      eventName: "ProductVariant.updated",
      body: {
        metadata: {
          service: "ProductService",
          action: "updated",
          object: "ProductVariant",
          eventGroupId: "1",
        },
        data: { id: 123 },
      },
    })

    const format = {
      groupBy: ["eventName", "body.metadata.object", "body.metadata.action"],
      sortBy: {
        "body.metadata.object": ["ProductType", "ProductVariant", "Product"],
        "body.data.id": "asc",
      },
    }

    aggregator.publishEvents(format)

    expect(eventBus.emit).toHaveBeenCalledTimes(4)
    expect(eventBus.emit).toHaveBeenNthCalledWith(1, [
      {
        eventName: "ProductType.dettached",
        body: {
          metadata: {
            service: "ProductService",
            action: "dettached",
            object: "ProductType",
            eventGroupId: "1",
          },
          data: { id: 333 },
        },
      },
    ])

    expect(eventBus.emit).toHaveBeenNthCalledWith(2, [
      {
        eventName: "ProductVariant.updated",
        body: {
          metadata: {
            service: "ProductService",
            action: "updated",
            object: "ProductVariant",
            eventGroupId: "1",
          },
          data: { id: 123 },
        },
      },
    ])

    expect(eventBus.emit).toHaveBeenNthCalledWith(3, [
      {
        eventName: "ProductVariant.created",
        body: {
          metadata: {
            service: "ProductService",
            action: "created",
            object: "ProductVariant",
            eventGroupId: "1",
          },
          data: { id: 222 },
        },
      },
      {
        eventName: "ProductVariant.created",
        body: {
          metadata: {
            service: "ProductService",
            action: "created",
            object: "ProductVariant",
            eventGroupId: "1",
          },
          data: { id: 999 },
        },
      },
    ])

    expect(eventBus.emit).toHaveBeenNthCalledWith(4, [
      {
        eventName: "Product.created",
        body: {
          metadata: {
            service: "ProductService",
            action: "created",
            object: "Product",
            eventGroupId: "1",
          },
          data: { id: 1 },
        },
      },
    ])
  })
})
