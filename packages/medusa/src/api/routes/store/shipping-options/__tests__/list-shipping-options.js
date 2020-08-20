import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { carts, CartServiceMock } from "../../../../../services/__mocks__/cart"
import { ShippingProfileServiceMock } from "../../../../../services/__mocks__/shipping-profile"

describe("GET /store/shipping-options", () => {
  describe("retrieves shipping options", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/store/shipping-options/${IdMap.getId("emptyCart")}`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService retrieve", () => {
      expect(CartServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("emptyCart")
      )
    })

    it("calls ShippingProfileService fetchCartOptions", () => {
      expect(ShippingProfileServiceMock.fetchCartOptions).toHaveBeenCalledTimes(
        1
      )
      expect(ShippingProfileServiceMock.fetchCartOptions).toHaveBeenCalledWith(
        carts.emptyCart
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.shipping_options[0]._id).toEqual(
        IdMap.getId("cartShippingOption")
      )
    })
  })
})
