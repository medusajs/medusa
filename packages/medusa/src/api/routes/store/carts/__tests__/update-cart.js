import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"

describe("POST /store/carts/:id", () => {
  describe("successfully updates all fields", () => {
    let subject
    const address = {
      first_name: "LeBron",
      last_name: "James",
      country_code: "US",
      address_1: "24 Dunk Dr",
      address_2: "Ball Ave",
      city: "Los Angeles",
      province: "CA",
      postal_code: "91092",
      phone: "+1 (222) 333 4444",
    }

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/carts/${IdMap.getId("emptyCart")}`,
        {
          payload: {
            region_id: IdMap.getId("testRegion"),
            email: "test@admin.com",
            shipping_address: address,
            billing_address: address,
            discounts: [
              {
                code: "TESTCODE",
              },
            ],
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("sets new region", () => {
      expect(CartServiceMock.setRegion).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.setRegion).toHaveBeenCalledWith(
        IdMap.getId("emptyCart"),
        IdMap.getId("testRegion"),
        undefined
      )
    })

    it("updates email", () => {
      expect(CartServiceMock.updateEmail).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.updateEmail).toHaveBeenCalledWith(
        IdMap.getId("emptyCart"),
        "test@admin.com"
      )
    })

    it("updates shipping address", () => {
      expect(CartServiceMock.updateShippingAddress).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.updateShippingAddress).toHaveBeenCalledWith(
        IdMap.getId("emptyCart"),
        address
      )
    })

    it("updates billing address", () => {
      expect(CartServiceMock.updateBillingAddress).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.updateBillingAddress).toHaveBeenCalledWith(
        IdMap.getId("emptyCart"),
        address
      )
    })

    it("applies promo code", () => {
      expect(CartServiceMock.applyDiscount).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.applyDiscount).toHaveBeenCalledWith(
        IdMap.getId("emptyCart"),
        "TESTCODE"
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns cart", () => {
      expect(subject.body.cart._id).toEqual(IdMap.getId("emptyCart"))
      expect(subject.body.cart.decorated).toEqual(true)
    })
  })

  describe("it bubbles errors", () => {
    let subject
    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/carts/${IdMap.getId("emptyCart")}`,
        {
          payload: {
            region_id: IdMap.getId("fail"),
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("returns 404", () => {
      expect(subject.status).toEqual(404)
      expect(subject.body.message).toEqual("Region not found")
    })
  })

  describe("returns 404 on undefined cart", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/store/carts/none`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls get product from productSerice", () => {
      expect(CartServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.retrieve).toHaveBeenCalledWith("none")
    })

    it("returns 404", () => {
      expect(subject.status).toEqual(404)
    })
  })
})
