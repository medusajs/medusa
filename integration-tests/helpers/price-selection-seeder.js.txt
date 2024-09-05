const { ProductVariantMoneyAmount } = require("@medusajs/medusa")
const { MoneyAmount } = require("@medusajs/medusa")
const {
  Customer,
  CustomerGroup,
  ShippingProfile,
  Product,
  ProductVariant,
  ProductCollection,
  ProductOption,
  Region,
  Cart,
  PriceList,
  ShippingProfileType,
} = require("@medusajs/medusa")

module.exports = async (dataSource, data = {}) => {
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

  await manager.insert(Region, {
    id: "test-region",
    name: "Test Region",
    currency_code: "usd",
    tax_rate: 0,
  })

  await manager.insert(Region, {
    id: "test-region-1",
    name: "Test Region no prices",
    currency_code: "usd",
    tax_rate: 0,
  })

  await manager.insert(Region, {
    id: "test-region-2",
    name: "Test Region no prices",
    currency_code: "dkk",
    tax_rate: 0,
  })

  const coll = manager.create(ProductCollection, {
    id: "test-collection",
    handle: "test-collection",
    title: "Test collection",
  })
  await manager.save(coll)

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

  const customer6 = manager.create(Customer, {
    id: "test-customer-6",
    password_hash:
      "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
    email: "test6@email.com",
    has_account: true,
  })
  await manager.save(customer6)

  const customer7 = manager.create(Customer, {
    id: "test-customer-7",
    password_hash:
      "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
    email: "test7@email.com",
    has_account: true,
  })
  await manager.save(customer7)

  const c_group_5 = manager.create(CustomerGroup, {
    id: "test-group-5",
    name: "test-group-5",
  })
  await manager.save(c_group_5)

  const c_group_6 = manager.create(CustomerGroup, {
    id: "test-group-6",
    name: "test-group-6",
  })
  await manager.save(c_group_6)

  customer5.groups = [c_group_5]
  await manager.save(customer5)

  customer6.groups = [c_group_6]
  await manager.save(customer6)

  customer7.groups = [c_group_5, c_group_6]
  await manager.save(customer7)

  const priceList = manager.create(PriceList, {
    id: "pl",
    name: "VIP winter sale",
    description: "Winter sale for VIP customers.",
    type: "sale",
    status: "active",
  })

  await manager.save(priceList)

  const priceList1 = manager.create(PriceList, {
    id: "pl_1",
    name: "VIP winter sale",
    description: "Winter sale for VIP customers.",
    type: "sale",
    status: "active",
  })

  priceList1.customer_groups = [c_group_5]

  await manager.save(priceList1)

  const priceList2 = manager.create(PriceList, {
    id: "pl_2",
    name: "VVIP winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
  })

  priceList2.customer_groups = [c_group_6]

  await manager.save(priceList2)

  const priceList3 = manager.create(PriceList, {
    id: "pl_expired",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
    starts_at: tenDaysAgo,
    ends_at: yesterday,
  })

  await manager.save(priceList3)

  const priceList4 = manager.create(PriceList, {
    id: "pl_upcoming",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
    starts_at: tomorrow,
    ends_at: tenDaysFromToday,
  })

  await manager.save(priceList4)

  const priceList5 = manager.create(PriceList, {
    id: "pl_current",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
    starts_at: tenDaysAgo,
    ends_at: tenDaysFromToday,
  })

  await manager.save(priceList5)

  const priceList6 = manager.create(PriceList, {
    id: "pl_current_1",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
    starts_at: tenDaysAgo,
    ends_at: tomorrow,
  })

  await manager.save(priceList6)

  const priceList7 = manager.create(PriceList, {
    id: "pl_upcoming-customer",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
    starts_at: tomorrow,
    ends_at: tenDaysFromToday,
  })

  priceList7.customer_groups = [c_group_5]

  await manager.save(priceList7)

  const priceList8 = manager.create(PriceList, {
    id: "pl_current-customer",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
    starts_at: tenDaysAgo,
    ends_at: tenDaysFromToday,
  })

  priceList8.customer_groups = [c_group_5]

  await manager.save(priceList8)

  const priceList9 = manager.create(PriceList, {
    id: "pl_expired-customer",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
    starts_at: tenDaysAgo,
    ends_at: yesterday,
  })

  priceList9.customer_groups = [c_group_5]

  await manager.save(priceList9)

  const p1 = manager.create(Product, {
    id: "test-product",
    handle: "test-product",
    title: "Test product",
    profile_id: defaultProfile.id,
    profiles: [{ id: defaultProfile.id }],
    description: "test-product-description1",
    collection_id: "test-collection",
    tags: [],
  })

  await manager.save(p1)

  await manager.save(ProductOption, {
    id: "test-option",
    title: "test-option",
    product_id: "test-product",
  })

  const variant4 = manager.create(ProductVariant, {
    id: "test-variant",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku",
    ean: "test-ean",
    status: "published",
    upc: "test-upc",
    product_id: "test-product",
    options: [
      {
        id: "test-variant-option",
        value: "Default variant",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant4)

  await manager.insert(MoneyAmount, {
    id: "test-price",
    region_id: "test-region",
    currency_code: "usd",
    amount: 100,
    price_list_id: "pl_1",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant",
    money_amount_id: "test-price",
    variant_id: "test-variant",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price-1",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-1",
    money_amount_id: "test-price-1",
    variant_id: "test-variant",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price-2",
    region_id: "test-region",
    currency_code: "usd",
    amount: 90,
    price_list_id: "pl_2",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-2",
    money_amount_id: "test-price-2",
    variant_id: "test-variant",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price-3",
    region_id: "test-region",
    currency_code: "usd",
    amount: 110,
    price_list_id: "pl",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-3",
    money_amount_id: "test-price-3",
    variant_id: "test-variant",
  })

  const p2 = manager.create(Product, {
    id: "test-product-quantity",
    handle: "test-product-quantity",
    title: "Test product",
    profile_id: defaultProfile.id,
    profiles: [{ id: defaultProfile.id }],
    description: "test-product-description1",
    collection_id: "test-collection",
    tags: [],
  })

  await manager.save(p2)

  await manager.save(ProductOption, {
    id: "test-option",
    title: "test-option",
    product_id: "test-product-quantity",
  })

  const variant_quantity = manager.create(ProductVariant, {
    id: "test-variant-quantity",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-quantity",
    ean: "test-ean-quantity",
    status: "published",
    upc: "test-upc-quantity",
    product_id: "test-product-quantity",
    prices: [],
    options: [
      {
        id: "test-variant-option",
        value: "Default variant",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant_quantity)

  await manager.insert(MoneyAmount, {
    id: "test-price-quantity",
    region_id: "test-region",
    currency_code: "usd",
    amount: 100,
    price_list_id: "pl",
    min_quantity: 10,
    max_quantity: 100,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-quantity",
    money_amount_id: "test-price-quantity",
    variant_id: "test-variant-quantity",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price1-quantity",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
    price_list_id: "pl",
    min_quantity: 101,
    max_quantity: 1000,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-quantity-1",
    money_amount_id: "test-price1-quantity",
    variant_id: "test-variant-quantity",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price1-quantity-group",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
    min_quantity: 101,
    max_quantity: 1000,
    price_list_id: "pl_1",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-quantity-2",
    money_amount_id: "test-price1-quantity-group",
    variant_id: "test-variant-quantity",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price2-quantity",
    region_id: "test-region",
    currency_code: "usd",
    amount: 130,
    price_list_id: "pl",
    max_quantity: 9,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-quantity-3",
    money_amount_id: "test-price2-quantity",
    variant_id: "test-variant-quantity",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price3-quantity-expired",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
    min_quantity: 101,
    max_quantity: 1000,
    price_list_id: "pl_expired",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-quantity-4",
    money_amount_id: "test-price3-quantity-expired",
    variant_id: "test-variant-quantity",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price3-quantity-future",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
    min_quantity: 101,
    max_quantity: 1000,
    price_list_id: "pl_upcoming",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-quantity-5",
    money_amount_id: "test-price3-quantity-future",
    variant_id: "test-variant-quantity",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price3-quantity-now",
    region_id: "test-region",
    currency_code: "usd",
    amount: 140,
    min_quantity: 101,
    max_quantity: 1000,
    price_list_id: "pl_current",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-quantity-6",
    money_amount_id: "test-price3-quantity-now",
    variant_id: "test-variant-quantity",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price3-quantity-default",
    region_id: "test-region",
    currency_code: "usd",
    amount: 150,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-quantity-7",
    money_amount_id: "test-price3-quantity-default",
    variant_id: "test-variant-quantity",
  })

  const p3 = manager.create(Product, {
    id: "test-product-sale",
    handle: "test-product-sale",
    title: "Test product sale",
    profile_id: defaultProfile.id,
    profiles: [{ id: defaultProfile.id }],
    description: "test-product-description1",
    collection_id: "test-collection",
    tags: [],
  })

  await manager.save(p3)

  await manager.save(ProductOption, {
    id: "test-option-sale",
    title: "test-option sale",
    product_id: "test-product-sale",
  })

  const variant_sale = manager.create(ProductVariant, {
    id: "test-variant-sale",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-sale",
    ean: "test-ean-sale",
    status: "published",
    upc: "test-upc-sale",
    product_id: "test-product-sale",
    options: [
      {
        id: "test-variant-option",
        value: "Default variant",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant_sale)

  await manager.insert(MoneyAmount, {
    id: "test-price-sale",
    region_id: "test-region",
    currency_code: "usd",
    amount: 100,
    price_list_id: "pl_expired",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-sale",
    money_amount_id: "test-price-sale",
    variant_id: "test-variant-sale",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price1-sale",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
    price_list_id: "pl_current",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-sale-1",
    money_amount_id: "test-price1-sale",
    variant_id: "test-variant-sale",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price2-sale",
    region_id: "test-region",
    currency_code: "usd",
    amount: 130,
    price_list_id: "pl_upcoming",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-sale-2",
    money_amount_id: "test-price2-sale",
    variant_id: "test-variant-sale",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price2-sale-default",
    region_id: "test-region",
    currency_code: "usd",
    amount: 150,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-sale-3",
    money_amount_id: "test-price2-sale-default",
    variant_id: "test-variant-sale",
  })

  const p4 = manager.create(Product, {
    id: "test-product-sale-overlap",
    handle: "test-product-sale-overlap",
    title: "Test product sale",
    profile_id: defaultProfile.id,
    profiles: [{ id: defaultProfile.id }],
    description: "test-product-description1",
    collection_id: "test-collection",
    tags: [],
  })

  await manager.save(p4)

  await manager.save(ProductOption, {
    id: "test-option-sale-overlap",
    title: "test-option sale",
    product_id: "test-product-sale-overlap",
  })

  const variant_sale_overlap = manager.create(ProductVariant, {
    id: "test-variant-sale-overlap",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-sale-overlap",
    ean: "test-ean-sale-overlap",
    status: "published",
    upc: "test-upc-sale-overlap",
    product_id: "test-product-sale-overlap",
    options: [
      {
        id: "test-variant-option-overlap",
        value: "Default variant",
        option_id: "test-option-sale-overlap",
      },
    ],
  })

  await manager.save(variant_sale_overlap)

  await manager.insert(MoneyAmount, {
    id: "test-price-sale-overlap-1",
    region_id: "test-region",
    currency_code: "usd",
    amount: 140,
    price_list_id: "pl_current_1",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-sale-overlap-1",
    money_amount_id: "test-price-sale-overlap-1",
    variant_id: "test-variant-sale-overlap",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price1-sale-overlap",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
    price_list_id: "pl_current",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-sale-overlap-2",
    money_amount_id: "test-price1-sale-overlap",
    variant_id: "test-variant-sale-overlap",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price2-sale-overlap-default",
    region_id: "test-region",
    currency_code: "usd",
    amount: 150,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-variant-sale-overlap-3",
    money_amount_id: "test-price2-sale-overlap-default",
    variant_id: "test-variant-sale-overlap",
  })

  const multiRegionProduct = manager.create(Product, {
    id: "test-product-multi-region",
    handle: "test-product-multi-region",
    title: "Test product",
    profile_id: defaultProfile.id,
    profiles: [{ id: defaultProfile.id }],
    description: "test-product-multi-region-description1",
    collection_id: "test-collection",
    tags: [],
  })

  await manager.save(multiRegionProduct)

  await manager.save(ProductOption, {
    id: "test-option-multi-region",
    title: "test-option",
    product_id: "test-product-multi-region",
  })

  const variant_multi_region = manager.create(ProductVariant, {
    id: "test-variant-multi-region",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-multi-region",
    ean: "test-ean-multi-region",
    status: "published",
    upc: "test-upc-multi-region",
    product_id: "test-product-multi-region",
    options: [
      {
        id: "test-variant-option-multi-region",
        value: "Default variant",
        option_id: "test-option-multi-region",
      },
    ],
  })

  await manager.save(variant_multi_region)

  await manager.insert(MoneyAmount, {
    id: "test-price-region-1",
    region_id: "test-region",
    currency_code: "usd",
    amount: 100,
    price_list_id: "pl",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-multi-region-1",
    money_amount_id: "test-price-region-1",
    variant_id: "test-variant-multi-region",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price1-region-1",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-multi-region-2",
    money_amount_id: "test-price1-region-1",
    variant_id: "test-variant-multi-region",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price1-region-2",
    region_id: "test-region-2",
    currency_code: "dkk",
    amount: 130,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-multi-region-3",
    money_amount_id: "test-price1-region-2",
    variant_id: "test-variant-multi-region",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price3-region-2",
    region_id: "test-region-2",
    currency_code: "dkk",
    price_list_id: "pl",
    amount: 110,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-multi-region-4",
    money_amount_id: "test-price3-region-2",
    variant_id: "test-variant-multi-region",
  })

  const p5 = manager.create(Product, {
    id: "test-product-quantity-customer",
    handle: "test-product-quantity-customer",
    title: "Test product",
    profile_id: defaultProfile.id,
    profiles: [{ id: defaultProfile.id }],
    description: "test-product-description1",
    collection_id: "test-collection",
    tags: [],
  })

  await manager.save(p5)

  await manager.save(ProductOption, {
    id: "test-option-quantity-customer",
    title: "test-option",
    product_id: "test-product-quantity-customer",
  })

  const variant_quantity_customer = manager.create(ProductVariant, {
    id: "test-variant-quantity-customer",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-quantity-customer",
    ean: "test-ean-quantity-customer",
    status: "published",
    upc: "test-upc-quantity-customer",
    product_id: "test-product-quantity-customer",
    options: [
      {
        id: "test-variant-option",
        value: "Default variant",
        option_id: "test-option-quantity-customer",
      },
    ],
  })

  await manager.save(variant_quantity_customer)

  await manager.insert(MoneyAmount, {
    id: "test-price-quantity-customer",
    region_id: "test-region",
    currency_code: "usd",
    amount: 100,
    price_list_id: "pl",
    min_quantity: 10,
    max_quantity: 100,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-quantity-customer-1",
    money_amount_id: "test-price-quantity-customer",
    variant_id: "test-variant-quantity-customer",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price1-quantity-customer",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
    price_list_id: "pl",
    min_quantity: 101,
    max_quantity: 1000,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-quantity-customer-2",
    money_amount_id: "test-price1-quantity-customer",
    variant_id: "test-variant-quantity-customer",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price2-quantity-customer",
    region_id: "test-region",
    currency_code: "usd",
    amount: 130,
    price_list_id: "pl",
    max_quantity: 9,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-quantity-customer-3",
    money_amount_id: "test-price2-quantity-customer",
    variant_id: "test-variant-quantity-customer",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price2-quantity-customer-group",
    region_id: "test-region",
    currency_code: "usd",
    amount: 100,
    max_quantity: 9,
    price_list_id: "pl_1",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-quantity-customer-4",
    money_amount_id: "test-price2-quantity-customer-group",
    variant_id: "test-variant-quantity-customer",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price3-quantity-customer-expired",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
    min_quantity: 101,
    max_quantity: 1000,
    price_list_id: "pl_expired",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-quantity-customer-5",
    money_amount_id: "test-price3-quantity-customer-expired",
    variant_id: "test-variant-quantity-customer",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price3-quantity-customer-future",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
    min_quantity: 101,
    max_quantity: 1000,
    price_list_id: "pl_upcoming",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-quantity-customer-6",
    money_amount_id: "test-price3-quantity-customer-future",
    variant_id: "test-variant-quantity-customer",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price3-quantity-customer-now",
    region_id: "test-region",
    currency_code: "usd",
    amount: 140,
    min_quantity: 101,
    max_quantity: 1000,
    price_list_id: "pl_current",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-quantity-customer-7",
    money_amount_id: "test-price3-quantity-customer-now",
    variant_id: "test-variant-quantity-customer",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price3-quantity-customer-default",
    region_id: "test-region",
    currency_code: "usd",
    amount: 150,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-quantity-customer-8",
    money_amount_id: "test-price3-quantity-customer-default",
    variant_id: "test-variant-quantity-customer",
  })

  const p6 = manager.create(Product, {
    id: "test-product-sale-customer",
    handle: "test-product-sale-customer",
    title: "Test product sale",
    profile_id: defaultProfile.id,
    profiles: [{ id: defaultProfile.id }],
    description: "test-product-description1",
    collection_id: "test-collection",
    tags: [],
  })

  await manager.save(p6)

  await manager.save(ProductOption, {
    id: "test-option-sale",
    title: "test-option sale",
    product_id: "test-product-sale-customer",
  })

  const variant_sale_customer = manager.create(ProductVariant, {
    id: "test-variant-sale-customer",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-sale-customer",
    ean: "test-ean-sale-customer",
    status: "published",
    upc: "test-upc-sale-customer",
    product_id: "test-product-sale-customer",
    options: [
      {
        id: "test-variant-option",
        value: "Default variant",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant_sale_customer)

  await manager.insert(MoneyAmount, {
    id: "test-price-sale-customer",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
    price_list_id: "pl_expired-customer",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-sale-custome-1",
    money_amount_id: "test-price-sale-customer",
    variant_id: "test-variant-sale-customer",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price1-sale-customer",
    region_id: "test-region",
    currency_code: "usd",
    amount: 100,
    price_list_id: "pl_current-customer",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-sale-custome-2",
    money_amount_id: "test-price1-sale-customer",
    variant_id: "test-variant-sale-customer",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price2-sale-customer",
    region_id: "test-region",
    currency_code: "usd",
    amount: 130,
    price_list_id: "pl_upcoming-customer",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-sale-custome-3",
    money_amount_id: "test-price2-sale-customer",
    variant_id: "test-variant-sale-customer",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price2-sale-customer-default",
    region_id: "test-region",
    currency_code: "usd",
    amount: 150,
    type: "default",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-sale-custome-4",
    money_amount_id: "test-price2-sale-customer-default",
    variant_id: "test-variant-sale-customer",
  })

  const p7 = manager.create(Product, {
    id: "test-product-sale-customer-quantity",
    handle: "test-product-sale-customer-quantity",
    title: "Test product sale",
    profile_id: defaultProfile.id,
    profiles: [{ id: defaultProfile.id }],
    description: "test-product-description1",
    collection_id: "test-collection",
    tags: [],
  })

  await manager.save(p7)

  await manager.save(ProductOption, {
    id: "test-option-sale",
    title: "test-option sale",
    product_id: "test-product-sale-customer-quantity",
  })

  const variant_sale_customer_quantity = manager.create(ProductVariant, {
    id: "test-variant-sale-customer-quantity",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-sale-customer-quantity",
    ean: "test-ean-sale-customer-quantity",
    status: "published",
    upc: "test-upc-sale-customer-quantity",
    product_id: "test-product-sale-customer-quantity",
    options: [
      {
        id: "test-variant-option",
        value: "Default variant",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant_sale_customer_quantity)

  await manager.insert(MoneyAmount, {
    id: "test-price-sale-customer-quantity",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
    min_quantity: 100,
    max_quantity: 1000,
    price_list_id: "pl_expired-customer",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-sale-customer-quantity-1",
    money_amount_id: "test-price-sale-customer-quantity",
    variant_id: "test-variant-sale-customer-quantity",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price1-sale-customer-quantity-groups",
    region_id: "test-region",
    currency_code: "usd",
    amount: 100,
    max_quantity: 99,
    price_list_id: "pl_current-customer",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-sale-customer-quantity-2",
    money_amount_id: "test-price1-sale-customer-quantity-groups",
    variant_id: "test-variant-sale-customer-quantity",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price2-sale-customer-quantity",
    region_id: "test-region",
    currency_code: "usd",
    amount: 130,
    min_quantity: 500,
    max_quantity: 900,
    price_list_id: "pl_upcoming-customer",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-sale-customer-quantity-3",
    money_amount_id: "test-price2-sale-customer-quantity",
    variant_id: "test-variant-sale-customer-quantity",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price2-sale-customer-quantity-default",
    region_id: "test-region",
    currency_code: "usd",
    amount: 150,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-sale-customer-quantity-4",
    money_amount_id: "test-price2-sale-customer-quantity-default",
    variant_id: "test-variant-sale-customer-quantity",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price1-sale-customer-quantity",
    region_id: "test-region",
    currency_code: "usd",
    amount: 110,
    max_quantity: 99,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-sale-customer-quantity-5",
    money_amount_id: "test-price1-sale-customer-quantity",
    variant_id: "test-variant-sale-customer-quantity",
  })

  const cart = manager.create(Cart, {
    id: "test-cart",
    region_id: "test-region",
    currency_code: "usd",
    items: [],
  })

  await manager.save(cart)

  const cart_region2 = manager.create(Cart, {
    id: "test-cart-1",
    region_id: "test-region-2",
    currency_code: "dkk",
    items: [],
  })

  await manager.save(cart_region2)

  const cart_region1 = manager.create(Cart, {
    id: "test-cart-2",
    region_id: "test-region-1",
    currency_code: "usd",
    items: [],
  })

  await manager.save(cart_region1)

  const customerPl = manager.create(Customer, {
    id: "test-customer-5-pl",
    email: "test5@email-pl.com",
    first_name: "John",
    last_name: "Deere",
    password_hash:
      "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
    has_account: true,
  })
  await manager.save(customerPl)

  const pPl = manager.create(Product, {
    id: "test-product-pl",
    handle: "test-product-pl",
    title: "Test product",
    profile_id: defaultProfile.id,
    description: "test-product-description1",
    collection_id: "test-collection",
    tags: [],
  })

  await manager.save(pPl)

  await manager.save(ProductOption, {
    id: "test-option-pl",
    title: "test-option",
    product_id: "test-product-pl",
  })

  const c_group_pl = manager.create(CustomerGroup, {
    id: "test-group-pl",
    name: "test-group-pl",
  })
  await manager.save(c_group_pl)

  customerPl.groups = [c_group_pl]
  await manager.save(customerPl)

  const c_group_not_pl = manager.create(CustomerGroup, {
    id: "test-group-not-pl",
    name: "test-group-not-pl",
  })
  await manager.save(c_group_not_pl)

  const priceListPl = manager.create(PriceList, {
    id: "pl_current_pl",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
  })

  priceListPl.customer_groups = [c_group_pl]
  await manager.save(priceListPl)

  const priceListNotPL = manager.create(PriceList, {
    id: "pl_current_not_pl",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
  })
  priceListNotPL.customer_groups = [c_group_not_pl]

  await manager.save(priceListNotPL)

  const variantPl = manager.create(ProductVariant, {
    id: "test-variant-pl",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-pl",
    status: "published",
    product_id: "test-product-pl",
    options: [
      {
        id: "test-variant-option-pl",
        value: "Default variant",
        option_id: "test-option-pl",
      },
    ],
  })

  await manager.save(variantPl)

  await manager.insert(MoneyAmount, {
    id: "test-price120",
    region_id: "test-region",
    currency_code: "usd",
    amount: 90,
    price_list_id: "pl_current_not_pl",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-pl-1",
    money_amount_id: "test-price120",
    variant_id: "test-variant-pl",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price1120",
    region_id: "test-region",
    currency_code: "usd",
    amount: 120,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-pl-2",
    money_amount_id: "test-price1120",
    variant_id: "test-variant-pl",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price2120",
    region_id: "test-region",
    currency_code: "usd",
    amount: 110,
    price_list_id: "pl_current_pl",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma-test-variant-pl-3",
    money_amount_id: "test-price2120",
    variant_id: "test-variant-pl",
  })
}
