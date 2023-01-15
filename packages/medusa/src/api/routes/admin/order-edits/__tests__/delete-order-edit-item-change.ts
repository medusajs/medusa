import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"

describe("DELETE /admin/order-edits/:id/changes/:change_id", () => {
  describe("deletes an order edit item change", () => {
    const orderEditId = IdMap.getId("test-order-edit")
    const orderEditItemChangeId = IdMap.getId("test-order-edit-item-change")
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/order-edits/${orderEditId}/changes/${orderEditItemChangeId}`,
        {
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

    it("calls orderEditService delete", () => {
      expect(orderEditServiceMock.deleteItemChange).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.deleteItemChange).toHaveBeenCalledWith(
        orderEditId,
        orderEditItemChangeId
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns delete result", () => {
      expect(subject.body).toEqual({
        id: orderEditItemChangeId,
        object: "item_change",
        deleted: true,
      })
    })
  })
})
