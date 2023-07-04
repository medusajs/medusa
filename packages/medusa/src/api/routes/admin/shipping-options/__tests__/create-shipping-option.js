import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ShippingOptionServiceMock } from "../../../../../services/__mocks__/shipping-option"

describe("POST /admin/shipping-options", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("POST", "/admin/shipping-options", {
        payload: {
          name: "Test option",
          region_id: "testregion",
          provider_id: "test_provider",
          data: { id: "test" },
          price_type: "flat_rate",
          amount: 100,
          requirements: [
            {
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
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service create", () => {
      expect(ShippingOptionServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ShippingOptionServiceMock.create).toHaveBeenCalledWith({
        is_return: false,
        admin_only: false,
        name: "Test option",
        region_id: "testregion",
        provider_id: "test_provider",
        metadata: undefined,
        data: { id: "test" },
        profile_id: expect.any(String),
        price_type: "flat_rate",
        amount: 100,
        requirements: [
          {
            type: "min_subtotal",
            amount: 1,
          },
        ],
      })
    })
  })

  describe("fails on invalid data", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("POST", "/admin/shipping-options", {
        payload: {
          price_type: "flat_rate",
          amount: 100,
          requirements: [
            {
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
      })
    })

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })

    it("returns error", () => {
      expect(subject.body.message).toEqual(
        expect.stringContaining(`name must be a string`)
      )
    })
  })
})
