const {
  ShippingProfile,
  Customer,
  Order,
  LineItem,
  MoneyAmount,
  ShippingMethod,
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
  operationId: "GetReturnReasonsReason",
  buildEndpoint: (id) => `/admin/return-reasons/${id}`,
  setup: async (manager, api) => {
    const payload = {
      label: "Too Big",
      description: "Use this if the size was too big",
      value: "too_big",
    }

    const response = await api
      .post("/admin/return-reasons", payload, {
        headers: {
          Authorization: "Bearer test_token",
        },
      })
      .catch((err) => {
        console.log(err)
      })
    return response.data.return_reason.id
  },
  snapshotMatch: {
    return_reason: {
      id: expect.stringMatching(/^rr_*/),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  },
}
