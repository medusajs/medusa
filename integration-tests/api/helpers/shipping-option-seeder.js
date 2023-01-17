const {
  Region,
  ShippingProfile,
  ShippingOption,
  ShippingOptionRequirement,
  ShippingProfileType,
} = require("@medusajs/medusa")

module.exports = async (dataSource, data = {}) => {
  const manager = dataSource.manager

  await manager.insert(Region, {
    id: "region",
    name: "Test Region",
    currency_code: "usd",
    tax_rate: 0,
  })

  const defaultProfile = await manager.findOne(ShippingProfile, {
    where: { type: ShippingProfileType.DEFAULT },
  })

  await manager.insert(ShippingOption, {
    id: "test-out",
    name: "Test out",
    profile_id: defaultProfile.id,
    region_id: "region",
    provider_id: "test-ful",
    data: {},
    price_type: "flat_rate",
    amount: 2000,
    is_return: false,
  })

  await manager.insert(ShippingOption, {
    id: "test-option-req",
    name: "With req",
    profile_id: defaultProfile.id,
    region_id: "region",
    provider_id: "test-ful",
    data: {},
    price_type: "flat_rate",
    amount: 2000,
    is_return: false,
  })

  await manager.insert(ShippingOption, {
    id: "test-option-req-admin-only",
    name: "With req",
    profile_id: defaultProfile.id,
    region_id: "region",
    admin_only: true,
    provider_id: "test-ful",
    data: {},
    price_type: "flat_rate",
    amount: 2000,
    is_return: false,
  })
  await manager.insert(ShippingOption, {
    id: "test-option-req-return",
    name: "With req",
    profile_id: defaultProfile.id,
    region_id: "region",
    is_return: true,
    provider_id: "test-ful",
    data: {},
    price_type: "flat_rate",
    amount: 2000,
  })

  await manager.insert(ShippingOptionRequirement, {
    id: "option-req",
    shipping_option_id: "test-option-req",
    type: "min_subtotal",
    amount: 5,
  })

  await manager.insert(ShippingOptionRequirement, {
    id: "option-req-2",
    shipping_option_id: "test-option-req",
    type: "max_subtotal",
    amount: 10,
  })
}
