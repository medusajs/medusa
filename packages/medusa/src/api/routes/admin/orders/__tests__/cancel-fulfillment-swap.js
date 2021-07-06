import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { FulfillmentServiceMock } from "../../../../../services/__mocks__/fulfillment"

describe("POST /admin/orders/:id/swaps/:swap_id/fulfillments/:fulfillment_id/cancel", () => {
  describe("successfully cancels a fulfillment", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/swaps/${IdMap.getId(
          "test-swap"
        )}/fulfillments/${IdMap.getId("swap-fulfillment")}/cancel`,
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

    it("calls FulfillmentService cancel", () => {
      expect(FulfillmentServiceMock.cancel).toHaveBeenCalledTimes(1)
      expect(FulfillmentServiceMock.cancel).toHaveBeenCalledWith(
        IdMap.getId("swap-fulfillment")
      )
    })
  })

  describe("Trying to cancel a fulfillment unrelated to the swap fails", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/swaps/${IdMap.getId(
          "swap-fulfillment2"
        )}/fulfillments/${IdMap.getId("swap-fulfillment")}/cancel`,
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

  describe("Trying to cancel a fulfillment, where swap and order are unrelated", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order2")}/swaps/${IdMap.getId(
          "test-swap"
        )}/fulfillments/${IdMap.getId("swap-fulfillment")}/cancel`,
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
