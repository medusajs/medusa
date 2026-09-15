import {
  AdminAddDraftOrderItems,
  AdminCreateDraftOrder,
  AdminUpdateDraftOrderActionItem,
  AdminUpdateDraftOrderItem,
} from "../validators"

describe("admin draft order validators", () => {
  describe("unit_price", () => {
    it("rejects negative unit prices when creating draft orders", () => {
      const result = AdminCreateDraftOrder().safeParse({
        region_id: "reg_123",
        items: [
          {
            variant_id: "variant_123",
            quantity: 1,
            unit_price: -500,
          },
        ],
      })

      expect(result.success).toBe(false)
    })

    it("rejects negative BigNumber unit price inputs when creating draft orders", () => {
      const negativeUnitPrices = ["-500", { value: "-500", precision: 20 }]

      for (const unit_price of negativeUnitPrices) {
        const result = AdminCreateDraftOrder().safeParse({
          region_id: "reg_123",
          items: [
            {
              variant_id: "variant_123",
              quantity: 1,
              unit_price,
            },
          ],
        })

        expect(result.success).toBe(false)
      }
    })

    it("rejects negative unit prices when adding draft order items", () => {
      const result = AdminAddDraftOrderItems.safeParse({
        items: [
          {
            variant_id: "variant_123",
            quantity: 1,
            unit_price: -500,
          },
        ],
      })

      expect(result.success).toBe(false)
    })

    it("rejects negative unit prices when updating draft order items", () => {
      const result = AdminUpdateDraftOrderItem.safeParse({
        quantity: 1,
        unit_price: -500,
      })

      expect(result.success).toBe(false)
    })

    it("rejects negative unit prices when updating draft order action items", () => {
      const result = AdminUpdateDraftOrderActionItem.safeParse({
        quantity: 1,
        unit_price: -500,
      })

      expect(result.success).toBe(false)
    })

    it("accepts zero unit prices", () => {
      const result = AdminCreateDraftOrder().safeParse({
        region_id: "reg_123",
        items: [
          {
            variant_id: "variant_123",
            quantity: 1,
            unit_price: 0,
          },
        ],
      })

      expect(result.success).toBe(true)
    })
  })
})
