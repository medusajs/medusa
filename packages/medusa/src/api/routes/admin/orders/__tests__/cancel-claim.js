import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ClaimServiceMock } from "../../../../../services/__mocks__/claim"

describe("POST /admin/orders/:id/claims/:claim_id/cancel", () => {
  describe("successfully cancels a claim", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/claims/${IdMap.getId(
          "test-claim"
        )}/cancel`,
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

    it("calls ClaimService cancel", () => {
      expect(ClaimServiceMock.cancel).toHaveBeenCalledTimes(1)
      expect(ClaimServiceMock.cancel).toHaveBeenCalledWith(
        IdMap.getId("test-claim")
      )
    })
  })

  describe("Trying to cancel a claim unrelated to the order fails", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order2")}/claims/${IdMap.getId(
          "test-claim"
        )}/cancel`,
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
