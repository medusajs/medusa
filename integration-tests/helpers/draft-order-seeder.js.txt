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
const { simpleSalesChannelFactory } = require("../factories")
const { ProductOption } = require("@medusajs/medusa")
const { ProductVariantMoneyAmount } = require("@medusajs/medusa")

module.exports = async (dataSource, data = {}) => {
  const manager = dataSource.manager

  const defaultProfile = await manager.findOne(ShippingProfile, {
    where: { type: ShippingProfileType.DEFAULT },
  })

  const salesChannel = await simpleSalesChannelFactory(dataSource, {
    id: "sales-channel",
    is_default: true,
  })

  const op = manager.create(ProductOption, {
    id: "test-option",
    title: "Size",
  })

  await manager.save(op)
  await manager.insert(Product, {
    id: "test-product",
    title: "test product",
    profile_id: defaultProfile.id,
    profiles: [{ id: defaultProfile.id }],
    options: [op],
  })

  await manager.query(
    `insert into product_sales_channel values ('test-product', '${salesChannel.id}');`
  )

  await manager.insert(Address, {
    id: "oli-shipping",
    first_name: "oli",
    last_name: "test",
    country_code: "us",
  })

  const op1 = manager.create(ProductOption, {
    id: "test-option-color",
    title: "Color",
  })
  await manager.save(op1)

  await manager.insert(Product, {
    id: "test-product-2",
    title: "test product 2",
    profile_id: defaultProfile.id,
    profiles: [{ id: defaultProfile.id }],
    options: [op1],
  })

  await manager.query(
    `insert into product_sales_channel values ('test-product-2', '${salesChannel.id}');`
  )

  await manager.insert(ProductVariant, {
    id: "test-variant-without-prices",
    title: "test variant without prices",
    product_id: "test-product",
    inventory_quantity: 1,
    options: [
      {
        option_id: "test-option",
        value: "no prices",
      },
    ],
  })

  const pv1 = manager.create(ProductVariant, {
    id: "test-variant",
    title: "test variant",
    product_id: "test-product",
    inventory_quantity: 2,
    options: [
      {
        option_id: "test-option",
        value: "Size",
      },
    ],
  })
  await manager.save(pv1)

  await manager.insert(MoneyAmount, {
    id: "test-price",
    currency_code: "usd",
    amount: 8000,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant",
    money_amount_id: "test-price",
    variant_id: "test-variant",
  })

  const pv2 = manager.create(ProductVariant, {
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
  await manager.save(pv2)

  await manager.insert(MoneyAmount, {
    id: "test-price-2",
    currency_code: "usd",
    amount: 10000,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-2",
    money_amount_id: "test-price-2",
    variant_id: "test-variant-2",
  })

  await manager.insert(Region, {
    id: "test-region",
    name: "Test Region",
    currency_code: "usd",
    tax_rate: 0,
  })

  await manager.query(
    `insert into region_payment_providers values ('test-region', 'test-pay');`
  )

  await manager.insert(Region, {
    id: "test-region-2",
    name: "Test Region 2",
    currency_code: "eur",
    tax_rate: 0,
  })

  await manager.query(
    `insert into region_payment_providers values ('test-region-2', 'test-pay');`
  )

  await manager.insert(DiscountRule, {
    id: "discount_rule_id",
    description: "test description",
    value: 10,
    allocation: "total",
    type: "percentage",
  })

  await manager.insert(DiscountRule, {
    id: "free-shipping-rule",
    description: "Free shipping rule",
    type: "free_shipping",
    value: 100,
    allocation: "total",
  })

  const testDiscount = manager.create(Discount, {
    id: "test-discount",
    code: "TEST",
    is_dynamic: false,
    is_disabled: false,
    rule_id: "discount_rule_id",
  })

  const freeShippingDiscount = manager.create(Discount, {
    id: "free-shipping-discount",
    code: "FREE-SHIPPING",
    is_dynamic: false,
    is_disabled: false,
    rule_id: "free-shipping-rule",
  })

  testDiscount.regions = [
    {
      id: "test-region",
      name: "Test Region",
      currency_code: "usd",
      tax_rate: 0,
    },
  ]

  freeShippingDiscount.regions = [
    {
      id: "test-region",
      name: "Test Region",
      currency_code: "usd",
      tax_rate: 0,
    },
  ]

  await manager.save(testDiscount)
  await manager.save(freeShippingDiscount)

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
