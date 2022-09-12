import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import { OrderEditService, OrderService } from "../index"
import { OrderEditItemChangeType } from "../../models"
import { OrderServiceMock } from "../__mocks__/order"

const orderEditWithChanges = {
  id: "order-edit-with-changes",
  order: {
    id: "order-edit-with-changes-order",
    items: [
      {
        id: "line-item-1",
      },
      {
        id: "line-item-2",
      },
    ],
  },
  changes: [
    {
      type: OrderEditItemChangeType.ITEM_REMOVE,
      id: "order-edit-with-changes-removed-change",
      original_line_item_id: "line-item-1",
      original_line_item: {
        id: "line-item-1",
      },
    },
    {
      type: OrderEditItemChangeType.ITEM_ADD,
      id: "order-edit-with-changes-added-change",
      line_item_id: "line-item-3",
      line_item: {
        id: "line-item-3",
      },
    },
    {
      type: OrderEditItemChangeType.ITEM_UPDATE,
      id: "order-edit-with-changes-updated-change",
      original_line_item_id: "line-item-2",
      original_line_item: {
        id: "line-item-2",
      },
      line_item_id: "line-item-4",
      line_item: {
        id: "line-item-4",
      },
    },
  ],
}

describe("OrderEditService", () => {
  const orderEditRepository = MockRepository({
    findOneWithRelations: (relations, query) => {
      if (query?.where?.id === "order-edit-with-changes") {
        return orderEditWithChanges
      }

      return {}
    },
  })

  const orderEditService = new OrderEditService({
    manager: MockManager,
    orderEditRepository,
    orderService: OrderServiceMock as unknown as OrderService,
  })

  it("should retrieve an order edit and call the repository with the right arguments", async () => {
    await orderEditService.retrieve("order-edit-with-changes")
    expect(orderEditRepository.findOneWithRelations).toHaveBeenCalledTimes(1)
    expect(orderEditRepository.findOneWithRelations).toHaveBeenCalledWith(
      undefined,
      {
        where: { id: "order-edit-with-changes" },
      }
    )
  })

  it("should compute the items from the changes and attach them to the orderEdit", async () => {
    const orderEdit = await orderEditService.retrieve("order-edit-with-changes")
    const computedOrderEdit = await orderEditService.computeLineItems(orderEdit)
    expect(computedOrderEdit.items.length).toBe(2)
    expect(computedOrderEdit.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "line-item-2",
        }),
        expect.objectContaining({
          id: "line-item-3",
        }),
      ])
    )

    expect(computedOrderEdit.removed_items.length).toBe(1)
    expect(computedOrderEdit.removed_items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "line-item-1",
        }),
      ])
    )
  })
})
