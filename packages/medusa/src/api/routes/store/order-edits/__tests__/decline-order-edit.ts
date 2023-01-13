import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"

describe("GET /store/order-edits/:id/decline", () => {
  describe("successfully decline an order edit", () => {
    const orderEditId = IdMap.getId("testDeclineOrderEdit")
    let subject

    const payload = {
      declined_reason: "test",
    }

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/order-edits/${orderEditId}/decline`,
        {
          payload,
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService decline", () => {
      expect(orderEditServiceMock.decline).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.decline).toHaveBeenCalledWith(orderEditId, {
        declinedReason: "test",
        loggedInUserId: undefined,
      })
      expect(orderEditServiceMock.decorateTotals).toHaveBeenCalledTimes(1)
    })

    it("returns orderEdit", () => {
      expect(subject.body.order_edit.id).toEqual(orderEditId)
    })
  })
})
