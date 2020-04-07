import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"

describe("POST /store/carts/:id/shipping-methods", () => {
  describe("successfully adds a shipping method", () => {
    let subject

    beforeAll(async () => {
      const cartId = IdMap.getId("fr-cart")
      subject = await request(
        "POST",
        `/store/carts/${cartId}/shipping-methods`,
        {
          payload: {
            option_id: IdMap.getId("freeShipping"),
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService addShipping", () => {
      expect(CartServiceMock.addShippingMethod).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.addShippingMethod).toHaveBeenCalledWith(
        IdMap.getId("fr-cart"),
        IdMap.getId("freeShipping"),
        {}
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body._id).toEqual(IdMap.getId("fr-cart"))
      expect(subject.body.decorated).toEqual(true)
    })
  })

  describe("successfully adds a shipping method with additional data", () => {
    let subject

    beforeAll(async () => {
      const cartId = IdMap.getId("fr-cart")
      subject = await request(
        "POST",
        `/store/carts/${cartId}/shipping-methods`,
        {
          payload: {
            option_id: IdMap.getId("freeShipping"),
            data: {
              extra_id: "id",
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService addShipping", () => {
      expect(CartServiceMock.addShippingMethod).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.addShippingMethod).toHaveBeenCalledWith(
        IdMap.getId("fr-cart"),
        IdMap.getId("freeShipping"),
        {
          extra_id: "id",
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body._id).toEqual(IdMap.getId("fr-cart"))
      expect(subject.body.decorated).toEqual(true)
    })
  })
})
