import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import { In } from "typeorm"
import EventBusService from "../event-bus"
import {
  LineItemService,
  OrderEditItemChangeService,
  TaxProviderService
} from "../index"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import { LineItemServiceMock } from "../__mocks__/line-item"

const taxProviderServiceMock = {
  withTransaction: function () {
    return this
  },
  clearLineItemsTaxLines: jest.fn().mockImplementation(() => Promise.resolve()),
}

describe("OrderEditItemChangeService", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const orderItemChangeRepository = MockRepository({
    delete: jest.fn().mockImplementation(() => {
      return Promise.resolve()
    }),
    find: jest.fn().mockImplementation((conditions) => {
      return Promise.resolve(
        conditions.where?.id?.value?.map((id) => ({
          id,
          line_item_id: "li_" + id,
        }))
      )
    }),
  })

  const orderEditItemChangeService = new OrderEditItemChangeService({
    manager: MockManager,
    orderItemChangeRepository,
    eventBusService: EventBusServiceMock as unknown as EventBusService,
    lineItemService: LineItemServiceMock as unknown as LineItemService,
    taxProviderService: taxProviderServiceMock as unknown as TaxProviderService,
  })

  it("should remove a item change", async () => {
    const itemChangeId = IdMap.getId("order-edit-item-change-1")
    await orderEditItemChangeService.delete(itemChangeId)

    expect(orderItemChangeRepository.delete).toHaveBeenCalledTimes(1)
    expect(orderItemChangeRepository.delete).toHaveBeenCalledWith({
      id: In([itemChangeId]),
    })

    expect(taxProviderServiceMock.clearLineItemsTaxLines).toHaveBeenCalledTimes(
      1
    )
    expect(taxProviderServiceMock.clearLineItemsTaxLines).toHaveBeenCalledWith([
      "li_" + itemChangeId,
    ])

    expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
    expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
      OrderEditItemChangeService.Events.DELETED,
      { ids: [itemChangeId] }
    )
  })
})
