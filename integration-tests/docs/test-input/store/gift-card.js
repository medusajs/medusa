const {
  Region,
  ProductOption,
  Product,
  ProductVariant,
  ShippingProfile,
  MoneyAmount,
  Cart,
  GiftCard,
} = require("@medusajs/medusa")

module.exports = {
  operationId: "GetGiftCardsGiftCard",
  buildEndpoint: (code) => `/store/gift-cards/${code}`,
  setup: async (manager, api) => {
    const region = manager.create(Region, {
      name: "United States",
      currency_code: "usd",
      tax_rate: 0,
      countries: [
        {
          iso_2: "us",
        },
      ],
    })
    await manager.save(region)

    const giftCard = manager.create(GiftCard, {
      code: "1J3U-WXO0-SZ0H-O5QU",
      value: 1000,
      balance: 500,
      region,
      created_at: "2021-03-16T21:24:10.484Z",
      updated_at: "2021-03-16T21:24:10.484Z",
      is_disabled: false,
    })

    await manager.save(giftCard)

    return giftCard.code
  },
  snapshotMatch: {
    gift_card: {
      id: expect.stringMatching(/^gift_/),
      value: expect.any(Number),
      balance: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      is_disabled: expect.any(Boolean),
    },
  },
}
