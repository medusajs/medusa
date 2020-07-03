import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ShippingOptionServiceMock } from "../../../../../services/__mocks__/shipping-option"

describe("POST /admin/shipping-options", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/shipping-options", {
        payload: {
          name: "Test option",
          region_id: "testregion",
          provider_id: "test_provider",
          data: { id: "test" },
          profile_id: "test",
          price: {
            type: "flat_rate",
            amount: 100,
          },
          requirements: [
            {
              type: "min_subtotal",
              value: 1,
            },
          ],
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 200", () => {
      console.log(subject)
      expect(subject.status).toEqual(200)
    })

    it("calls service create", () => {
      expect(ShippingOptionServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ShippingOptionServiceMock.create).toHaveBeenCalledWith({
        name: "Test option",
        region_id: "testregion",
        provider_id: "test_provider",
        data: { id: "test" },
        profile_id: "test",
        price: {
          type: "flat_rate",
          amount: 100,
        },
        requirements: [
          {
            type: "min_subtotal",
            value: 1,
          },
        ],
      })
    })
  })

  describe("fails on invalid data", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/shipping-options", {
        payload: {
          price: {
            type: "flat_rate",
            amount: 100,
          },
          requirements: [
            {
              type: "min_subtotal",
              value: 1,
            },
          ],
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })

    it("returns error", () => {
      expect(subject.body.message[0].message).toEqual(`"name" is required`)
    })
  })
})
