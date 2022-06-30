import { MockManager } from "medusa-test-utils"
import CartCompletionStrategy from "../cart-completion"

const IdempotencyKeyServiceMock = {
  withTransaction: function () {
    return this
  },
  workStage: jest.fn().mockImplementation(async (key, fn) => {
    try {
      const { recovery_point, response_code, response_body } = await fn(
        MockManager
      )

      if (recovery_point) {
        return {
          key: { idempotency_key: key, recovery_point },
        }
      } else {
        return {
          key: {
            recovery_point: "finished",
            response_body,
            response_code,
          },
        }
      }
    } catch (err) {
      return { error: err }
    }
  }),
}

const toTest = [
  [
    "succeeds",
    {
      cart: {
        id: "test-cart",
        items: [],
        payment: { data: "some-data" },
        payment_session: { status: "authorized" },
        total: 1000,
        region_id: "testRegion",
      },
      idempotencyKey: {
        id: "ikey",
        idempotency_key: "ikey",
        recovery_point: "started",
      },
      validate: function (value, { cartServiceMock, orderServiceMock }) {
        expect(value.response_code).toEqual(200)
        expect(value.response_body).toEqual({
          data: expect.any(Object),
          type: "order",
        })

        expect(cartServiceMock.createTaxLines).toHaveBeenCalledTimes(1)
        expect(cartServiceMock.createTaxLines).toHaveBeenCalledWith("test-cart")

        expect(cartServiceMock.authorizePayment).toHaveBeenCalledTimes(1)
        expect(cartServiceMock.authorizePayment).toHaveBeenCalledWith(
          "test-cart",
          {
            idempotency_key: "ikey",
          }
        )

        expect(orderServiceMock.createFromCart).toHaveBeenCalledTimes(1)
        expect(orderServiceMock.createFromCart).toHaveBeenCalledWith(
          "test-cart"
        )

        expect(orderServiceMock.retrieve).toHaveBeenCalledTimes(1)
        expect(orderServiceMock.retrieve).toHaveBeenCalledWith("test-cart", {
          select: [
            "subtotal",
            "tax_total",
            "shipping_total",
            "discount_total",
            "total",
          ],
          relations: ["shipping_address", "items", "payments"],
        })
      },
    },
  ],
  [
    "returns 409",
    {
      cart: {
        id: "test-cart",
        items: [],
        completed_at: "2021-01-02",
        payment: { data: "some-data" },
        payment_session: { status: "authorized" },
        total: 1000,
        region_id: "testRegion",
      },
      idempotencyKey: {
        id: "ikey",
        idempotency_key: "ikey",
        recovery_point: "started",
      },
      validate: function (value) {
        expect(value.response_code).toEqual(409)
        expect(value.response_body).toEqual({
          code: "cart_incompatible_state",
          message: "Cart has already been completed",
          type: "not_allowed",
        })
      },
    },
  ],
  [
    "returns requires more",
    {
      cart: {
        id: "test-cart",
        items: [],
        payment: { data: "some-data" },
        payment_session: { status: "requires_more" },
        total: 1000,
        region_id: "testRegion",
      },
      idempotencyKey: {
        id: "ikey",
        idempotency_key: "ikey",
        recovery_point: "started",
      },
      validate: function (value) {
        expect(value.response_code).toEqual(200)
        expect(value.response_body).toEqual({
          data: expect.any(Object),
          payment_status: "requires_more",
          type: "cart",
        })
      },
    },
  ],
  [
    "creates swap",
    {
      cart: {
        id: "test-cart",
        type: "swap",
        items: [],
        payment: { data: "some-data" },
        payment_session: { status: "authorized" },
        total: 1000,
        region_id: "testRegion",
        metadata: { swap_id: "testswap" },
      },
      idempotencyKey: {
        id: "ikey",
        idempotency_key: "ikey",
        recovery_point: "started",
      },
      validate: function (value, { swapServiceMock }) {
        expect(value.response_code).toEqual(200)
        expect(value.response_body).toEqual({
          data: expect.any(Object),
          type: "swap",
        })

        expect(swapServiceMock.registerCartCompletion).toHaveBeenCalledTimes(1)
        expect(swapServiceMock.registerCartCompletion).toHaveBeenCalledWith(
          "testswap"
        )
      },
    },
  ],
]

describe("CartCompletionStrategy", () => {
  describe("complete", () => {
    test.each(toTest)(
      "%s",
      async (title, { cart, idempotencyKey, validate }) => {
        const cartServiceMock = {
          withTransaction: function () {
            return this
          },
          createTaxLines: jest.fn(() => Promise.resolve(cart)),
          authorizePayment: jest.fn(() => Promise.resolve(cart)),
          retrieve: jest.fn(() => Promise.resolve(cart)),
        }
        const orderServiceMock = {
          withTransaction: function () {
            return this
          },
          createFromCart: jest.fn(() => Promise.resolve(cart)),
          retrieve: jest.fn(() => Promise.resolve({})),
        }
        const swapServiceMock = {
          withTransaction: function () {
            return this
          },
          registerCartCompletion: jest.fn(() => Promise.resolve({})),
          retrieve: jest.fn(() => Promise.resolve({})),
        }
        const idempotencyKeyServiceMock = IdempotencyKeyServiceMock

        const completionStrat = new CartCompletionStrategy({
          cartService: cartServiceMock,
          idempotencyKeyService: idempotencyKeyServiceMock,
          orderService: orderServiceMock,
          swapService: swapServiceMock,
        })

        const val = await completionStrat.complete(cart.id, idempotencyKey, {})

        validate(val, {
          cartServiceMock,
          orderServiceMock,
          swapServiceMock,
          idempotencyKeyServiceMock,
        })
      }
    )
  })
})
