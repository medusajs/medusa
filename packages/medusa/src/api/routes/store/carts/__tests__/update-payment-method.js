import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"
import { LineItemServiceMock } from "../../../../../services/__mocks__/line-item"

describe("POST /store/carts/:id/payment-method", () => {
  describe("successfully sets the payment method", () => {
    let subject

    beforeAll(async () => {
      const cartId = IdMap.getId("cartWithPaySessions")
      subject = await request("POST", `/store/carts/${cartId}/payment-method`, {
        payload: {
          provider_id: "default_provider",
          data: {
            money_id: "success",
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService setPaymentMethod", () => {
      expect(CartServiceMock.setPaymentMethod).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.setPaymentMethod).toHaveBeenCalledWith(
        IdMap.getId("cartWithPaySessions"),
        {
          provider_id: "default_provider",
          data: {
            money_id: "success",
          },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.cart.id).toEqual(IdMap.getId("cartWithPaySessions"))
    })
  })
})
