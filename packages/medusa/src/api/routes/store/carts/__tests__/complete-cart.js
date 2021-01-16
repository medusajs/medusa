import { IdMap } from "medusa-test-utils"
import { defaultFields, defaultRelations } from ".."
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
        `/store/carts/${IdMap.getId("emptyCart")}/complete-cart`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("Call CartService update", () => {
      expect(CartServiceMock.update).toHaveBeenCalledTimes(1)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns cart", () => {
      expect(subject.body.cart.id).toEqual(IdMap.getId("emptyCart"))
    })
  })
})
