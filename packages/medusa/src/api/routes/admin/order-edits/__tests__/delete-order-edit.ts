import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"

describe("DELETE /admin/order-edits/:id", () => {
  describe("deletes an order edit", () => {
    const orderEditId = IdMap.getId("test-order-edit")
    let subject

    beforeAll(async () => {
      subject = await request("DELETE", `/admin/order-edits/${orderEditId}`, {
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

    it("calls orderEditService delete", () => {
      expect(orderEditServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.delete).toHaveBeenCalledWith(orderEditId)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns delete result", () => {
      expect(subject.body).toEqual({
        id: orderEditId,
        object: "order_edit",
        deleted: true,
      })
    })
  })
})
