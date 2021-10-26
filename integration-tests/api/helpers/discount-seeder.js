const {
  ShippingProfile,
  Region,
  Discount,
  DiscountRule,
} = require("@medusajs/medusa")
module.exports = async (connection, data = {}) => {
  const manager = connection.manager

  await manager.insert(Region, {
    id: "test-region",
    name: "Test Region",
    currency_code: "usd",
    tax_rate: 0,
    payment_providers: [
      {
        id: "test-pay",
        is_installed: true,
      },
    ],
  })

  await manager.insert(Region, {
    id: "test-region-2",
    name: "Test Region 2",
    currency_code: "eur",
    tax_rate: 0,
    payment_providers: [
      {
        id: "test-pay",
        is_installed: true,
      },
    ],
  })
}
