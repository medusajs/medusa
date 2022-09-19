import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import {
  EventBusService,
  LineItemService,
  OrderEditService,
  OrderService,
  TotalsService,
} from "../index"
import { OrderEditItemChangeType } from "../../models"
import { OrderServiceMock } from "../__mocks__/order"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import { LineItemServiceMock } from "../__mocks__/line-item"
import { TotalsServiceMock } from "../__mocks__/totals"

const orderEditToUpdate = {
  id: IdMap.getId("order-edit-to-update"),
}

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

const lineItemServiceMock = {
  ...LineItemServiceMock,
  list: jest.fn().mockImplementation(() => {
    return Promise.resolve([
      {
        id: IdMap.getId("line-item-1"),
      },
      {
        id: IdMap.getId("line-item-2"),
      },
    ])
  }),
  retrieve: jest.fn().mockImplementation((id) => {
    return Promise.resolve({
      id,
    })
  }),
}

describe("OrderEditService", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const orderEditRepository = MockRepository({
    findOneWithRelations: (relations, query) => {
      if (query?.where?.id === IdMap.getId("order-edit-with-changes")) {
        return orderEditWithChanges
      }

      return {}
    },
    create: (data) => {
      return {
        ...orderEditWithChanges,
        ...data,
      }
    },
  })

  const orderEditService = new OrderEditService({
    manager: MockManager,
    orderEditRepository,
    orderService: OrderServiceMock as unknown as OrderService,
    eventBusService: EventBusServiceMock as unknown as EventBusService,
    totalsService: TotalsServiceMock as unknown as TotalsService,
    lineItemService: lineItemServiceMock as unknown as LineItemService,
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

  it("should update an order edit with the right arguments", async () => {
    await orderEditService.update(IdMap.getId("order-edit-to-update"), {
      internal_note: "test note",
    })
    expect(orderEditRepository.save).toHaveBeenCalledTimes(1)
    expect(orderEditRepository.save).toHaveBeenCalledWith({
      internal_note: "test note",
    })
  })

  it("should compute the items from the changes and attach them to the orderEdit", async () => {
    const { items, removedItems } = await orderEditService.computeLineItems(
      IdMap.getId("order-edit-with-changes")
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

  it("should create an order edit and call the repository with the right arguments as well as the event bus service", async () => {
    const data = {
      order_id: IdMap.getId("order-edit-order-id"),
      internal_note: "internal note",
    }
    await orderEditService.create(data, {
      loggedInUserId: IdMap.getId("admin_user"),
    })

    expect(orderEditRepository.create).toHaveBeenCalledTimes(1)
    expect(orderEditRepository.create).toHaveBeenCalledWith({
      order_id: data.order_id,
      internal_note: data.internal_note,
      created_by: IdMap.getId("admin_user"),
    })
    expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
    expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
      OrderEditService.Events.CREATED,
      { id: expect.any(String) }
    )
  })
})
