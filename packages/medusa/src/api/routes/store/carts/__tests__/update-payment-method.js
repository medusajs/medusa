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
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService retrievePaymentSession", () => {
      expect(CartServiceMock.retrievePaymentSession).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.retrievePaymentSession).toHaveBeenCalledWith(
        IdMap.getId("cartWithPaySessions"),
        "default_provider"
      )
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
      expect(subject.body.cart._id).toEqual(IdMap.getId("cartWithPaySessions"))
      expect(subject.body.cart.decorated).toEqual(true)
    })
  })

  describe("fails when pay session not authorized", () => {
    let subject

    beforeAll(async () => {
      const cartId = IdMap.getId("cartWithPaySessions")
      subject = await request("POST", `/store/carts/${cartId}/payment-method`, {
        payload: {
          provider_id: "nono",
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService retrievePaymentSession", () => {
      expect(CartServiceMock.retrievePaymentSession).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.retrievePaymentSession).toHaveBeenCalledWith(
        IdMap.getId("cartWithPaySessions"),
        "nono"
      )
    })

    it("calls CartService setPaymentMethod", () => {
      expect(CartServiceMock.setPaymentMethod).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.setPaymentMethod).toHaveBeenCalledWith(
        IdMap.getId("cartWithPaySessions"),
        {
          provider_id: "nono",
          data: {
            money_id: "fail",
          },
        }
      )
    })

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })

    it("returns the cart", () => {
      expect(subject.body.message).toEqual("Not allowed")
    })
  })
})
