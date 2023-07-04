import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { SwapServiceMock } from "../../../../../services/__mocks__/swap"

describe("POST /admin/orders/:id/swaps/:swap_id/cancel", () => {
  describe("successfully cancels a claim", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/swaps/${IdMap.getId(
          "test-swap"
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

    it("calls SwapService cancel", () => {
      expect(SwapServiceMock.cancel).toHaveBeenCalledTimes(1)
      expect(SwapServiceMock.cancel).toHaveBeenCalledWith(
        IdMap.getId("test-swap")
      )
    })
  })

  describe("Trying to cancel a claim unrelated to the order fails", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order2")}/swaps/${IdMap.getId(
          "test-swap"
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
