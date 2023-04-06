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
  ShippingProfileType,
} = require("@medusajs/medusa")

module.exports = async (connection, data = {}) => {
  const salesChannelId = data?.sales_channel_id

  const yesterday = ((today) => new Date(today.setDate(today.getDate() - 1)))(
    new Date()
  )
  const tomorrow = ((today) => new Date(today.setDate(today.getDate() + 1)))(
    new Date()
  )
  const tenDaysAgo = ((today) => new Date(today.setDate(today.getDate() - 10)))(
    new Date()
  )
  const tenDaysFromToday = ((today) =>
    new Date(today.setDate(today.getDate() + 10)))(new Date())

  const manager = connection.manager

  const defaultProfile = await manager.findOne(ShippingProfile, {
    where: {
      type: ShippingProfileType.DEFAULT,
    },
  })

  const gcProfile = await manager.findOne(ShippingProfile, {
    where: {
      type: ShippingProfileType.GIFT_CARD,
    },
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

  // Region with multiple countries
  const regionWithMultipleCoutries = manager.create(Region, {
    id: "test-region-multiple",
    name: "Test Region",
    currency_code: "eur",
    tax_rate: 0,
  })

  await manager.save(regionWithMultipleCoutries)
  await manager.query(
    `UPDATE "country" SET region_id='test-region-multiple' WHERE iso_2 = 'no'`
  )
  await manager.query(
    `UPDATE "country" SET region_id='test-region-multiple' WHERE iso_2 = 'dk'`
  )

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
    starts_at: tenDaysAgo,
    ends_at: tenDaysFromToday,
  })

  tenPercent.regions = [r]
  tenPercent.rule = tenPercentRule
  await manager.save(tenPercent)

  const dUsageLimit = await manager.create(Discount, {
    id: "test-discount-usage-limit",
    code: "SPENT",
    is_dynamic: false,
    is_disabled: false,
    usage_limit: 10,
    usage_count: 10,
  })

  const drUsage = await manager.create(DiscountRule, {
    id: "test-discount-rule-usage-limit",
    description: "Created",
    type: "fixed",
    value: 10000,
    allocation: "total",
  })

  dUsageLimit.rule = drUsage
  dUsageLimit.regions = [r]

  await manager.save(dUsageLimit)

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

  const usedDiscount = manager.create(Discount, {
    id: "used-discount",
    code: "USED",
    is_dynamic: false,
    is_disabled: false,
    usage_limit: 1,
    usage_count: 1,
  })

  await manager.save(usedDiscount)

  const expiredRule = manager.create(DiscountRule, {
    id: "expiredRule",
    description: "expired rule",
    type: "fixed",
    value: 100,
    allocation: "total",
  })

  const expiredDisc = manager.create(Discount, {
    id: "expiredDisc",
    code: "EXP_DISC",
    is_dynamic: false,
    is_disabled: false,
    starts_at: tenDaysAgo,
    ends_at: yesterday,
  })

  expiredDisc.regions = [r]
  expiredDisc.rule = expiredRule
  await manager.save(expiredDisc)

  const prematureRule = manager.create(DiscountRule, {
    id: "prematureRule",
    description: "premature rule",
    type: "fixed",
    value: 100,
    allocation: "total",
  })

  const prematureDiscount = manager.create(Discount, {
    id: "prematureDiscount",
    code: "PREM_DISC",
    is_dynamic: false,
    is_disabled: false,
    starts_at: tomorrow,
    ends_at: tenDaysFromToday,
  })

  prematureDiscount.regions = [r]
  prematureDiscount.rule = prematureRule
  await manager.save(prematureDiscount)

  const invalidDynamicRule = manager.create(DiscountRule, {
    id: "invalidDynamicRule",
    description: "invalidDynamic rule",
    type: "fixed",
    value: 100,
    allocation: "total",
  })

  const invalidDynamicDiscount = manager.create(Discount, {
    id: "invalidDynamicDiscount",
    code: "INV_DYN_DISC",
    is_dynamic: true,
    is_disabled: false,
    starts_at: tenDaysAgo,
    ends_at: tenDaysFromToday,
    valid_duration: "P1D", // one day
  })

  invalidDynamicDiscount.regions = [r]
  invalidDynamicDiscount.rule = invalidDynamicRule
  await manager.save(invalidDynamicDiscount)

  const DynamicRule = manager.create(DiscountRule, {
    id: "DynamicRule",
    description: "Dynamic rule",
    type: "fixed",
    value: 10000,
    allocation: "total",
  })

  const DynamicDiscount = manager.create(Discount, {
    id: "DynamicDiscount",
    code: "DYN_DISC",
    is_dynamic: true,
    is_disabled: false,
    starts_at: tenDaysAgo,
    ends_at: tenDaysFromToday,
    valid_duration: "P1M", // one month
  })

  DynamicDiscount.regions = [r]
  DynamicDiscount.rule = DynamicRule
  await manager.save(DynamicDiscount)

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
    sales_channel_id: salesChannelId,
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
    sales_channel_id: salesChannelId,
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

  const swapCart = manager.create(Cart, {
    id: "swap-cart",
    type: "swap",
    customer_id: "some-customer",
    sales_channel_id: salesChannelId,
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
    metadata: {
      swap_id: "test-swap",
    },
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
  const swapPay = manager.create(Payment, {
    id: "test-swap-payment",
    amount: 10000,
    currency_code: "usd",
    amount_refunded: 0,
    provider_id: "test-pay",
    data: {},
  })

  await manager.save(pay)
  await manager.save(swapPay)

  cart2.payment = pay
  swapCart.payment = swapPay

  await manager.save(cart2)
  await manager.save(swapCart)

  await manager.insert(PaymentSession, {
    id: "test-session",
    cart_id: "test-cart-2",
    provider_id: "test-pay",
    is_selected: true,
    data: {},
    status: "authorized",
  })

  await manager.insert(PaymentSession, {
    id: "test-swap-session",
    cart_id: "swap-cart",
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
