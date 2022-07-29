import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ClaimServiceMock } from "../../../../../services/__mocks__/claim"

describe("POST /admin/orders/:id/claims/:claim_id/fulfillments/:fulfillment_id/cancel", () => {
  describe("successfully cancels a fulfillment", () => {
    beforeAll(async () => {
      await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/claims/${IdMap.getId(
          "test-claim"
        )}/fulfillments/${IdMap.getId("claim-fulfillment")}/cancel`,
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

    it("calls claimService cancelFulfillment", () => {
      expect(ClaimServiceMock.cancelFulfillment).toHaveBeenCalledTimes(1)
      expect(ClaimServiceMock.cancelFulfillment).toHaveBeenCalledWith(
        IdMap.getId("claim-fulfillment")
      )
    })
  })

  describe("Trying to cancel a fulfillment unrelated to the claim fails", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/claims/${IdMap.getId(
          "claim-fulfillment2"
        )}/fulfillments/${IdMap.getId("claim-fulfillment")}/cancel`,
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

    it("returns error", () => {
      expect(subject.status).toEqual(404)
    })
  })

  describe("Trying to cancel a fulfillment, where claim and order are unrelated", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order2")}/claims/${IdMap.getId(
          "test-claim"
        )}/fulfillments/${IdMap.getId("claim-fulfillment")}/cancel`,
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

    it("returns error", () => {
      expect(subject.status).toEqual(404)
    })
  })
})
