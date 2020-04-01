import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"
import { LineItemServiceMock } from "../../../../../services/__mocks__/line-item"

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

    it("calls CartService retrieveShippingOption", () => {
      expect(CartServiceMock.retrieveShippingOption).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.retrieveShippingOption).toHaveBeenCalledWith(
        IdMap.getId("fr-cart"),
        IdMap.getId("freeShipping")
      )
    })

    it("calls CartService addShipping", () => {
      expect(CartServiceMock.addShippingMethod).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.addShippingMethod).toHaveBeenCalledWith(
        IdMap.getId("fr-cart"),
        {
          _id: IdMap.getId("freeShipping"),
          profile_id: "default_profile",
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

    it("calls CartService retrieveShippingOption", () => {
      expect(CartServiceMock.retrieveShippingOption).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.retrieveShippingOption).toHaveBeenCalledWith(
        IdMap.getId("fr-cart"),
        IdMap.getId("freeShipping")
      )
    })

    it("calls CartService addShipping", () => {
      expect(CartServiceMock.addShippingMethod).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.addShippingMethod).toHaveBeenCalledWith(
        IdMap.getId("fr-cart"),
        {
          _id: IdMap.getId("freeShipping"),
          profile_id: "default_profile",
          data: {
            extra_id: "id",
          },
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

  describe("additional data without overwriting", () => {
    let subject

    beforeAll(async () => {
      const cartId = IdMap.getId("emptyCart")
      subject = await request(
        "POST",
        `/store/carts/${cartId}/shipping-methods`,
        {
          payload: {
            option_id: IdMap.getId("withData"),
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

    it("calls CartService retrieveShippingOption", () => {
      expect(CartServiceMock.retrieveShippingOption).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.retrieveShippingOption).toHaveBeenCalledWith(
        IdMap.getId("emptyCart"),
        IdMap.getId("withData")
      )
    })

    it("calls CartService addShipping", () => {
      expect(CartServiceMock.addShippingMethod).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.addShippingMethod).toHaveBeenCalledWith(
        IdMap.getId("emptyCart"),
        {
          _id: IdMap.getId("withData"),
          profile_id: "default_profile",
          data: {
            extra_id: "id",
            some_data: "yes",
          },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body._id).toEqual(IdMap.getId("emptyCart"))
      expect(subject.body.decorated).toEqual(true)
    })
  })
})
