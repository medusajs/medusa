import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ShippingOptionServiceMock } from "../../../../../services/__mocks__/shipping-option"

describe("POST /admin/shipping-options", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/shipping-options/${IdMap.getId("validId")}`,
        {
          payload: {
            name: "Test option",
            amount: 100,
            requirements: [
              {
                id: "yes",
                type: "min_subtotal",
                amount: 1,
              },
            ],
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service method", () => {
      expect(ShippingOptionServiceMock.update).toHaveBeenCalledTimes(1)
      expect(ShippingOptionServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("validId"),
        {
          name: "Test option",
          amount: 100,
          requirements: [
            {
              id: "yes",
              type: "min_subtotal",
              amount: 1,
            },
          ],
        }
      )
    })
  })
})
