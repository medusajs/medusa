const {
  ShippingProfile,
  Customer,
  MoneyAmount,
  ShippingOption,
  ShippingOptionRequirement,
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
  ShippingProfileType,
} = require("@medusajs/medusa")

module.exports = async (connection, data = {}) => {
  const manager = connection.manager

  const defaultProfile = await manager.findOne(ShippingProfile, {
    where: {
      type: ShippingProfileType.DEFAULT,
    },
  })

  await manager.insert(Product, {
    id: "test-product",
    title: "test product",
    profile_id: defaultProfile.id,
    options: [{ id: "test-option", title: "Size" }],
  })

  await manager.insert(Address, {
    id: "oli-shipping",
    first_name: "oli",
    last_name: "test",
    country_code: "us",
  })

  await manager.insert(Product, {
    id: "test-product-2",
    title: "test product 2",
    profile_id: defaultProfile.id,
    options: [{ id: "test-option-color", title: "Color" }],
  })

  await manager.insert(ProductVariant, {
    id: "test-variant",
    title: "test variant",
    product_id: "test-product",
    inventory_quantity: 1,
    options: [
      {
        option_id: "test-option",
        value: "Size",
      },
    ],
  })

  await manager.insert(ProductVariant, {
    id: "test-variant-2",
    title: "test variant-2",
    product_id: "test-product-2",
    inventory_quantity: 4,
    options: [
      {
        option_id: "test-option-color",
        value: "Color",
      },
    ],
  })

  const ma = manager.create(MoneyAmount, {
    variant_id: "test-variant",
    currency_code: "usd",
    amount: 8000,
  })
  await manager.save(ma)

  const ma2 = manager.create(MoneyAmount, {
    variant_id: "test-variant-2",
    currency_code: "usd",
    amount: 10000,
  })

  await manager.save(ma2)

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

  await manager.insert(DiscountRule, {
    id: "discount_rule_id",
    description: "test description",
    value: 10,
    allocation: "total",
    type: "percentage",
  })

  const d = manager.create(Discount, {
    id: "test-discount",
    code: "TEST",
    is_dynamic: false,
    is_disabled: false,
    rule_id: "discount_rule_id",
  })

  d.regions = [
    {
      id: "test-region",
      name: "Test Region",
      currency_code: "usd",
      tax_rate: 0,
    },
  ]

  await manager.save(d)

  await manager.query(
    `UPDATE "country" SET region_id='test-region' WHERE iso_2 = 'us'`
  )

  await manager.query(
    `UPDATE "country" SET region_id='test-region-2' WHERE iso_2 = 'de'`
  )

  await manager.insert(Customer, {
    id: "oli-test",
    email: "oli@test.dk",
  })

  await manager.insert(Customer, {
    id: "lebron-james",
    email: "lebron@james.com",
  })

  await manager.insert(ShippingOption, {
    id: "test-option",
    name: "test-option",
    provider_id: "test-ful",
    region_id: "test-region",
    profile_id: defaultProfile.id,
    price_type: "flat_rate",
    amount: 1000,
    data: {},
  })

  await manager.insert(ShippingOption, {
    id: "test-option-req",
    name: "test-option-req",
    provider_id: "test-ful",
    region_id: "test-region",
    profile_id: defaultProfile.id,
    price_type: "flat_rate",
    amount: 1000,
    data: {},
  })

  await manager.insert(ShippingOptionRequirement, {
    id: "option-req",
    shipping_option_id: "test-option-req",
    type: "min_subtotal",
    amount: 10,
  })

  const c = manager.create(Cart, {
    id: "test-cart",
    customer_id: "oli-test",
    email: "oli@test.dk",
    shipping_address_id: "oli-shipping",
    region_id: "test-region",
    currency_code: "usd",
    payment_sessions: [],
    items: [
      {
        id: "test-item",
        fulfilled_quantity: 1,
        title: "Line Item",
        description: "Line Item Desc",
        thumbnail: "https://test.js/1234",
        unit_price: 8000,
        quantity: 1,
        variant_id: "test-variant",
      },
    ],
    type: "draft_order",
    metadata: { draft_order_id: "test-draft-order" },
  })

  const pay = manager.create(Payment, {
    id: "test-payment",
    amount: 10000,
    currency_code: "usd",
    amount_refunded: 0,
    provider_id: "test-pay",
    data: {},
  })

  await manager.save(pay)

  c.payment = pay

  await manager.save(c)

  await manager.insert(PaymentSession, {
    id: "test-session",
    cart_id: "test-cart",
    provider_id: "test-pay",
    is_selected: true,
    data: {},
    status: "authorized",
  })

  const draftOrder = manager.create(DraftOrder, {
    id: "test-draft-order",
    status: "open",
    display_id: 4,
    cart_id: "test-cart",
    customer_id: "oli-test",
    items: [
      {
        id: "test-item",
        fulfilled_quantity: 1,
        title: "Line Item",
        description: "Line Item Desc",
        thumbnail: "https://test.js/1234",
        unit_price: 8000,
        quantity: 1,
        variant_id: "test-variant",
      },
    ],
    email: "oli@test.dk",
    region_id: "test-region",
    discounts: [],
    ...data,
  })

  await manager.save(draftOrder)
}
