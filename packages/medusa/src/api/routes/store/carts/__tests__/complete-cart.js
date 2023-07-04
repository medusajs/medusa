import { request } from "../../../../../helpers/test-request"
import { CompletionStrategyMock } from "../../../../../strategies/__mocks__/cart-completion"

describe("POST /store/carts/:id/complete", () => {
  describe("successfully calls completion strategy - Legacy Endpoint", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/store/carts/test-cart/complete-cart`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls completion strat", () => {
      expect(CompletionStrategyMock.complete).toHaveBeenCalledTimes(1)
      expect(CompletionStrategyMock.complete).toHaveBeenCalledWith(
        "test-cart",
        { idempotency_key: "testkey", recovery_point: "started" },
        undefined
      )
    })

    it("responds correctly", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body).toEqual({})
    })
  })

  describe("successfully calls completion strategy", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/store/carts/test-cart/complete`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls completion strat", () => {
      expect(CompletionStrategyMock.complete).toHaveBeenCalledTimes(1)
      expect(CompletionStrategyMock.complete).toHaveBeenCalledWith(
        "test-cart",
        { idempotency_key: "testkey", recovery_point: "started" },
        undefined
      )
    })

    it("responds correctly", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body).toEqual({})
    })
  })
})
