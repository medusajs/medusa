import { MockManager } from "medusa-test-utils"
import CartCompletionStrategy from "../cart-completion"
import { newTotalsServiceMock } from "../../services/__mocks__/new-totals"
import { ProductVariantInventoryServiceMock } from "../../services/__mocks__/product-variant-inventory"

const IdempotencyKeyServiceMock = {
  withTransaction: function () {
    return this
  },
  workStage: jest.fn().mockImplementation(async (key, fn) => {
    const { recovery_point, response_code, response_body } = await fn(
      MockManager
    )

    const data = {
      recovery_point: recovery_point ?? "finished",
    }

    if (!recovery_point) {
      data.response_body = response_body
      data.response_code = response_code
    }

    return {
      ...data,
      idempotency_key: key,
    }
  }),
  update: jest.fn().mockImplementation((key, data) => {
    return data
  }),
}

const toTest = [
  [
    "succeeds",
    {
      cart: {
        id: "test-cart",
        items: [{ id: "item", tax_lines: [] }],
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

        expect(cartServiceMock.createTaxLines).toHaveBeenCalledTimes(3)
        expect(cartServiceMock.createTaxLines).toHaveBeenCalledWith(
          expect.objectContaining({ id: "test-cart" })
        )

        expect(cartServiceMock.authorizePayment).toHaveBeenCalledTimes(1)
        expect(cartServiceMock.authorizePayment).toHaveBeenCalledWith(
          "test-cart",
          {
            cart_id: "test-cart",
            idempotency_key: {
              idempotency_key: "ikey",
              recovery_point: "tax_lines_created",
            },
          }
        )

        expect(orderServiceMock.createFromCart).toHaveBeenCalledTimes(1)
        expect(orderServiceMock.createFromCart).toHaveBeenCalledWith(
          expect.objectContaining({ id: "test-cart" })
        )

        expect(orderServiceMock.retrieveWithTotals).toHaveBeenCalledTimes(1)
        expect(orderServiceMock.retrieveWithTotals).toHaveBeenCalledWith(
          "test-cart",
          {
            relations: ["shipping_address", "items", "payments"],
          }
        )
      },
    },
  ],
  [
    "returns 409",
    {
      cart: {
        id: "test-cart",
        items: [{ id: "item", tax_lines: [] }],
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
        items: [{ id: "item", tax_lines: [] }],
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
        items: [{ id: "item", tax_lines: [] }],
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
          createTaxLines: jest.fn(() => {
            cart.items[0].tax_lines = [
              {
                id: "tax_lines",
              },
            ]
            return Promise.resolve(cart)
          }),
          deleteTaxLines: jest.fn(() => Promise.resolve(cart)),
          authorizePayment: jest.fn(() => Promise.resolve(cart)),
          retrieve: jest.fn(() => Promise.resolve(cart)),
          retrieveWithTotals: jest.fn(() => Promise.resolve(cart)),
          newTotalsService: newTotalsServiceMock,
        }
        const orderServiceMock = {
          withTransaction: function () {
            return this
          },
          createFromCart: jest.fn(() => Promise.resolve(cart)),
          retrieve: jest.fn(() => Promise.resolve({})),
          retrieveWithTotals: jest.fn(() => Promise.resolve({})),
          newTotalsService: newTotalsServiceMock,
        }
        const swapServiceMock = {
          withTransaction: function () {
            return this
          },
          retrieveByCartId: jest.fn((id) =>
            Promise.resolve({ id, allow_backorder: true })
          ),
          registerCartCompletion: jest.fn(() => Promise.resolve({})),
          retrieve: jest.fn(() => Promise.resolve({})),
        }
        const idempotencyKeyServiceMock = IdempotencyKeyServiceMock

        const completionStrat = new CartCompletionStrategy({
          productVariantInventoryService: ProductVariantInventoryServiceMock,
          cartService: cartServiceMock,
          idempotencyKeyService: idempotencyKeyServiceMock,
          orderService: orderServiceMock,
          swapService: swapServiceMock,
          manager: MockManager,
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
