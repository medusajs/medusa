import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"

describe("GET /store/carts", () => {
  describe("successfully gets a cart", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/store/carts/${IdMap.getId("emptyCart")}`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls retrieve from CartService", () => {
      expect(CartServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.retrieveWithTotals).toHaveBeenCalledTimes(1)
    })

    it("returns cart", () => {
      expect(subject.body.cart.id).toEqual(IdMap.getId("emptyCart"))
    })

    it("returns 200 status", () => {
      expect(subject.status).toEqual(200)
    })
  })

  describe("returns 404 on undefined cart", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/store/carts/none`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls get product from productSerice", () => {
      expect(CartServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.retrieve).toHaveBeenCalledWith("none", {
        select: ["id", "customer_id"],
      })
    })

    it("returns 404 status", () => {
      expect(subject.status).toEqual(404)
    })
  })
})
