const {
  ProductCollection,
  ProductTag,
  ProductType,
  ProductOption,
  Region,
  Product,
  ShippingProfile,
  ProductVariant,
  Image,
} = require("@medusajs/medusa")

module.exports = async (connection, data = {}) => {
  const manager = connection.manager

  const defaultProfile = await manager.findOne(ShippingProfile, {
    type: "default",
  })

  const coll = manager.create(ProductCollection, {
    id: "test-collection",
    handle: "test-collection",
    title: "Test collection",
  })

  await manager.save(coll)

  const coll1 = manager.create(ProductCollection, {
    id: "test-collection1",
    handle: "test-collection1",
    title: "Test collection 1",
  })

  await manager.save(coll1)

  const coll2 = manager.create(ProductCollection, {
    id: "test-collection2",
    handle: "test-collection2",
    title: "Test collection 2",
  })

  await manager.save(coll2)

  const tag = manager.create(ProductTag, {
    id: "tag1",
    value: "123",
  })

  await manager.save(tag)

  const tag3 = manager.create(ProductTag, {
    id: "tag3",
    value: "123",
  })

  await manager.save(tag3)

  const tag4 = manager.create(ProductTag, {
    id: "tag4",
    value: "123",
  })

  await manager.save(tag4)

  const type = manager.create(ProductType, {
    id: "test-type",
    value: "test-type",
  })

  await manager.save(type)

  const image = manager.create(Image, {
    id: "test-image",
    url: "test-image.png",
  })

  await manager.save(image)

  await manager.insert(Region, {
    id: "test-region",
    name: "Test Region",
    currency_code: "usd",
    tax_rate: 0,
  })

  const p = manager.create(Product, {
    id: "test-product",
    handle: "test-product",
    title: "Test product",
    profile_id: defaultProfile.id,
    description: "test-product-description",
    collection_id: "test-collection",
    type: { id: "test-type", value: "test-type" },
    tags: [
      { id: "tag1", value: "123" },
      { tag: "tag2", value: "456" },
    ],
  })

  p.images = [image]

  await manager.save(p)

  await manager.save(ProductOption, {
    id: "test-option",
    title: "test-option",
    product_id: "test-product",
  })

  const variant1 = await manager.create(ProductVariant, {
    id: "test-variant",
    inventory_quantity: 10,
    title: "Test variant",
    variant_rank: 0,
    sku: "test-sku",
    ean: "test-ean",
    upc: "test-upc",
    barcode: "test-barcode",
    product_id: "test-product",
    prices: [{ id: "test-price", currency_code: "usd", amount: 100 }],
    options: [
      {
        id: "test-variant-option",
        value: "Default variant",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant1)

  const variant2 = await manager.create(ProductVariant, {
    id: "test-variant_1",
    inventory_quantity: 10,
    title: "Test variant rank (1)",
    variant_rank: 2,
    sku: "test-sku1",
    ean: "test-ean1",
    upc: "test-upc1",
    barcode: "test-barcode 1",
    product_id: "test-product",
    prices: [{ id: "test-price1", currency_code: "usd", amount: 100 }],
    options: [
      {
        id: "test-variant-option-1",
        value: "Default variant 1",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant2)

  const variant3 = await manager.create(ProductVariant, {
    id: "test-variant_2",
    inventory_quantity: 10,
    title: "Test variant rank (2)",
    variant_rank: 1,
    sku: "test-sku2",
    ean: "test-ean2",
    upc: "test-upc2",
    product_id: "test-product",
    prices: [{ id: "test-price2", currency_code: "usd", amount: 100 }],
    options: [
      {
        id: "test-variant-option-2",
        value: "Default variant 2",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant3)

  const p1 = manager.create(Product, {
    id: "test-product1",
    handle: "test-product1",
    title: "Test product1",
    profile_id: defaultProfile.id,
    description: "test-product-description1",
    collection_id: "test-collection",
    type: { id: "test-type", value: "test-type" },
    tags: [
      { id: "tag1", value: "123" },
      { tag: "tag2", value: "456" },
    ],
  })

  await manager.save(p1)

  const variant4 = await manager.create(ProductVariant, {
    id: "test-variant_3",
    inventory_quantity: 10,
    title: "Test variant rank (2)",
    variant_rank: 1,
    sku: "test-sku3",
    ean: "test-ean3",
    upc: "test-upc3",
    product_id: "test-product1",
    prices: [{ id: "test-price3", currency_code: "usd", amount: 100 }],
    options: [
      {
        id: "test-variant-option-3",
        value: "Default variant 3",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant4)

  const variant5 = await manager.create(ProductVariant, {
    id: "test-variant_4",
    inventory_quantity: 10,
    title: "Test variant rank (2)",
    variant_rank: 0,
    sku: "test-sku4",
    ean: "test-ean4",
    upc: "test-upc4",
    product_id: "test-product1",
    prices: [{ id: "test-price4", currency_code: "usd", amount: 100 }],
    options: [
      {
        id: "test-variant-option-4",
        value: "Default variant 4",
        option_id: "test-option",
      },
    ],
  })

  await manager.save(variant5)

  const product1 = manager.create(Product, {
    id: "test-product_filtering_1",
    handle: "test-product_filtering_1",
    title: "Test product filtering 1",
    profile_id: defaultProfile.id,
    description: "test-product-description",
    type: { id: "test-type", value: "test-type" },
    collection_id: "test-collection1",
    status: "proposed",
    tags: [{ id: "tag3", value: "123" }],
  })

  await manager.save(product1)

  const product2 = manager.create(Product, {
    id: "test-product_filtering_2",
    handle: "test-product_filtering_2",
    title: "Test product filtering 2",
    profile_id: defaultProfile.id,
    description: "test-product-description",
    type: { id: "test-type", value: "test-type" },
    collection_id: "test-collection2",
    status: "published",
    tags: [{ id: "tag3", value: "123" }],
  })

  await manager.save(product2)

  const product3 = manager.create(Product, {
    id: "test-product_filtering_3",
    handle: "test-product_filtering_3",
    title: "Test product filtering 3",
    profile_id: defaultProfile.id,
    description: "test-product-description",
    type: { id: "test-type", value: "test-type" },
    collection_id: "test-collection1",
    status: "draft",
    tags: [{ id: "tag4", value: "1234" }],
  })

  await manager.save(product3)

  const product4 = manager.create(Product, {
    id: "test-product_filtering_4",
    handle: "test-product_filtering_4",
    title: "Test product filtering 4",
    profile_id: defaultProfile.id,
    description: "test-product-description",
    status: "proposed",
    deleted_at: new Date().toISOString(),
  })

  await manager.save(product4)
}
