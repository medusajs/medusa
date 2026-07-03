import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("prices-in-major-units", rule, {
  valid: [
    // Decimal numeric literal — fine.
    {
      code: `const item = { unit_price: 19.99, currency_code: "usd" }`,
    },
    // Small integer (< 1000) without other red flags — fine.
    {
      code: `const item = { amount: 50, currency_code: "usd" }`,
    },
    // Identifier value not matching cents pattern — fine.
    {
      code: `const item = { amount: priceInMajor }`,
    },
    // Multiplied by something other than 100/1000 — fine.
    {
      code: `const item = { amount: base * 2 }`,
    },
    // Key not in the price list — fine.
    {
      code: `const cfg = { score: value * 100 }`,
    },
    // Sibling currency_code is zero-decimal (JPY) — large integer is plausible.
    {
      code: `const item = { amount: 5000, currency_code: "jpy" }`,
    },
    // Sibling currency_code is zero-decimal (KRW), uppercase — also accepted.
    {
      code: `const item = { amount: 50000, currency_code: "KRW" }`,
    },
    // Computed key — out of scope.
    {
      code: `const item = { [dynamicKey]: value * 100 }`,
    },
    // Decimal raw token (1000.0) — not flagged as large integer.
    {
      code: `const item = { amount: 1000.0 }`,
    },
    // Non-price variable name — fine.
    {
      code: `const count = items * 100`,
    },
    // Variable matches price key but value is a decimal — fine.
    {
      code: `const total = 19.99`,
    },
    // Assignment to non-price variable — fine.
    {
      code: `let x; x = amount * 100`,
    },
  ],
  invalid: [
    // `* 100` shape.
    {
      code: `const item = { amount: price * 100 }`,
      errors: [{ messageId: "multipliedByHundred", data: { key: "amount" } }],
    },
    // `* 1000` shape.
    {
      code: `const item = { unit_price: base * 1000 }`,
      errors: [
        { messageId: "multipliedByHundred", data: { key: "unit_price" } },
      ],
    },
    // Factor on the left.
    {
      code: `const item = { total: 100 * base }`,
      errors: [{ messageId: "multipliedByHundred", data: { key: "total" } }],
    },
    // Identifier named `cents`.
    {
      code: `const item = { amount: cents }`,
      errors: [
        {
          messageId: "centsIdentifier",
          data: { key: "amount", name: "cents" },
        },
      ],
    },
    // Identifier with `_cents` suffix.
    {
      code: `const item = { price: amount_cents }`,
      errors: [
        {
          messageId: "centsIdentifier",
          data: { key: "price", name: "amount_cents" },
        },
      ],
    },
    // Identifier named `priceInCents`.
    {
      code: `const item = { unit_price: priceInCents }`,
      errors: [
        {
          messageId: "centsIdentifier",
          data: { key: "unit_price", name: "priceInCents" },
        },
      ],
    },
    // Identifier named `amountInCents`.
    {
      code: `const item = { subtotal: amountInCents }`,
      errors: [
        {
          messageId: "centsIdentifier",
          data: { key: "subtotal", name: "amountInCents" },
        },
      ],
    },
    // Member expression ending in InCents.
    {
      code: `const item = { amount: req.body.priceInCents }`,
      errors: [
        {
          messageId: "centsIdentifier",
          data: { key: "amount", name: "priceInCents" },
        },
      ],
    },
    // Large integer (>= 1000) with no sibling currency_code.
    {
      code: `const item = { amount: 2500 }`,
      errors: [
        {
          messageId: "largeIntegerLikelyCents",
          data: { key: "amount", value: "2500" },
        },
      ],
    },
    // Large integer with non-zero-decimal sibling currency (USD).
    {
      code: `const item = { amount: 2500, currency_code: "usd" }`,
      errors: [
        {
          messageId: "largeIntegerLikelyCents",
          data: { key: "amount", value: "2500" },
        },
      ],
    },
    // Variable declarator: `const total = amount * 100`.
    {
      code: `const total = amount * 100`,
      errors: [{ messageId: "multipliedByHundred", data: { key: "total" } }],
    },
    // Variable declarator with `*_cents` initializer.
    {
      code: `const subtotal = amount_cents`,
      errors: [
        {
          messageId: "centsIdentifier",
          data: { key: "subtotal", name: "amount_cents" },
        },
      ],
    },
    // Variable declarator with large integer literal.
    {
      code: `const unit_price = 2500`,
      errors: [
        {
          messageId: "largeIntegerLikelyCents",
          data: { key: "unit_price", value: "2500" },
        },
      ],
    },
    // Assignment expression: `total = amount * 100`.
    {
      code: `let total; total = amount * 100`,
      errors: [{ messageId: "multipliedByHundred", data: { key: "total" } }],
    },
    // Assignment to a member expression with a price-like name.
    {
      code: `payload.price = priceInCents`,
      errors: [
        {
          messageId: "centsIdentifier",
          data: { key: "price", name: "priceInCents" },
        },
      ],
    },
    // All applicable price keys flagged in a single object.
    {
      code: `const order = {
        subtotal: subtotal_cents,
        tax_total: tax * 100,
        shipping_total: 5000,
        currency_code: "usd",
      }`,
      errors: [
        {
          messageId: "centsIdentifier",
          data: { key: "subtotal", name: "subtotal_cents" },
        },
        { messageId: "multipliedByHundred", data: { key: "tax_total" } },
        {
          messageId: "largeIntegerLikelyCents",
          data: { key: "shipping_total", value: "5000" },
        },
      ],
    },
  ],
})
