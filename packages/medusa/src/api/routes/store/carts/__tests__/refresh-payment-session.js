import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"

describe("POST /store/carts/:id/payment-session/update", () => {
  describe("successfully updates the payment session", () => {
    let subject

    beforeAll(async () => {
      const cartId = IdMap.getId("cartWithPaySessions")
      subject = await request(
        "POST",
        `/store/carts/${cartId}/payment-sessions/stripe/refresh`,
        {}
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService updatePaymentSession", () => {
      expect(CartServiceMock.refreshPaymentSession).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.refreshPaymentSession).toHaveBeenCalledWith(
        IdMap.getId("cartWithPaySessions"),
        "stripe"
      )
    })

    it("calls CartService retrive", () => {
      expect(CartServiceMock.retrieveWithTotals).toHaveBeenCalledTimes(1)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.cart.id).toEqual(IdMap.getId("cartWithPaySessions"))
    })
  })
})
