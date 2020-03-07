import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"

describe("POST /store/carts/:id/payment-sessions", () => {
  describe("creates payment sessions", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/carts/${IdMap.getId("emptyCart")}/payment-sessions`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls Cart service set payment sessions", () => {
      expect(CartServiceMock.setPaymentSessions).toHaveBeenCalledTimes(1)
    })

    it("returns 201", () => {
      expect(subject.status).toEqual(201)
    })

    it("returns the cart", () => {
      expect(subject.body._id).toEqual(IdMap.getId("emptyCart"))
      expect(subject.body.decorated).toEqual(true)
    })
  })
})
