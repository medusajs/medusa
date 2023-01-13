import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"
import {
  defaultStoreOrderEditFields,
  defaultStoreOrderEditRelations
} from "../../../../../types/order-edit"

describe("GET /store/order-edits/:id", () => {
  describe("successfully gets an order edit", () => {
    const orderEditId = IdMap.getId("testCreatedOrder")
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/store/order-edits/${orderEditId}`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService retrieve", () => {
      expect(orderEditServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.retrieve).toHaveBeenCalledWith(orderEditId, {
        select: defaultStoreOrderEditFields,
        relations: defaultStoreOrderEditRelations,
      })
      expect(orderEditServiceMock.decorateTotals).toHaveBeenCalledTimes(1)
    })

    it("returns order", () => {
      expect(subject.body.order_edit.id).toEqual(orderEditId)
    })
  })
})
