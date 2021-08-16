import { IdMap } from "medusa-test-utils"
import { defaultFields, defaultRelations } from ".."
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"
import { SwapServiceMock } from "../../../../../services/__mocks__/swap"

describe("POST /store/carts/:id", () => {
  describe("successfully completes a normal cart", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/carts/${IdMap.getId("test-cart")}/complete-cart`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("Call CartService authorizePayment", () => {
      expect(CartServiceMock.authorizePayment).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.authorizePayment).toHaveBeenCalledWith(
        IdMap.getId("test-cart"),
        { idempotency_key: "testkey" }
      )
    })

    it("Call OrderService createFromCart", () => {
      expect(OrderServiceMock.createFromCart).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.createFromCart).toHaveBeenCalledWith(
        IdMap.getId("test-cart")
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the created order", () => {
      expect(subject.body.data.id).toEqual(IdMap.getId("test-order"))
    })
  })

  describe("successfully completes a swap cart", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/carts/${IdMap.getId("swap-cart")}/complete-cart`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("Call CartService authorizePayment", () => {
      expect(CartServiceMock.authorizePayment).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.authorizePayment).toHaveBeenCalledWith(
        IdMap.getId("swap-cart"),
        { idempotency_key: "testkey" }
      )
    })

    it("Call SwapService registerCartCompletion", () => {
      expect(SwapServiceMock.registerCartCompletion).toHaveBeenCalledTimes(1)
      expect(SwapServiceMock.registerCartCompletion).toHaveBeenCalledWith(
        "test-swap"
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the created order", () => {
      expect(subject.body.data.id).toEqual("test-swap")
    })
  })

  describe("returns early if payment requires more work", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/carts/${IdMap.getId("test-cart2")}/complete-cart`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("Call CartService authorizePayment", () => {
      expect(CartServiceMock.authorizePayment).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.authorizePayment).toHaveBeenCalledWith(
        IdMap.getId("test-cart2"),
        { idempotency_key: "testkey" }
      )
    })

    it("Call CartService retrieve 1 time", () => {
      expect(CartServiceMock.retrieve).toHaveBeenCalledTimes(1)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the created order", () => {
      expect(subject.body.data.id).toEqual(IdMap.getId("test-cart2"))
      expect(subject.body.data.payment_session.status).toEqual("requires_more")
    })
  })
})
