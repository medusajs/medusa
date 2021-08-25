const { Region, DiscountRule, Discount } = require("@medusajs/medusa")

module.exports = {
  operationId: "GetDiscountsDiscount",
  buildEndpoint: (id) => `/admin/discounts/${id}`,
  setup: async (manager) => {
    const region = manager.create(Region, {
      name: "Scandinavia",
      tax_rate: 0,
      currency_code: "dkk",
      countries: [{ iso_2: "dk" }, { iso_2: "se" }, { iso_2: "no" }],
      payment_providers: [{ id: "test-pay" }],
      fulfillment_providers: [{ id: "test-ful" }],
    })

    await manager.save(region)

    const discount = manager.create(Discount, {
      code: "ABCD-1234-FIVE-QWER",
      is_dynamic: false,
      is_disabled: false,
      regions: [region],
      usage_limit: 5,
    })
    await manager.save(discount)

    return discount.id
  },
  snapshotMatch: {
    discount: {
      id: expect.stringMatching(/^disc_*/),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      regions: [
        {
          id: expect.stringMatching(/^reg_*/),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ],
      starts_at: expect.any(String),
    },
  },
}
