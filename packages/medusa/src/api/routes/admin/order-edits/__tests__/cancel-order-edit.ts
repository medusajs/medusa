import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"

describe("POST /admin/order-edits/:id/cancel", () => {
  describe("cancels an order edit", () => {
    const orderEditId = IdMap.getId("testCancelOrderEdit")
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/order-edits/${orderEditId}/cancel`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          }
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService cancel", () => {
      expect(orderEditServiceMock.cancel).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.cancel).toHaveBeenCalledWith(orderEditId, {
        canceledBy: IdMap.getId("admin_user"),
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns cancel result", () => {
      expect(subject.body.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          canceled_at: expect.any(String),
          status: "canceled",
        })
      )
    })
  })
})
