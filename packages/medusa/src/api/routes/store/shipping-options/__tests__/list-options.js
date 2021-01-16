import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { carts, CartServiceMock } from "../../../../../services/__mocks__/cart"
import { ShippingProfileServiceMock } from "../../../../../services/__mocks__/shipping-profile"

describe("GET /store/shipping-options", () => {
  describe("retrieves shipping options by product ids", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/store/shipping-options?product_ids=1,2,3&region_id=test-region`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls ShippingProfileService fetchOptionsByProductIds", () => {
      expect(
        ShippingProfileServiceMock.fetchOptionsByProductIds
      ).toHaveBeenCalledTimes(1)
      expect(
        ShippingProfileServiceMock.fetchOptionsByProductIds
      ).toHaveBeenCalledWith(["1", "2", "3"], { region_id: "test-region" })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the shippingOptions", () => {
      expect(subject.body.shipping_options[0].id).toEqual(
        IdMap.getId("cartShippingOption")
      )
    })
  })
})
