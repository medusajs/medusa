import { MessageAggregator } from "../message-aggregator"

describe("MessageAggregator", function () {
  afterEach(() => {
    jest.resetAllMocks
  })

  it("should group messages by any given group of keys", function () {
    const aggregator = new MessageAggregator()
    aggregator.save({
      eventName: "ProductVariant.created",
      metadata: {
        source: "ProductService",
        action: "created",
        object: "ProductVariant",
        eventGroupId: "1",
      },
      data: { id: 999 },
    })
    aggregator.save({
      eventName: "Product.created",
      metadata: {
        source: "ProductService",
        action: "created",
        object: "Product",
        eventGroupId: "1",
      },
      data: { id: 1 },
    })
    aggregator.save({
      eventName: "ProductVariant.created",
      metadata: {
        source: "ProductService",
        action: "created",
        object: "ProductVariant",
        eventGroupId: "1",
      },
      data: { id: 222 },
    })
    aggregator.save({
      eventName: "ProductType.detached",
      metadata: {
        source: "ProductService",
        action: "detached",
        object: "ProductType",
        eventGroupId: "1",
      },
      data: { id: 333 },
    })
    aggregator.save({
      eventName: "ProductVariant.updated",
      metadata: {
        source: "ProductService",
        action: "updated",
        object: "ProductVariant",
        eventGroupId: "1",
      },
      data: { id: 123 },
    })

    const format = {
      groupBy: ["eventName", "body.metadata.object", "body.metadata.action"],
      sortBy: {
        "body.metadata.object": ["ProductType", "ProductVariant", "Product"],
        "body.data.id": "asc",
      },
    }

    const messages = aggregator.getMessages(format)

    expect(Object.keys(messages)).toHaveLength(4)

    const allGroups = Object.values(messages)

    expect(allGroups[0]).toEqual([
      {
        eventName: "ProductType.detached",
        metadata: {
          source: "ProductService",
          action: "detached",
          object: "ProductType",
          eventGroupId: "1",
        },
        data: { id: 333 },
      },
    ])

    expect(allGroups[1]).toEqual([
      {
        eventName: "ProductVariant.updated",
        metadata: {
          source: "ProductService",
          action: "updated",
          object: "ProductVariant",
          eventGroupId: "1",
        },
        data: { id: 123 },
      },
    ])

    expect(allGroups[2]).toEqual([
      {
        eventName: "ProductVariant.created",
        metadata: {
          source: "ProductService",
          action: "created",
          object: "ProductVariant",
          eventGroupId: "1",
        },
        data: { id: 222 },
      },
      {
        eventName: "ProductVariant.created",
        metadata: {
          source: "ProductService",
          action: "created",
          object: "ProductVariant",
          eventGroupId: "1",
        },
        data: { id: 999 },
      },
    ])

    expect(allGroups[3]).toEqual([
      {
        eventName: "Product.created",
        metadata: {
          source: "ProductService",
          action: "created",
          object: "Product",
          eventGroupId: "1",
        },
        data: { id: 1 },
      },
    ])
  })
})
