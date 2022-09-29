import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"
import OrderEditingFeatureFlag from "../../../../../loaders/feature-flags/order-editing"

describe("GET /store/order-edits/:id/complete", () => {
  describe("successfully complete an order edit", () => {
    const orderEditId = IdMap.getId("testCompleteOrderEdit")
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/order-edits/${orderEditId}/complete`,
        {
          flags: [OrderEditingFeatureFlag],
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService complete", () => {
      expect(orderEditServiceMock.complete).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.complete).toHaveBeenCalledWith(orderEditId, {
        loggedInUserId: undefined,
      })
      expect(orderEditServiceMock.decorateTotals).toHaveBeenCalledTimes(1)
    })

    it("returns orderEdit", () => {
      expect(subject.body.order_edit.id).toEqual(orderEditId)
    })
  })
})
