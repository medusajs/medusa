import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"
import OrderEditingFeatureFlag from "../../../../../loaders/feature-flags/order-editing"

describe("GET /store/order-edits/:id", () => {
  describe("successfully gets an order edit", () => {
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
          flags: [OrderEditingFeatureFlag],
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
        loggedInUser: undefined,
      })
      expect(orderEditServiceMock.decorateTotals).toHaveBeenCalledTimes(1)
    })

    it("returns orderEdit", () => {
      expect(subject.body.order_edit.id).toEqual(orderEditId)
    })
  })
})
