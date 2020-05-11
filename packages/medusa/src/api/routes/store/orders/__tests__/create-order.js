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
      expect(OrderServiceMock.create).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.create).toHaveBeenCalledWith(carts.frCart)
    })
  })
})
