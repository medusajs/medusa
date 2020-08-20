import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"
import { carts } from "../../../../../services/__mocks__/cart"

describe("POST /store/orders", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/store/orders", {
        payload: {
          cartId: IdMap.getId("fr-cart"),
        },
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service create", () => {
      expect(OrderServiceMock.createFromCart).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.createFromCart).toHaveBeenCalledWith(carts.frCart)
    })
  })
})
