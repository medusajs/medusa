import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"

import OrderEditingFeatureFlag from "../../../../../loaders/feature-flags/order-editing"

describe("GET /admin/order-edits/:id", () => {
  describe("successfully requests an order edit confirmation", () => {
    const orderEditId = IdMap.getId("testRequestOrder")
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/order-edits/${orderEditId}/request`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
          flags: [OrderEditingFeatureFlag],
          payload: {
            payment_collection_description: "PayCol description",
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderEditService requestConfirmation", () => {
      expect(orderEditServiceMock.requestConfirmation).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.requestConfirmation).toHaveBeenCalledWith(
        orderEditId,
        { loggedInUserId: IdMap.getId("admin_user") }
      )

      expect(orderEditServiceMock.update).toHaveBeenCalledTimes(1)
    })

    it("returns updated orderEdit", () => {
      expect(subject.body.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          requested_at: expect.any(String),
          requested_by: IdMap.getId("admin_user"),
        })
      )
    })
  })
})
