import { validateCartPaymentAmount } from "../validate-cart-payment-amount"

const buildCart = (overrides: Record<string, any> = {}): any => ({
  id: "cart_1",
  currency_code: "usd",
  total: 100,
  credit_line_total: 0,
  completed_at: null,
  payment_collection: {
    id: "paycol_1",
    payment_sessions: [{ id: "payses_1", status: "pending", amount: 100 }],
  },
  ...overrides,
})

const withSessions = (
  sessions: any[],
  overrides: Record<string, any> = {}
): any =>
  buildCart({
    payment_collection: { id: "paycol_1", payment_sessions: sessions },
    ...overrides,
  })

describe("validateCartPaymentAmount", () => {
  it("passes when the session amount matches the cart total", () => {
    expect(() => validateCartPaymentAmount({ cart: buildCart() })).not.toThrow()
  })

  it("throws when the cart total changed after the payment collection was sized", () => {
    expect(() =>
      validateCartPaymentAmount({ cart: buildCart({ total: 78.5 }) })
    ).toThrow(
      "Payment session payses_1 has an amount of 100, but the cart's total is 78.5"
    )
  })

  it("throws on both over- and under-authorization", () => {
    expect(() =>
      validateCartPaymentAmount({
        cart: withSessions([
          { id: "payses_1", status: "pending", amount: 121.35 },
        ]),
      })
    ).toThrow("has an amount of 121.35")

    expect(() =>
      validateCartPaymentAmount({
        cart: withSessions([{ id: "payses_1", status: "pending", amount: 99 }]),
      })
    ).toThrow("has an amount of 99")
  })

  describe("epsilon tolerance", () => {
    it("tolerates a difference up to the currency's epsilon (usd, 0.01)", () => {
      for (const amount of [100.005, 100.01, 99.99]) {
        expect(() =>
          validateCartPaymentAmount({
            cart: withSessions([{ id: "payses_1", status: "pending", amount }]),
          })
        ).not.toThrow()
      }
    })

    it("throws once the difference exceeds the epsilon (usd, 0.01)", () => {
      expect(() =>
        validateCartPaymentAmount({
          cart: withSessions([
            { id: "payses_1", status: "pending", amount: 100.02 },
          ]),
        })
      ).toThrow("has an amount of 100.02")
    })

    it("uses the currency's decimal digits, so a zero-decimal currency tolerates 1", () => {
      expect(() =>
        validateCartPaymentAmount({
          cart: withSessions(
            [{ id: "payses_1", status: "pending", amount: 101 }],
            { currency_code: "jpy" }
          ),
        })
      ).not.toThrow()

      expect(() =>
        validateCartPaymentAmount({
          cart: withSessions(
            [{ id: "payses_1", status: "pending", amount: 102 }],
            { currency_code: "jpy" }
          ),
        })
      ).toThrow("has an amount of 102")
    })
  })

  describe("skipped cases", () => {
    it("skips a cart that was already completed, so an idempotent retry doesn't start failing", () => {
      expect(() =>
        validateCartPaymentAmount({
          cart: buildCart({ total: 78.5, completed_at: new Date() }),
        })
      ).not.toThrow()
    })

    it("skips a zero-total cart covered by credit lines", () => {
      expect(() =>
        validateCartPaymentAmount({
          cart: buildCart({ total: 0, credit_line_total: 100 }),
        })
      ).not.toThrow()

      expect(() =>
        validateCartPaymentAmount({
          cart: buildCart({ total: -5, credit_line_total: 100 }),
        })
      ).not.toThrow()
    })

    it("leaves a cart with no processable session to validateCartPaymentsStep", () => {
      expect(() =>
        validateCartPaymentAmount({
          cart: withSessions([
            { id: "payses_1", status: "canceled", amount: 1 },
          ]),
        })
      ).not.toThrow()
    })

    it("leaves a cart without a payment collection to validateCartPaymentsStep", () => {
      expect(() =>
        validateCartPaymentAmount({
          cart: buildCart({ payment_collection: undefined }),
        })
      ).not.toThrow()
    })

    it("skips non-finite amounts on either side", () => {
      expect(() =>
        validateCartPaymentAmount({
          cart: withSessions([
            { id: "payses_1", status: "pending", amount: undefined },
          ]),
        })
      ).not.toThrow()

      expect(() =>
        validateCartPaymentAmount({ cart: buildCart({ total: undefined }) })
      ).not.toThrow()
    })
  })

  describe("multiple sessions", () => {
    it("passes when every processable session matches", () => {
      expect(() =>
        validateCartPaymentAmount({
          cart: withSessions([
            { id: "payses_1", status: "pending", amount: 100 },
            { id: "payses_2", status: "canceled", amount: 7 },
          ]),
        })
      ).not.toThrow()
    })

    it("throws when any processable session mismatches", () => {
      expect(() =>
        validateCartPaymentAmount({
          cart: withSessions([
            { id: "payses_1", status: "pending", amount: 100 },
            { id: "payses_2", status: "authorized", amount: 40 },
          ]),
        })
      ).toThrow("Payment session payses_2")
    })

    it("ignores a mismatching session that completion won't authorize", () => {
      expect(() =>
        validateCartPaymentAmount({
          cart: withSessions([
            { id: "payses_1", status: "pending", amount: 100 },
            { id: "payses_2", status: "error", amount: 40 },
          ]),
        })
      ).not.toThrow()
    })
  })

  it("compares string amounts correctly", () => {
    expect(() =>
      validateCartPaymentAmount({
        cart: withSessions(
          [{ id: "payses_1", status: "pending", amount: "100" }],
          {
            total: "100",
          }
        ),
      })
    ).not.toThrow()

    expect(() =>
      validateCartPaymentAmount({
        cart: withSessions(
          [{ id: "payses_1", status: "pending", amount: "140" }],
          {
            total: "100",
          }
        ),
      })
    ).toThrow("has an amount of 140")
  })
})
