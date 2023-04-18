import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ClaimServiceMock } from "../../../../../services/__mocks__/claim"

describe("POST /admin/orders/:id/claims", () => {
  describe("successfully creates a claim", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/claims`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
          payload: {
            type: "replace",
            claim_items: [
              {
                item_id: "test-claim-item",
                quantity: 1,
              },
            ],
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls ClaimService create", () => {
      expect(ClaimServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ClaimServiceMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "replace",
          claim_items: [
            {
              item_id: "test-claim-item",
              quantity: 1,
            },
          ],
        })
      )
    })
  })

  describe("fails to create a claim when type is not known", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/claims`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
          payload: {
            type: "something",
            claim_items: [
              {
                item_id: "test-claim-item",
                quantity: 1,
              },
            ],
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("throws an error", () => {
      expect(subject.status).toEqual(400)
      expect(subject.body.message).toEqual(
        "type must be one of the following values: refund, replace"
      )
    })
  })

  describe("successfully creates a claim with a reason", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/claims`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
          payload: {
            type: "replace",
            claim_items: [
              {
                item_id: "test-claim-item",
                quantity: 1,
                reason: "production_failure",
              },
            ],
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls ClaimService create", () => {
      expect(ClaimServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ClaimServiceMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "replace",
          claim_items: [
            {
              item_id: "test-claim-item",
              quantity: 1,
              reason: "production_failure",
            },
          ],
        })
      )
    })

    describe("fails to create a claim when type is not known", () => {
      let subject

      beforeAll(async () => {
        subject = await request(
          "POST",
          `/admin/orders/${IdMap.getId("test-order")}/claims`,
          {
            adminSession: {
              jwt: {
                userId: IdMap.getId("admin_user"),
              },
            },
            payload: {
              type: "refund",
              claim_items: [
                {
                  item_id: "test-claim-item",
                  quantity: 1,
                  reason: "should_throw_error",
                },
              ],
            },
          }
        )
      })

      afterAll(() => {
        jest.clearAllMocks()
      })

      it("throws an error", () => {
        expect(subject.status).toEqual(400)
        expect(subject.body.message).toEqual(
          "reason must be one of the following values: missing_item, wrong_item, production_failure, other"
        )
      })
    })
  })
})
