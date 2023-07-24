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

  const customer5 = await manager.create(Customer, {
    id: "test-customer-5",
    email: "test5@email.com",
    first_name: "John",
    last_name: "Deere",
    password_hash:
      "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
    has_account: true,
  })
  await manager.save(customer5)

  const customer6 = await manager.create(Customer, {
    id: "test-customer-6",
    password_hash:
      "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
    email: "test6@email.com",
    has_account: true,
  })
  await manager.save(customer6)

  const customer7 = await manager.create(Customer, {
    id: "test-customer-7",
    password_hash:
      "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
    email: "test7@email.com",
    has_account: true,
  })
  await manager.save(customer7)

  const c_group_5 = await manager.create(CustomerGroup, {
    id: "test-group-5",
    name: "test-group-5",
  })
  await manager.save(c_group_5)

  const c_group_6 = await manager.create(CustomerGroup, {
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

  const priceList = await manager.create(PriceList, {
    id: "pl",
    name: "VIP winter sale",
    description: "Winter sale for VIP customers.",
    type: "sale",
    status: "active",
  })

  await manager.save(priceList)

  const priceList1 = await manager.create(PriceList, {
    id: "pl_1",
    name: "VIP winter sale",
    description: "Winter sale for VIP customers.",
    type: "sale",
    status: "active",
  })

  priceList1.customer_groups = [c_group_5]

  await manager.save(priceList1)

  const priceList2 = await manager.create(PriceList, {
    id: "pl_2",
    name: "VVIP winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
  })

  priceList2.customer_groups = [c_group_6]

  await manager.save(priceList2)

  const priceList3 = await manager.create(PriceList, {
    id: "pl_expired",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
    starts_at: tenDaysAgo,
    ends_at: yesterday,
  })

  await manager.save(priceList3)

  const priceList4 = await manager.create(PriceList, {
    id: "pl_upcoming",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
    starts_at: tomorrow,
    ends_at: tenDaysFromToday,
  })

  await manager.save(priceList4)

  const priceList5 = await manager.create(PriceList, {
    id: "pl_current",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
    starts_at: tenDaysAgo,
    ends_at: tenDaysFromToday,
  })

  await manager.save(priceList5)

  const priceList6 = await manager.create(PriceList, {
    id: "pl_current_1",
    name: "Past winter sale",
    description: "Winter sale for key accounts.",
    type: "sale",
    status: "active",
    starts_at: tenDaysAgo,
    ends_at: tomorrow,
  })

  await manager.save(priceList6)

  const priceList7 = await manager.create(PriceList, {
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

  const priceList8 = await manager.create(PriceList, {
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

  const priceList9 = await manager.create(PriceList, {
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

  const p1 = await manager.create(Product, {
    id: "test-product",
    handle: "test-product",
    title: "Test product",
    profile_id: defaultProfile.id,
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

  const variant4 = await manager.create(ProductVariant, {
    id: "test-variant",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku",
    ean: "test-ean",
    status: "published",
    upc: "test-upc",
    product_id: "test-product",
    prices: [
      {
        id: "test-price",
        region_id: "test-region",
        currency_code: "usd",
        amount: 100,
        price_list_id: "pl_1",
      },
      {
        id: "test-price1",
        region_id: "test-region",
        currency_code: "usd",
        amount: 120,
      },
      {
        id: "test-price2",
        region_id: "test-region",
        currency_code: "usd",
        amount: 130,
        price_list_id: "pl_2",
      },
      {
        id: "test-price3",
        region_id: "test-region",
        currency_code: "usd",
        amount: 110,
        price_list_id: "pl",
      },
    ],
    options: [
      {
        id: "test-variant-option",
        value: "Default variant",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant4)

  const p2 = await manager.create(Product, {
    id: "test-product-quantity",
    handle: "test-product-quantity",
    title: "Test product",
    profile_id: defaultProfile.id,
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

  const variant_quantity = await manager.create(ProductVariant, {
    id: "test-variant-quantity",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-quantity",
    ean: "test-ean-quantity",
    status: "published",
    upc: "test-upc-quantity",
    product_id: "test-product-quantity",
    prices: [
      {
        id: "test-price-quantity",
        region_id: "test-region",
        currency_code: "usd",
        amount: 100,
        price_list_id: "pl",
        min_quantity: 10,
        max_quantity: 100,
      },
      {
        id: "test-price1-quantity",
        region_id: "test-region",
        currency_code: "usd",
        amount: 120,
        price_list_id: "pl",
        min_quantity: 101,
        max_quantity: 1000,
      },
      {
        id: "test-price1-quantity-group",
        region_id: "test-region",
        currency_code: "usd",
        amount: 120,
        min_quantity: 101,
        max_quantity: 1000,
        price_list_id: "pl_1",
      },
      {
        id: "test-price2-quantity",
        region_id: "test-region",
        currency_code: "usd",
        amount: 130,
        price_list_id: "pl",
        max_quantity: 9,
      },
      {
        id: "test-price3-quantity-expired",
        region_id: "test-region",
        currency_code: "usd",
        amount: 120,
        min_quantity: 101,
        max_quantity: 1000,
        price_list_id: "pl_expired",
      },
      {
        id: "test-price3-quantity-future",
        region_id: "test-region",
        currency_code: "usd",
        amount: 120,
        min_quantity: 101,
        max_quantity: 1000,
        price_list_id: "pl_upcoming",
      },
      {
        id: "test-price3-quantity-now",
        region_id: "test-region",
        currency_code: "usd",
        amount: 140,
        min_quantity: 101,
        max_quantity: 1000,
        price_list_id: "pl_current",
      },
      {
        id: "test-price3-quantity-default",
        region_id: "test-region",
        currency_code: "usd",
        amount: 150,
      },
    ],
    options: [
      {
        id: "test-variant-option",
        value: "Default variant",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant_quantity)

  const p3 = await manager.create(Product, {
    id: "test-product-sale",
    handle: "test-product-sale",
    title: "Test product sale",
    profile_id: defaultProfile.id,
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

  const variant_sale = await manager.create(ProductVariant, {
    id: "test-variant-sale",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-sale",
    ean: "test-ean-sale",
    status: "published",
    upc: "test-upc-sale",
    product_id: "test-product-sale",
    prices: [
      {
        id: "test-price-sale",
        region_id: "test-region",
        currency_code: "usd",
        amount: 100,
        price_list_id: "pl_expired",
      },
      {
        id: "test-price1-sale",
        region_id: "test-region",
        currency_code: "usd",
        amount: 120,
        price_list_id: "pl_current",
      },
      {
        id: "test-price2-sale",
        region_id: "test-region",
        currency_code: "usd",
        amount: 130,
        price_list_id: "pl_upcoming",
      },
      {
        id: "test-price2-sale-default",
        region_id: "test-region",
        currency_code: "usd",
        amount: 150,
      },
    ],
    options: [
      {
        id: "test-variant-option",
        value: "Default variant",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant_sale)

  const p4 = await manager.create(Product, {
    id: "test-product-sale-overlap",
    handle: "test-product-sale-overlap",
    title: "Test product sale",
    profile_id: defaultProfile.id,
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

  const variant_sale_overlap = await manager.create(ProductVariant, {
    id: "test-variant-sale-overlap",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-sale-overlap",
    ean: "test-ean-sale-overlap",
    status: "published",
    upc: "test-upc-sale-overlap",
    product_id: "test-product-sale-overlap",
    prices: [
      {
        id: "test-price-sale-overlap-1",
        region_id: "test-region",
        currency_code: "usd",
        amount: 140,
        price_list_id: "pl_current_1",
      },
      {
        id: "test-price1-sale-overlap",
        region_id: "test-region",
        currency_code: "usd",
        amount: 120,
        price_list_id: "pl_current",
      },
      {
        id: "test-price2-sale-overlap-default",
        region_id: "test-region",
        currency_code: "usd",
        amount: 150,
      },
    ],
    options: [
      {
        id: "test-variant-option-overlap",
        value: "Default variant",
        option_id: "test-option-sale-overlap",
      },
    ],
  })

  await manager.save(variant_sale_overlap)

  const multiRegionProduct = await manager.create(Product, {
    id: "test-product-multi-region",
    handle: "test-product-multi-region",
    title: "Test product",
    profile_id: defaultProfile.id,
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

  const variant_multi_region = await manager.create(ProductVariant, {
    id: "test-variant-multi-region",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-multi-region",
    ean: "test-ean-multi-region",
    status: "published",
    upc: "test-upc-multi-region",
    product_id: "test-product-multi-region",
    prices: [
      {
        id: "test-price-region-1",
        region_id: "test-region",
        currency_code: "usd",
        amount: 100,
        price_list_id: "pl",
      },
      {
        id: "test-price1-region-1",
        region_id: "test-region",
        currency_code: "usd",
        amount: 120,
      },
      {
        id: "test-price1-region-2",
        region_id: "test-region-2",
        currency_code: "dkk",
        amount: 130,
      },
      {
        id: "test-price3-region-2",
        region_id: "test-region-2",
        currency_code: "dkk",
        price_list_id: "pl",
        amount: 110,
      },
    ],
    options: [
      {
        id: "test-variant-option-multi-region",
        value: "Default variant",
        option_id: "test-option-multi-region",
      },
    ],
  })

  await manager.save(variant_multi_region)

  const p5 = await manager.create(Product, {
    id: "test-product-quantity-customer",
    handle: "test-product-quantity-customer",
    title: "Test product",
    profile_id: defaultProfile.id,
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

  const variant_quantity_customer = await manager.create(ProductVariant, {
    id: "test-variant-quantity-customer",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-quantity-customer",
    ean: "test-ean-quantity-customer",
    status: "published",
    upc: "test-upc-quantity-customer",
    product_id: "test-product-quantity-customer",
    prices: [
      {
        id: "test-price-quantity-customer",
        region_id: "test-region",
        currency_code: "usd",
        amount: 100,
        price_list_id: "pl",
        min_quantity: 10,
        max_quantity: 100,
      },
      {
        id: "test-price1-quantity-customer",
        region_id: "test-region",
        currency_code: "usd",
        amount: 120,
        price_list_id: "pl",
        min_quantity: 101,
        max_quantity: 1000,
      },
      {
        id: "test-price2-quantity-customer",
        region_id: "test-region",
        currency_code: "usd",
        amount: 130,
        price_list_id: "pl",
        max_quantity: 9,
      },
      {
        id: "test-price2-quantity-customer-group",
        region_id: "test-region",
        currency_code: "usd",
        amount: 100,
        max_quantity: 9,
        price_list_id: "pl_1",
      },
      {
        id: "test-price3-quantity-customer-expired",
        region_id: "test-region",
        currency_code: "usd",
        amount: 120,
        min_quantity: 101,
        max_quantity: 1000,
        price_list_id: "pl_expired",
      },
      {
        id: "test-price3-quantity-customer-future",
        region_id: "test-region",
        currency_code: "usd",
        amount: 120,
        min_quantity: 101,
        max_quantity: 1000,
        price_list_id: "pl_upcoming",
      },
      {
        id: "test-price3-quantity-customer-now",
        region_id: "test-region",
        currency_code: "usd",
        amount: 140,
        min_quantity: 101,
        max_quantity: 1000,
        price_list_id: "pl_current",
      },
      {
        id: "test-price3-quantity-customer-default",
        region_id: "test-region",
        currency_code: "usd",
        amount: 150,
      },
    ],
    options: [
      {
        id: "test-variant-option",
        value: "Default variant",
        option_id: "test-option-quantity-customer",
      },
    ],
  })

  await manager.save(variant_quantity_customer)

  const p6 = await manager.create(Product, {
    id: "test-product-sale-customer",
    handle: "test-product-sale-customer",
    title: "Test product sale",
    profile_id: defaultProfile.id,
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

  const variant_sale_customer = await manager.create(ProductVariant, {
    id: "test-variant-sale-customer",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-sale-customer",
    ean: "test-ean-sale-customer",
    status: "published",
    upc: "test-upc-sale-customer",
    product_id: "test-product-sale-customer",
    prices: [
      {
        id: "test-price-sale-customer",
        region_id: "test-region",
        currency_code: "usd",
        amount: 120,
        price_list_id: "pl_expired-customer",
      },
      {
        id: "test-price1-sale-customer",
        region_id: "test-region",
        currency_code: "usd",
        amount: 100,
        price_list_id: "pl_current-customer",
      },
      {
        id: "test-price2-sale-customer",
        region_id: "test-region",
        currency_code: "usd",
        amount: 130,
        price_list_id: "pl_upcoming-customer",
      },
      {
        id: "test-price2-sale-customer-default",
        region_id: "test-region",
        currency_code: "usd",
        amount: 150,
        type: "default",
      },
    ],
    options: [
      {
        id: "test-variant-option",
        value: "Default variant",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant_sale_customer)

  const p7 = await manager.create(Product, {
    id: "test-product-sale-customer-quantity",
    handle: "test-product-sale-customer-quantity",
    title: "Test product sale",
    profile_id: defaultProfile.id,
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

  const variant_sale_customer_quantity = await manager.create(ProductVariant, {
    id: "test-variant-sale-customer-quantity",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku-sale-customer-quantity",
    ean: "test-ean-sale-customer-quantity",
    status: "published",
    upc: "test-upc-sale-customer-quantity",
    product_id: "test-product-sale-customer-quantity",
    prices: [
      {
        id: "test-price-sale-customer-quantity",
        region_id: "test-region",
        currency_code: "usd",
        amount: 120,
        min_quantity: 100,
        max_quantity: 1000,
        price_list_id: "pl_expired-customer",
      },
      {
        id: "test-price1-sale-customer-quantity-groups",
        region_id: "test-region",
        currency_code: "usd",
        amount: 100,
        max_quantity: 99,
        price_list_id: "pl_current-customer",
      },
      {
        id: "test-price2-sale-customer-quantity",
        region_id: "test-region",
        currency_code: "usd",
        amount: 130,
        min_quantity: 500,
        max_quantity: 900,
        price_list_id: "pl_upcoming-customer",
      },
      {
        id: "test-price2-sale-customer-quantity-default",
        region_id: "test-region",
        currency_code: "usd",
        amount: 150,
      },
      {
        id: "test-price1-sale-customer-quantity",
        region_id: "test-region",
        currency_code: "usd",
        amount: 110,
        max_quantity: 99,
      },
    ],
    options: [
      {
        id: "test-variant-option",
        value: "Default variant",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant_sale_customer_quantity)

  const cart = await manager.create(Cart, {
    id: "test-cart",
    region_id: "test-region",
    currency_code: "usd",
    items: [],
  })

  await manager.save(cart)

  const cart_region2 = await manager.create(Cart, {
    id: "test-cart-1",
    region_id: "test-region-2",
    currency_code: "dkk",
    items: [],
  })

  await manager.save(cart_region2)

  const cart_region1 = await manager.create(Cart, {
    id: "test-cart-2",
    region_id: "test-region-1",
    currency_code: "usd",
    items: [],
  })

  await manager.save(cart_region1)
}
