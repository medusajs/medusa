import { IdMap } from "medusa-test-utils"
import { defaultStoreCartFields, defaultStoreCartRelations } from ".."
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

    it("Call CartService update", () => {
      expect(CartServiceMock.update).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("emptyCart"),
        {
          region_id: IdMap.getId("testRegion"),
          email: "test@admin.com",
          shipping_address: address,
          billing_address: address,
          discounts: [
            {
              code: "TESTCODE",
            },
          ],
        }
      )
    })

    it("calls get product from productService", () => {
      expect(CartServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.retrieveWithTotals).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("emptyCart"),
        {
          relations: ["payment_sessions", "shipping_methods"],
        }
      )
      expect(CartServiceMock.retrieveWithTotals).toHaveBeenCalledWith(
        IdMap.getId("emptyCart"),
        {
          relations: defaultStoreCartRelations,
          select: defaultStoreCartFields,
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns cart", () => {
      expect(subject.body.cart.id).toEqual(IdMap.getId("emptyCart"))
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

    it("returns 404", () => {
      expect(subject.status).toEqual(404)
    })
  })
})
