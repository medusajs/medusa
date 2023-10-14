const { ProductVariantMoneyAmount } = require("@medusajs/medusa")
const { ProductOption } = require("@medusajs/medusa")
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
  CustomerGroup,
  PriceList,
  ShippingProfileType,
} = require("@medusajs/medusa")

module.exports = async (dataSource, data = {}) => {
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

  const manager = dataSource.manager

  const defaultProfile = await manager.findOne(ShippingProfile, {
    where: { type: ShippingProfileType.DEFAULT },
  })

  const gcProfile = await manager.findOne(ShippingProfile, {
    where: { type: ShippingProfileType.GIFT_CARD },
  })

  await manager.insert(Address, {
    id: "test-general-address",
    first_name: "superman",
    country_code: "us",
  })

  const r = manager.create(Region, {
    id: "test-region",
    name: "Test Region",
    payment_providers: [{ id: "test-pay" }],
    currency_code: "usd",
    tax_rate: 0,
  })

  await manager.save(r)

  const europeRegion = manager.create(Region, {
    id: "eur-region",
    name: "Europe Region",
    payment_providers: [{ id: "test-pay" }],
    currency_code: "eur",
    tax_rate: 0,
  })

  await manager.save(europeRegion)

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

  const customer5 = manager.create(Customer, {
    id: "test-customer-5",
    email: "test5@email.com",
    first_name: "John",
    last_name: "Deere",
    password_hash:
      "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
    has_account: true,
  })
  await manager.save(customer5)

  const c_group_5 = manager.create(CustomerGroup, {
    id: "test-group-5",
    name: "test-group-5",
  })
  await manager.save(c_group_5)

  customer5.groups = [c_group_5]
  await manager.save(customer5)

  const priceList_customer = manager.create(PriceList, {
    id: "pl_customer",
    name: "VIP winter sale",
    description: "Winter sale for VIP customers.",
    type: "sale",
    status: "active",
  })

  priceList_customer.customer_groups = [c_group_5]

  await manager.save(priceList_customer)

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

  tenPercent.regions = [r, europeRegion]
  tenPercent.rule = tenPercentRule
  await manager.save(tenPercent)

  const totalFixed100Rule = manager.create(DiscountRule, {
    id: "total-fixed-100-rule",
    description: "Fixed 100 total",
    type: "fixed",
    value: 100,
    allocation: "total",
  })

  const totalFixed100 = manager.create(Discount, {
    id: "total-fixed-100",
    code: "FIXED100",
    is_dynamic: false,
    is_disabled: false,
    starts_at: tenDaysAgo,
    ends_at: tenDaysFromToday,
  })

  totalFixed100.regions = [r]
  totalFixed100.rule = totalFixed100Rule
  await manager.save(totalFixed100)

  const itemFixed200Rule = manager.create(DiscountRule, {
    id: "item-fixed-200-rule",
    description: "Item 200 fixed",
    type: "fixed",
    value: 200,
    allocation: "item",
  })

  const itemFixed200 = manager.create(Discount, {
    id: "item-fixed-200",
    code: "FIXED200",
    is_dynamic: false,
    is_disabled: false,
    starts_at: tenDaysAgo,
    ends_at: tenDaysFromToday,
  })

  itemFixed200.regions = [r]
  itemFixed200.rule = itemFixed200Rule
  await manager.save(itemFixed200)

  const itemPerc15Rule = manager.create(DiscountRule, {
    id: "item-percentage-15-rule",
    description: "Item 15 percentage",
    type: "percentage",
    value: 15,
    allocation: "item",
  })

  const itemPerc15 = manager.create(Discount, {
    id: "item-percentage-15",
    code: "15PERCENT",
    is_dynamic: false,
    is_disabled: false,
    starts_at: tenDaysAgo,
    ends_at: tenDaysFromToday,
  })

  itemPerc15.regions = [r]
  itemPerc15.rule = itemPerc15Rule
  await manager.save(itemPerc15)

  const dUsageLimit = manager.create(Discount, {
    id: "test-discount-usage-limit",
    code: "SPENT",
    is_dynamic: false,
    is_disabled: false,
    usage_limit: 10,
    usage_count: 10,
  })

  const drUsage = manager.create(DiscountRule, {
    id: "test-discount-rule-usage-limit",
    description: "Created",
    type: "fixed",
    value: 10000,
    allocation: "total",
  })

  dUsageLimit.rule = drUsage
  dUsageLimit.regions = [r]

  await manager.save(dUsageLimit)

  const d = manager.create(Discount, {
    id: "test-discount",
    code: "CREATED",
    is_dynamic: false,
    is_disabled: false,
  })

  const dr = manager.create(DiscountRule, {
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
    ends_at: yesterday,
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

  const c2 = manager.create(Customer, {
    id: "test-customer-2",
    email: "test-2@email.com",
  })

  const cg = manager.create(CustomerGroup, {
    id: "cgroup",
    name: "customer group",
  })

  await manager.save(cg)

  c2.groups = [cg]
  await manager.save(c2)

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

  const priceList = manager.create(PriceList, {
    id: "pl",
    name: "VIP winter sale",
    description: "Winter sale for VIP customers.",
    type: "sale",
    status: "active",
  })

  await manager.save(priceList)

  const priceList1 = manager.create(PriceList, {
    id: "pl_current",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
    starts_at: tenDaysAgo,
    ends_at: tenDaysFromToday,
  })

  await manager.save(priceList1)

  const denomOp = manager.create(ProductOption, {
    id: "denom",
    title: "Denomination",
  })
  await manager.save(denomOp)

  const giftCardProduct = manager.create(Product, {
    id: "giftcard-product",
    title: "Giftcard",
    is_giftcard: true,
    discountable: false,
    profile_id: gcProfile.id,
    profiles: [{ id: gcProfile.id }],
    options: [denomOp],
  })
  await manager.save(Product, giftCardProduct)

  const denom = manager.create(ProductVariant, {
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
  await manager.save(denom)

  await manager.insert(MoneyAmount, {
    id: "test-price_denom",
    currency_code: "usd",
    amount: 1000,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-denom",
    money_amount_id: "test-price_denom",
    variant_id: "giftcard-denom",
  })

  const op_1 = manager.create(ProductOption, {
    id: "test-option",
    title: "Size",
  })
  await manager.save(op_1)

  const testProduct = manager.create(Product, {
    id: "test-product",
    title: "test product",
    profile_id: defaultProfile.id,
    profiles: [{ id: defaultProfile.id }],
    options: [op_1],
  })
  await manager.save(testProduct)

  const quantityVariant = manager.create(ProductVariant, {
    id: "test-variant-quantity",
    title: "test variant",
    product_id: "test-product",
    inventory_quantity: 1000,
    options: [
      {
        option_id: "test-option",
        value: "Size",
      },
    ],
  })

  await manager.save(quantityVariant)

  await manager.insert(MoneyAmount, {
    id: "test-price_quantity-1",
    currency_code: "usd",
    amount: 1000,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-quantity-1",
    money_amount_id: "test-price_quantity-1",
    variant_id: "test-variant-quantity",
  })

  const quantityVariant1 = manager.create(ProductVariant, {
    id: "test-variant-quantity-1",
    title: "test variant quantity 1",
    product_id: "test-product",
    inventory_quantity: 1000,
    options: [
      {
        option_id: "test-option",
        value: "Fit",
      },
    ],
  })

  await manager.save(quantityVariant1)

  await manager.insert(MoneyAmount, {
    id: "test-price_quantity-1.5",
    currency_code: "usd",
    amount: 950,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-quantity-1.5",
    money_amount_id: "test-price_quantity-1.5",
    variant_id: "test-variant-quantity-1",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price_quantity-2",
    currency_code: "usd",
    min_quantity: 10,
    max_quantity: 100,
    amount: 800,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-quantity-2",
    money_amount_id: "test-price_quantity-2",
    variant_id: "test-variant-quantity",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price_quantity-3",
    currency_code: "usd",
    min_quantity: 100,
    amount: 700,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-quantity-3",
    money_amount_id: "test-price_quantity-3",
    variant_id: "test-variant-quantity",
  })

  const variantSale = manager.create(ProductVariant, {
    id: "test-variant-sale",
    title: "test variant",
    product_id: "test-product",
    inventory_quantity: 1000,
    options: [
      {
        option_id: "test-option",
        value: "Size",
      },
    ],
  })

  await manager.save(variantSale)

  await manager.insert(MoneyAmount, {
    id: "test-price_sale-1",
    currency_code: "usd",
    amount: 1000,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-sale-1",
    money_amount_id: "test-price_sale-1",
    variant_id: "test-variant-sale",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price-sale-2",
    currency_code: "usd",
    amount: 800,
    price_list_id: "pl_current",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-sale-2",
    money_amount_id: "test-price-sale-2",
    variant_id: "test-variant-sale",
  })

  const variantSaleCustomer = manager.create(ProductVariant, {
    id: "test-variant-sale-customer",
    title: "test variant",
    product_id: "test-product",
    inventory_quantity: 1000,
    options: [
      {
        option_id: "test-option",
        value: "Size",
      },
    ],
  })
  await manager.save(variantSaleCustomer)

  await manager.insert(MoneyAmount, {
    id: "test-price_sale-customer-1",
    currency_code: "usd",
    amount: 1000,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-sale-customer-1",
    money_amount_id: "test-price_sale-customer-1",
    variant_id: "test-variant-sale-customer",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price_sale-customer-2",
    currency_code: "usd",
    amount: 700,
    price_list_id: "pl_customer",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-sale-customer-2",
    money_amount_id: "test-price_sale-customer-2",
    variant_id: "test-variant-sale-customer",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price-sale-customer-3",
    currency_code: "usd",
    amount: 800,
    price_list_id: "pl_current",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-sale-customer-3",
    money_amount_id: "test-price_sale-customer-3",
    variant_id: "test-variant-sale-customer",
  })

  const testVariant = manager.create(ProductVariant, {
    id: "test-variant",
    title: "test variant",
    product_id: "test-product",
    inventory_quantity: 10,
    options: [
      {
        option_id: "test-option",
        value: "Size",
      },
    ],
  })
  await manager.save(testVariant)

  await manager.insert(MoneyAmount, {
    id: "test-price-1",
    currency_code: "usd",
    amount: 1000,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-1",
    money_amount_id: "test-price-1",
    variant_id: "test-variant",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price-2",
    currency_code: "eur",
    amount: 2000,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-2",
    money_amount_id: "test-price-2",
    variant_id: "test-variant",
  })

  const variant2 = await manager.insert(ProductVariant, {
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

  await manager.insert(MoneyAmount, {
    id: "test-price-2-2",
    currency_code: "usd",
    amount: 8000,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-2-1",
    money_amount_id: "test-price-2-2",
    variant_id: "test-variant-2",
  })

  const cart = manager.create(Cart, {
    id: "test-cart",
    customer_id: "some-customer",
    email: "some-customer@email.com",
    sales_channel_id: salesChannelId,
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

  const cartWithTotalFixedDiscount = manager.create(Cart, {
    id: "test-cart-w-total-fixed-discount",
    customer_id: "some-customer",
    email: "some-customer@email.com",
    discounts: [totalFixed100],
    sales_channel_id: salesChannelId,
    shipping_address: {
      id: "test-shipping-address",
      first_name: "lebron",
      country_code: "us",
    },
    region_id: "test-region",
    currency_code: "usd",
    items: [],
  })

  await manager.save(cartWithTotalFixedDiscount)

  const cartWithItemFixedDiscount = manager.create(Cart, {
    id: "test-cart-w-item-fixed-discount",
    customer_id: "some-customer",
    email: "some-customer@email.com",
    discounts: [itemFixed200],
    sales_channel_id: salesChannelId,
    shipping_address: {
      id: "test-shipping-address",
      first_name: "lebron",
      country_code: "us",
    },
    region_id: "test-region",
    currency_code: "usd",
    items: [],
  })

  await manager.save(cartWithItemFixedDiscount)

  const cartWithTotalPercDiscount = manager.create(Cart, {
    id: "test-cart-w-total-percentage-discount",
    customer_id: "some-customer",
    email: "some-customer@email.com",
    discounts: [tenPercent],
    sales_channel_id: salesChannelId,
    shipping_address: {
      id: "test-shipping-address",
      first_name: "lebron",
      country_code: "us",
    },
    region_id: "test-region",
    currency_code: "usd",
    items: [],
  })

  await manager.save(cartWithTotalPercDiscount)

  const cartWithItemPercDiscount = manager.create(Cart, {
    id: "test-cart-w-item-percentage-discount",
    customer_id: "some-customer",
    email: "some-customer@email.com",
    discounts: [itemPerc15],
    sales_channel_id: salesChannelId,
    shipping_address: {
      id: "test-shipping-address",
      first_name: "lebron",
      country_code: "us",
    },
    region_id: "test-region",
    currency_code: "usd",
    items: [],
  })

  await manager.save(cartWithItemPercDiscount)

  const cart2 = manager.create(Cart, {
    id: "test-cart-2",
    customer_id: "some-customer",
    email: "some-customer@email.com",
    sales_channel_id: salesChannelId,
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
    email: "some-customer@email.com",
    sales_channel_id: salesChannelId,
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
    product_id: "test-product",
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

  const ps = manager.create(PaymentSession, {
    id: "test-cart-session",
    cart_id: "test-cart-3",
    provider_id: "test-pay",
    is_selected: true,
    data: {},
    status: "authorized",
  })

  await manager.save(ps)

  cart3.payment_sessions = [ps]
  cart3.payment_session = ps

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
    product_id: "test-product",
    cart_id: "test-cart-3",
    should_merge: true,
    metadata: {},
  })
  await manager.save(li2)

  const cart4 = manager.create(Cart, {
    id: "test-cart-4",
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
  await manager.save(cart4)

  const variantSaleCG = manager.create(ProductVariant, {
    id: "test-variant-sale-cg",
    title: "test variant",
    product_id: "test-product",
    inventory_quantity: 1000,
    options: [
      {
        option_id: "test-option",
        value: "Size",
      },
    ],
  })
  await manager.save(variantSaleCG)

  await manager.insert(MoneyAmount, {
    id: "test-test-variant-sale-cg-1",
    currency_code: "usd",
    amount: 1000,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-sale-cg-1",
    money_amount_id: "test-test-variant-sale-cg-1",
    variant_id: "test-variant-sale-cg",
  })

  await manager.insert(MoneyAmount, {
    id: "test-test-variant-sale-cg-2",
    currency_code: "usd",
    price_list_id: "pl",
    amount: 500,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-sale-cg-2",
    money_amount_id: "test-test-variant-sale-cg-2",
    variant_id: "test-variant-sale-cg",
  })

  await manager.insert(MoneyAmount, {
    id: "test-test-variant-sale-cg-3",
    currency_code: "eur",
    amount: 700,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-sale-cg-3",
    money_amount_id: "test-test-variant-sale-cg-3",
    variant_id: "test-variant-sale-cg",
  })

  const li3 = manager.create(LineItem, {
    id: "test-item3",
    title: "Line Item",
    description: "Line Item Desc",
    thumbnail: "https://test.js/1234",
    unit_price: 8000,
    quantity: 1,
    variant_id: "test-variant-sale-cg",
    cart_id: "test-cart-3",
    product_id: "test-product",
    metadata: { "some-existing": "prop" },
  })
  await manager.save(li3)
}
