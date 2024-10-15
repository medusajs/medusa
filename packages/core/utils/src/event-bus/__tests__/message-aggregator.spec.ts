import { MessageAggregator } from "../message-aggregator"

describe("MessageAggregator", function () {
  afterEach(() => {
    jest.resetAllMocks
  })

  it("should group messages by any given group of keys", function () {
    const aggregator = new MessageAggregator()
    aggregator.save({
      name: "ProductVariant.created",
      metadata: {
        source: "product",
        action: "created",
        object: "ProductVariant",
        eventGroupId: "1",
      },
      data: { id: 999 },
    })
    aggregator.save({
      name: "Product.created",
      metadata: {
        source: "product",
        action: "created",
        object: "Product",
        eventGroupId: "1",
      },
      data: { id: 1 },
    })
    aggregator.save({
      name: "ProductVariant.created",
      metadata: {
        source: "product",
        action: "created",
        object: "ProductVariant",
        eventGroupId: "1",
      },
      data: { id: 222 },
    })
    aggregator.save({
      name: "ProductType.detached",
      metadata: {
        source: "product",
        action: "detached",
        object: "ProductType",
        eventGroupId: "1",
      },
      data: { id: 333 },
    })
    aggregator.save({
      name: "ProductVariant.updated",
      metadata: {
        source: "product",
        action: "updated",
        object: "ProductVariant",
        eventGroupId: "1",
      },
      data: { id: 123 },
    })

    const format = {
      groupBy: ["name", "metadata.object", "metadata.action"],
      sortBy: {
        "metadata.object": ["ProductType", "ProductVariant", "Product"],
        "data.id": "asc",
      },
    }

    const messages = aggregator.getMessages(format)

    expect(Object.keys(messages)).toHaveLength(4)

    const allGroups = Object.values(messages)

    expect(allGroups[0]).toEqual([
      {
        name: "ProductType.detached",
        metadata: {
          source: "product",
          action: "detached",
          object: "ProductType",
          eventGroupId: "1",
        },
        data: { id: 333 },
      },
    ])

    expect(allGroups[1]).toEqual([
      {
        name: "ProductVariant.updated",
        metadata: {
          source: "product",
          action: "updated",
          object: "ProductVariant",
          eventGroupId: "1",
        },
        data: { id: 123 },
      },
    ])

    expect(allGroups[2]).toEqual([
      {
        name: "ProductVariant.created",
        metadata: {
          source: "product",
          action: "created",
          object: "ProductVariant",
          eventGroupId: "1",
        },
        data: { id: 222 },
      },
      {
        name: "ProductVariant.created",
        metadata: {
          source: "product",
          action: "created",
          object: "ProductVariant",
          eventGroupId: "1",
        },
        data: { id: 999 },
      },
    ])

    expect(allGroups[3]).toEqual([
      {
        name: "Product.created",
        metadata: {
          source: "product",
          action: "created",
          object: "Product",
          eventGroupId: "1",
        },
        data: { id: 1 },
      },
    ])
  })
})
