import {
  AdminCreateShippingOptionPriceWithCurrency,
  AdminCreateShippingOptionPriceWithRegion,
} from "../validators"

describe("shipping-options validators", () => {
  describe("AdminCreateShippingOptionPriceWithCurrency", () => {
    it("accepts an item_total price rule", () => {
      const result = AdminCreateShippingOptionPriceWithCurrency.safeParse({
        currency_code: "usd",
        amount: 1000,
        rules: [
          {
            attribute: "item_total",
            operator: "gt",
            value: 50,
          },
        ],
      })

      expect(result.success).toBe(true)
    })

    it("accepts a weight_total price rule", () => {
      const result = AdminCreateShippingOptionPriceWithCurrency.safeParse({
        currency_code: "usd",
        amount: 1000,
        rules: [
          {
            attribute: "weight_total",
            operator: "gt",
            value: 50,
          },
        ],
      })

      expect(result.success).toBe(true)
    })

    it("rejects a price_total price rule", () => {
      const result = AdminCreateShippingOptionPriceWithCurrency.safeParse({
        currency_code: "usd",
        amount: 1000,
        rules: [
          {
            attribute: "price_total",
            operator: "gt",
            value: 50,
          },
        ],
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain("Invalid option")
    })

    it("accepts item_total minimum and maximum rules", () => {
      const result = AdminCreateShippingOptionPriceWithCurrency.safeParse({
        currency_code: "usd",
        amount: 1000,
        rules: [
          {
            attribute: "item_total",
            operator: "gte",
            value: 50,
          },
          {
            attribute: "item_total",
            operator: "lte",
            value: 100,
          },
        ],
      })

      expect(result.success).toBe(true)
    })

    it("accepts weight_total minimum and maximum rules", () => {
      const result = AdminCreateShippingOptionPriceWithCurrency.safeParse({
        currency_code: "usd",
        amount: 1000,
        rules: [
          {
            attribute: "weight_total",
            operator: "gte",
            value: 10,
          },
          {
            attribute: "weight_total",
            operator: "lte",
            value: 50,
          },
        ],
      })

      expect(result.success).toBe(true)
    })

    it("accepts both item_total and weight_total rules on the same price", () => {
      const result = AdminCreateShippingOptionPriceWithCurrency.safeParse({
        currency_code: "usd",
        amount: 1000,
        rules: [
          {
            attribute: "item_total",
            operator: "gte",
            value: 50,
          },
          {
            attribute: "weight_total",
            operator: "gte",
            value: 10,
          },
        ],
      })

      expect(result.success).toBe(true)
    })

    it("accepts a price without rules", () => {
      const result = AdminCreateShippingOptionPriceWithCurrency.safeParse({
        currency_code: "usd",
        amount: 1000,
      })

      expect(result.success).toBe(true)
    })
  })

  describe("AdminCreateShippingOptionPriceWithRegion", () => {
    it("accepts an item_total price rule", () => {
      const result = AdminCreateShippingOptionPriceWithRegion.safeParse({
        region_id: "reg_123",
        amount: 1000,
        rules: [
          {
            attribute: "item_total",
            operator: "gt",
            value: 50,
          },
        ],
      })

      expect(result.success).toBe(true)
    })

    it("accepts a weight_total price rule", () => {
      const result = AdminCreateShippingOptionPriceWithRegion.safeParse({
        region_id: "reg_123",
        amount: 1000,
        rules: [
          {
            attribute: "weight_total",
            operator: "gt",
            value: 50,
          },
        ],
      })

      expect(result.success).toBe(true)
    })

    it("rejects a price_total price rule", () => {
      const result = AdminCreateShippingOptionPriceWithRegion.safeParse({
        region_id: "reg_123",
        amount: 1000,
        rules: [
          {
            attribute: "price_total",
            operator: "gt",
            value: 50,
          },
        ],
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain("Invalid option")
    })

    it("accepts item_total minimum and maximum rules", () => {
      const result = AdminCreateShippingOptionPriceWithRegion.safeParse({
        region_id: "reg_123",
        amount: 1000,
        rules: [
          {
            attribute: "item_total",
            operator: "gte",
            value: 50,
          },
          {
            attribute: "item_total",
            operator: "lte",
            value: 100,
          },
        ],
      })

      expect(result.success).toBe(true)
    })

    it("accepts weight_total minimum and maximum rules", () => {
      const result = AdminCreateShippingOptionPriceWithRegion.safeParse({
        region_id: "reg_123",
        amount: 1000,
        rules: [
          {
            attribute: "weight_total",
            operator: "gte",
            value: 10,
          },
          {
            attribute: "weight_total",
            operator: "lte",
            value: 50,
          },
        ],
      })

      expect(result.success).toBe(true)
    })

    it("accepts both item_total and weight_total rules on the same price", () => {
      const result = AdminCreateShippingOptionPriceWithRegion.safeParse({
        region_id: "reg_123",
        amount: 1000,
        rules: [
          {
            attribute: "item_total",
            operator: "gte",
            value: 50,
          },
          {
            attribute: "weight_total",
            operator: "gte",
            value: 10,
          },
        ],
      })

      expect(result.success).toBe(true)
    })

    it("accepts a price without rules", () => {
      const result = AdminCreateShippingOptionPriceWithRegion.safeParse({
        region_id: "reg_123",
        amount: 1000,
      })

      expect(result.success).toBe(true)
    })
  })
})
