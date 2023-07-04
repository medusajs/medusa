import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"
import {
  defaultOrderEditFields,
  defaultOrderEditRelations,
} from "../../../../../types/order-edit"

describe("GET /admin/order-edits/:id", () => {
  describe("successfully gets an order edit", () => {
    const orderEditId = IdMap.getId("testCreatedOrder")
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/order-edits/${orderEditId}`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService retrieve", () => {
      expect(orderEditServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.retrieve).toHaveBeenCalledWith(orderEditId, {
        select: defaultOrderEditFields,
        relations: defaultOrderEditRelations,
      })
      expect(orderEditServiceMock.decorateTotals).toHaveBeenCalledTimes(1)
    })

    it("returns order", () => {
      expect(subject.body.order_edit.id).toEqual(orderEditId)
    })
  })
})
