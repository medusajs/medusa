import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import { OrderEditService, OrderService } from "../index"
import { OrderEditItemChangeType } from "../../models"
import { OrderServiceMock } from "../__mocks__/order"

const orderEditWithChanges = {
  id: IdMap.getId("order-edit-with-changes"),
  order: {
    id: IdMap.getId("order-edit-with-changes-order"),
    items: [
      {
        id: IdMap.getId("line-item-1"),
      },
      {
        id: IdMap.getId("line-item-2"),
      },
    ],
  },
  changes: [
    {
      type: OrderEditItemChangeType.ITEM_REMOVE,
      id: "order-edit-with-changes-removed-change",
      original_line_item_id: IdMap.getId("line-item-1"),
      original_line_item: {
        id: IdMap.getId("line-item-1"),
      },
    },
    {
      type: OrderEditItemChangeType.ITEM_ADD,
      id: IdMap.getId("order-edit-with-changes-added-change"),
      line_item_id: IdMap.getId("line-item-3"),
      line_item: {
        id: IdMap.getId("line-item-3"),
      },
    },
    {
      type: OrderEditItemChangeType.ITEM_UPDATE,
      id: IdMap.getId("order-edit-with-changes-updated-change"),
      original_line_item_id: IdMap.getId("line-item-2"),
      original_line_item: {
        id: IdMap.getId("line-item-2"),
      },
      line_item_id: IdMap.getId("line-item-4"),
      line_item: {
        id: IdMap.getId("line-item-4"),
      },
    },
  ],
}

describe("OrderEditService", () => {
  const orderEditRepository = MockRepository({
    findOneWithRelations: (relations, query) => {
      if (query?.where?.id === IdMap.getId("order-edit-with-changes")) {
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
    await orderEditService.retrieve(IdMap.getId("order-edit-with-changes"))
    expect(orderEditRepository.findOneWithRelations).toHaveBeenCalledTimes(1)
    expect(orderEditRepository.findOneWithRelations).toHaveBeenCalledWith(
      undefined,
      {
        where: { id: IdMap.getId("order-edit-with-changes") },
      }
    )
  })

  it("should compute the items from the changes and attach them to the orderEdit", async () => {
    const orderEdit = await orderEditService.retrieve(
      IdMap.getId("order-edit-with-changes")
    )
    const { items, removedItems } = await orderEditService.computeLineItems(
      orderEdit.id
    )
    expect(items.length).toBe(2)
    expect(items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: IdMap.getId("line-item-2"),
        }),
        expect.objectContaining({
          id: IdMap.getId("line-item-3"),
        }),
      ])
    )

    expect(removedItems.length).toBe(1)
    expect(removedItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: IdMap.getId("line-item-1"),
        }),
      ])
    )
  })
})
