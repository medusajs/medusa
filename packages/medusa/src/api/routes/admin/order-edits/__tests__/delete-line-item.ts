import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"

describe("DELETE /admin/order-edits/:id/items/:item_id", () => {
  describe("deletes a line item", () => {
    const lineItemId = IdMap.getId("testLineItem")
    const orderEditId = IdMap.getId("testCreatedOrder")
    let subject

    beforeAll(async () => {
      subject = await request("DELETE", `/admin/order-edits/${orderEditId}/items/${lineItemId}`, {
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

    it("calls orderService removeLineItem", () => {
      expect(orderEditServiceMock.removeLineItem).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.removeLineItem).toHaveBeenCalledWith(orderEditId, lineItemId)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns retrieve result", () => {
      expect(subject.body.order_edit).toEqual(expect.objectContaining({
        id: orderEditId, 
      }))
    })
  })
})
