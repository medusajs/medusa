const {
  ShippingProfile,
  Customer,
  MoneyAmount,
  ShippingOption,
  ShippingOptionRequirement,
  ProductOption,
  Product,
  ProductVariant,
  Region,
  Address,
  Cart,
  PaymentSession,
  DraftOrder,
  Discount,
  DiscountRule,
  Payment,
} = require("@medusajs/medusa")

module.exports = {
  operationId: "GetGiftCardsGiftCard",
  buildEndpoint: (id) => `/admin/gift-cards/${id}`,
  setup: async (manager, api) => {
    const region = await manager.create(Region, {
      name: "United States",
      currency_code: "usd",
      tax_rate: 0,
    })

    await manager.save(region)

    const response = await api
      .post(
        "/admin/gift-cards",
        {
          value: 1000,
          region_id: region.id,
        },
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      )
      .catch((err) => {
        console.log(err)
      })

    return response.data.gift_card.id
  },
  snapshotMatch: {
    gift_card: {
      id: expect.stringMatching(/^gift_*/),
      code: expect.any(String),
      region_id: expect.stringMatching(/^reg_*/),
      region: {
        id: expect.stringMatching(/^reg_*/),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  },
}
