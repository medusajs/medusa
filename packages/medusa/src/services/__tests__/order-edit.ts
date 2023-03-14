import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import { OrderEditItemChangeType, OrderEditStatus } from "../../models"
import {
  EventBusService,
  LineItemService,
  NewTotalsService,
  OrderEditItemChangeService,
  OrderEditService,
  OrderService,
  TaxProviderService,
  TotalsService,
} from "../index"
import LineItemAdjustmentService from "../line-item-adjustment"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import { LineItemServiceMock } from "../__mocks__/line-item"
import { LineItemAdjustmentServiceMock } from "../__mocks__/line-item-adjustment"
import { OrderServiceMock } from "../__mocks__/order"
import { orderEditItemChangeServiceMock } from "../__mocks__/order-edit-item-change"
import { taxProviderServiceMock } from "../__mocks__/tax-provider"
import { TotalsServiceMock } from "../__mocks__/totals"
import NewTotalsServiceMock from "../__mocks__/new-totals"

const orderEditToUpdate = {
  id: IdMap.getId("order-edit-to-update"),
  created_at: new Date(),
  status: "created",
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
  items: [
    {
      original_item_id: IdMap.getId("line-item-1"),
      id: IdMap.getId("cloned-line-item-1"),
    },
    {
      original_item_id: IdMap.getId("line-item-2"),
      id: IdMap.getId("cloned-line-item-2"),
    },
  ],
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

const orderEditWithAddedLineItem = {
  id: IdMap.getId("order-edit-with-changes"),
  order: {
    id: IdMap.getId("order-edit-change"),
    cart: {
      discounts: [{ rule: {} }],
    },
    region: { id: IdMap.getId("test-region") },
  },
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
    const data = {
      id,
      quantity: 1,
      fulfilled_quantity: 1,
    }

    if (id === IdMap.getId("line-item-1")) {
      return Promise.resolve({
        ...data,
        order_edit_id: IdMap.getId("order-edit-update-line-item"),
      })
    }
    return Promise.resolve(data)
  }),
  cloneTo: () => [],
}

describe("OrderEditService", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const orderEditRepository = MockRepository({
    findOne: (query) => {
      if (query?.where?.id === IdMap.getId("order-edit-to-update")) {
        return orderEditToUpdate
      }
      if (query?.where?.id === IdMap.getId("order-edit-with-changes")) {
        return orderEditWithChanges
      }
      if (query?.where?.id === IdMap.getId("order-edit-update-line-item")) {
        return {
          ...orderEditWithChanges,
          changes: [],
        }
      }
      if (query?.where?.id === IdMap.getId("confirmed-order-edit")) {
        return {
          ...orderEditWithChanges,
          id: IdMap.getId("confirmed-order-edit"),
          status: OrderEditStatus.CONFIRMED,
        }
      }
      if (query?.where?.id === IdMap.getId("requested-order-edit")) {
        return {
          ...orderEditWithChanges,
          id: IdMap.getId("requested-order-edit"),
          status: OrderEditStatus.REQUESTED,
        }
      }
      if (query?.where?.id === IdMap.getId("declined-order-edit")) {
        return {
          ...orderEditWithChanges,
          id: IdMap.getId("declined-order-edit"),
          declined_reason: "wrong size",
          declined_at: new Date(),
          declined_by: "admin_user",
          status: OrderEditStatus.DECLINED,
        }
      }
      if (query?.where?.id === IdMap.getId("canceled-order-edit")) {
        return { ...orderEditWithChanges, status: "canceled" }
      }
      if (query?.where?.id === IdMap.getId("confirmed-order-edit")) {
        return { ...orderEditWithChanges, status: "confirmed" }
      }
      if (query?.where?.id === IdMap.getId("declined-order-edit")) {
        return { ...orderEditWithChanges, status: "declined" }
      }

      return
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
    newTotalsService: NewTotalsServiceMock as unknown as NewTotalsService,
    lineItemService: lineItemServiceMock as unknown as LineItemService,
    orderEditItemChangeService:
      orderEditItemChangeServiceMock as unknown as OrderEditItemChangeService,
    lineItemAdjustmentService:
      LineItemAdjustmentServiceMock as unknown as LineItemAdjustmentService,
    taxProviderService: taxProviderServiceMock as unknown as TaxProviderService,
  })

  it("should retrieve an order edit and call the repository with the right arguments", async () => {
    await orderEditService.retrieve(IdMap.getId("order-edit-with-changes"))
    expect(orderEditRepository.findOne).toHaveBeenCalledTimes(1)
    expect(orderEditRepository.findOne).toHaveBeenCalledWith({
      where: { id: IdMap.getId("order-edit-with-changes") },
    })
  })

  it("should update an order edit with the right arguments", async () => {
    await orderEditService.update(IdMap.getId("order-edit-to-update"), {
      internal_note: "test note",
    })
    expect(orderEditRepository.save).toHaveBeenCalledTimes(1)
    expect(orderEditRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: IdMap.getId("order-edit-to-update"),
        internal_note: "test note",
      })
    )
  })

  it("should create an order edit and call the repository with the right arguments as well as the event bus service", async () => {
    const data = {
      order_id: IdMap.getId("order-edit-order-id"),
      internal_note: "internal note",
    }
    await orderEditService.create(data, {
      createdBy: IdMap.getId("admin_user"),
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

  it("should update a line item  and create an item change to an order edit", async () => {
    await orderEditService.updateLineItem(
      IdMap.getId("order-edit-update-line-item"),
      IdMap.getId("line-item-1"),
      {
        quantity: 3,
      }
    )

    expect(orderEditItemChangeServiceMock.list).toHaveBeenCalledTimes(1)
    expect(orderEditItemChangeServiceMock.create).toHaveBeenCalledTimes(1)
    expect(
      LineItemAdjustmentServiceMock.createAdjustments
    ).toHaveBeenCalledTimes(1)
  })

  describe("decline", () => {
    it("declines an order edit", async () => {
      const result = await orderEditService.decline(
        IdMap.getId("requested-order-edit"),
        {
          declinedReason: "I requested a different color for the new product",
          declinedBy: "admin_user",
        }
      )

      expect(result).toEqual(
        expect.objectContaining({
          id: IdMap.getId("requested-order-edit"),
          declined_at: expect.any(Date),
          declined_reason: "I requested a different color for the new product",
          declined_by: "admin_user",
        })
      )
    })

    it("fails to decline a confirmed order edit", async () => {
      await expect(
        orderEditService.decline(IdMap.getId("confirmed-order-edit"), {
          declinedReason: "I requested a different color for the new product",
          declinedBy: "admin_user",
        })
      ).rejects.toThrowError(
        "Cannot decline an order edit with status confirmed."
      )
    })

    it("fails to re-decline an already declined order edit", async () => {
      const result = await orderEditService.decline(
        IdMap.getId("declined-order-edit"),
        {
          declinedReason: "I requested a different color for the new product",
          declinedBy: "admin_user",
        }
      )

      expect(result).toEqual(
        expect.objectContaining({
          id: IdMap.getId("declined-order-edit"),
          declined_at: expect.any(Date),
          declined_reason: "wrong size",
          declined_by: "admin_user",
          status: "declined",
        })
      )
    })
  })

  it("should add a line item to an order edit", async () => {
    jest
      .spyOn(orderEditService, "refreshAdjustments")
      .mockImplementation(async () => {})

    await orderEditService.addLineItem(IdMap.getId("order-edit-with-changes"), {
      variant_id: IdMap.getId("to-be-added-variant"),
      quantity: 3,
    })

    expect(LineItemServiceMock.generate).toHaveBeenCalledTimes(1)
    expect(orderEditService.refreshAdjustments).toHaveBeenCalledTimes(1)
    expect(taxProviderServiceMock.createTaxLines).toHaveBeenCalledTimes(1)
    expect(orderEditItemChangeServiceMock.create).toHaveBeenCalledTimes(1)
  })

  describe("requestConfirmation", () => {
    describe("created edit", () => {
      const orderEditId = IdMap.getId("order-edit-with-changes")
      const userId = IdMap.getId("user-id")
      let result

      beforeEach(async () => {
        jest.spyOn(orderEditService, "decorateTotals").mockResolvedValue({
          difference_due: 1500,
        } as any)

        result = await orderEditService.requestConfirmation(orderEditId, {
          requestedBy: userId,
        })
      })

      it("sets fields correctly for update", async () => {
        expect(result).toEqual(
          expect.objectContaining({
            requested_at: expect.any(Date),
            requested_by: userId,
          })
        )

        expect(orderEditRepository.save).toHaveBeenCalledWith({
          ...orderEditWithChanges,
          requested_at: expect.any(Date),
          requested_by: userId,
        })

        expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
          OrderEditService.Events.REQUESTED,
          { id: orderEditId }
        )
      })
    })

    describe("requested edit", () => {
      const orderEditId = IdMap.getId("requested-order-edit")
      const userId = IdMap.getId("user-id")
      let result

      beforeEach(async () => {
        result = await orderEditService.requestConfirmation(orderEditId, {
          requestedBy: userId,
        })
      })

      afterEach(() => {
        jest.clearAllMocks()
      })
    })

    describe("cancel", () => {
      it("Cancels an order edit", async () => {
        const id = IdMap.getId("order-edit-with-changes")
        const userId = IdMap.getId("user-id")

        await orderEditService.cancel(id, { canceledBy: userId })

        expect(orderEditRepository.save).toHaveBeenCalledWith({
          ...orderEditWithChanges,
          canceled_by: userId,
          canceled_at: expect.any(Date),
        })

        expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
        expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
          OrderEditService.Events.CANCELED,
          { id }
        )
      })

      it("Returns early in case of an already canceled order edit", async () => {
        const id = IdMap.getId("canceled-order-edit")
        const userId = IdMap.getId("user-id")

        const result = await orderEditService.cancel(id, {
          canceledBy: userId,
        })

        expect(result).toEqual(expect.objectContaining({ status: "canceled" }))

        expect(orderEditRepository.save).toHaveBeenCalledTimes(0)
        expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(0)
      })

      test.each(["confirmed", "declined"])(
        "Fails to cancel an edit with status %s",
        async (status) => {
          expect.assertions(1)
          const id = IdMap.getId(`${status}-order-edit`)
          const userId = IdMap.getId("user-id")

          try {
            await orderEditService.cancel(id, { canceledBy: userId })
          } catch (err) {
            expect(err.message).toEqual(
              `Cannot cancel order edit with status ${status}`
            )
          }
        }
      )
    })

    describe("confirm", () => {
      it("confirms an order edit", async () => {
        const id = IdMap.getId("order-edit-with-changes")
        const userId = IdMap.getId("user-id")

        await orderEditService.confirm(id, { confirmedBy: userId })

        expect(orderEditRepository.save).toHaveBeenCalledWith({
          ...orderEditWithChanges,
          confirmed_by: userId,
          confirmed_at: expect.any(Date),
        })

        expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
        expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
          OrderEditService.Events.CONFIRMED,
          { id }
        )
      })

      it("returns early in case of an already confirmed order edit", async () => {
        const id = IdMap.getId("confirmed-order-edit")
        const userId = IdMap.getId("user-id")

        const result = await orderEditService.confirm(id, {
          confirmedBy: userId,
        })

        expect(result).toEqual(expect.objectContaining({ status: "confirmed" }))

        expect(orderEditRepository.save).toHaveBeenCalledTimes(0)
        expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(0)
      })
    })
  })
})
