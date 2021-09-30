const {
  Customer,
  Region,
  Cart,
  DiscountRule,
  Discount,
  ShippingProfile,
  ShippingOption,
  ShippingMethod,
  Address,
  Product,
  ProductVariant,
  MoneyAmount,
  LineItem,
  Payment,
  PaymentSession,
} = require("@medusajs/medusa")

module.exports = async (connection, data = {}) => {
  const manager = connection.manager

  const defaultProfile = await manager.findOne(ShippingProfile, {
    type: "default",
  })

  const gcProfile = await manager.findOne(ShippingProfile, {
    type: "gift_card",
  })

  await manager.insert(Address, {
    id: "test-general-address",
    first_name: "superman",
    country_code: "us",
  })

  const r = manager.create(Region, {
    id: "test-region",
    name: "Test Region",
    currency_code: "usd",
    tax_rate: 0,
  })

  const freeRule = manager.create(DiscountRule, {
    id: "free-shipping-rule",
    description: "Free shipping rule",
    type: "free_shipping",
    value: 100,
    allocation: "total",
  })

  const freeDisc = manager.create(Discount, {
    id: "free-shipping",
    code: "FREE_SHIPPING",
    is_dynamic: false,
    is_disabled: false,
  })

  freeDisc.regions = [r]
  freeDisc.rule = freeRule
  await manager.save(freeDisc)

  const tenPercentRule = manager.create(DiscountRule, {
    id: "tenpercent-rule",
    description: "Ten percent rule",
    type: "percentage",
    value: 10,
    allocation: "total",
  })

  const tenPercent = manager.create(Discount, {
    id: "10Percent",
    code: "10PERCENT",
    is_dynamic: false,
    is_disabled: false,
  })

  tenPercent.regions = [r]
  tenPercent.rule = tenPercentRule
  await manager.save(tenPercent)

  const d = await manager.create(Discount, {
    id: "test-discount",
    code: "CREATED",
    is_dynamic: false,
    is_disabled: false,
  })

  const dr = await manager.create(DiscountRule, {
    id: "test-discount-rule",
    description: "Created",
    type: "fixed",
    value: 10000,
    allocation: "total",
  })

  d.rule = dr
  d.regions = [r]

  await manager.save(d)

  await manager.query(
    `UPDATE "country" SET region_id='test-region' WHERE iso_2 = 'us'`
  )

  await manager.insert(Customer, {
    id: "test-customer",
    email: "test@email.com",
  })

  await manager.insert(Customer, {
    id: "test-customer-2",
    email: "test-2@email.com",
  })

  await manager.insert(Customer, {
    id: "some-customer",
    email: "some-customer@email.com",
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
    id: "gc-option",
    name: "Digital copy",
    provider_id: "test-ful",
    region_id: "test-region",
    profile_id: gcProfile.id,
    price_type: "flat_rate",
    amount: 0,
    data: {},
  })

  await manager.insert(ShippingOption, {
    id: "test-option-2",
    name: "test-option-2",
    provider_id: "test-ful",
    region_id: "test-region",
    profile_id: defaultProfile.id,
    price_type: "flat_rate",
    amount: 500,
    data: {},
  })

  await manager.insert(Product, {
    id: "giftcard-product",
    title: "Giftcard",
    is_giftcard: true,
    discountable: false,
    profile_id: gcProfile.id,
    options: [{ id: "denom", title: "Denomination" }],
  })

  await manager.insert(ProductVariant, {
    id: "giftcard-denom",
    title: "1000",
    product_id: "giftcard-product",
    inventory_quantity: 1,
    options: [
      {
        option_id: "denom",
        value: "1000",
      },
    ],
  })

  await manager.insert(Product, {
    id: "test-product",
    title: "test product",
    profile_id: defaultProfile.id,
    options: [{ id: "test-option", title: "Size" }],
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
    title: "test variant 2",
    product_id: "test-product",
    inventory_quantity: 0,
    options: [
      {
        option_id: "test-option",
        value: "Size",
      },
    ],
  })

  const ma = manager.create(MoneyAmount, {
    variant_id: "test-variant",
    currency_code: "usd",
    amount: 1000,
  })

  await manager.save(ma)

  const ma2 = manager.create(MoneyAmount, {
    variant_id: "test-variant-2",
    currency_code: "usd",
    amount: 8000,
  })

  await manager.save(ma2)

  const ma3 = manager.create(MoneyAmount, {
    variant_id: "giftcard-denom",
    currency_code: "usd",
    amount: 1000,
  })

  await manager.save(ma3)

  const cart = manager.create(Cart, {
    id: "test-cart",
    customer_id: "some-customer",
    email: "some-customer@email.com",
    shipping_address: {
      id: "test-shipping-address",
      first_name: "lebron",
      country_code: "us",
    },
    region_id: "test-region",
    currency_code: "usd",
    items: [],
  })

  await manager.save(cart)

  const cart2 = manager.create(Cart, {
    id: "test-cart-2",
    customer_id: "some-customer",
    email: "some-customer@email.com",
    shipping_address: {
      id: "test-shipping-address",
      first_name: "lebron",
      country_code: "us",
    },
    region_id: "test-region",
    currency_code: "usd",
    completed_at: null,
    items: [],
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

  cart2.payment = pay

  await manager.save(cart2)

  await manager.insert(PaymentSession, {
    id: "test-session",
    cart_id: "test-cart-2",
    provider_id: "test-pay",
    is_selected: true,
    data: {},
    status: "authorized",
  })

  await manager.insert(ShippingMethod, {
    id: "test-method",
    shipping_option_id: "test-option",
    cart_id: "test-cart",
    price: 1000,
    data: {},
  })

  const li = manager.create(LineItem, {
    id: "test-item",
    title: "Line Item",
    description: "Line Item Desc",
    thumbnail: "https://test.js/1234",
    unit_price: 8000,
    quantity: 1,
    variant_id: "test-variant",
    cart_id: "test-cart-2",
  })
  await manager.save(li)

  const cart3 = manager.create(Cart, {
    id: "test-cart-3",
    customer_id: "some-customer",
    email: "some-customer@email.com",
    shipping_address: {
      id: "test-shipping-address",
      first_name: "lebron",
      country_code: "us",
    },
    region_id: "test-region",
    currency_code: "usd",
    completed_at: null,
    items: [],
  })
  await manager.save(cart3)

  await manager.insert(ShippingMethod, {
    id: "test-method-2",
    shipping_option_id: "test-option",
    cart_id: "test-cart-3",
    price: 0,
    data: {},
  })

  const li2 = manager.create(LineItem, {
    id: "test-item-2",
    title: "Line Item",
    description: "Line Item Desc",
    thumbnail: "https://test.js/1234",
    unit_price: 8000,
    quantity: 1,
    variant_id: "test-variant",
    cart_id: "test-cart-3",
  })
  await manager.save(li2)
}
