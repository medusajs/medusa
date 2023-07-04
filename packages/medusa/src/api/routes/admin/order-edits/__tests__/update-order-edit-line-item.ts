import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"

describe("POST /admin/order-edits/:id/items/:item_id", () => {
  describe("update line item and create an item change of type update", () => {
    const orderEditId = IdMap.getId("test-order-edit")
    const lineItemId = IdMap.getId("line-item")
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/order-edits/${orderEditId}/items/${lineItemId}`,
        {
          payload: {
            quantity: 3,
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderEditService updateLineItem", () => {
      expect(orderEditServiceMock.updateLineItem).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.updateLineItem).toHaveBeenCalledWith(
        orderEditId,
        lineItemId,
        { quantity: 3 }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })
  })
})
