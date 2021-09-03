const {
  ProductCollection,
  ProductTag,
  ProductType,
  ProductOption,
  ProductOptionValue,
  Region,
  Product,
  ShippingProfile,
  ProductVariant,
  Image,
  MoneyAmount,
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

  const tag = manager.create(ProductTag, {
    id: "tag1",
    value: "123",
  })

  await manager.save(tag)

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

  const productOption = manager.create(ProductOption, {
    id: "test-option",
    title: "test-option",
  })

  await manager.save(productOption)

  p.options = [productOption]

  p.images = [image]

  await manager.save(p)

  const variant1 = await manager.create(ProductVariant, {
    id: "test-variant",
    inventory_quantity: 10,
    title: "Test variant",
    rank: 0,
    sku: "test-sku",
    ean: "test-ean",
    upc: "test-upc",
    barcode: "test-barcode",
    product_id: "test-product",
    prices: [{ id: "test-price", currency_code: "usd", amount: 100 }],
    // options: [{ id: "test-variant-option", value: "Default variant" }],
  })

  const variantOption_1 = manager.create(ProductOptionValue, {
    id: "test-option-variant1",
    option_id: "test-option",
    value: "test-option1",
    variant_id: "test-variant",
    // product_id: "test-product",
  })

  // variant1.options = [variantOption_1]

  await manager.save(variant1)
  await manager.save(variantOption_1)

  const variant2 = await manager.create(ProductVariant, {
    id: "test-variant_1",
    inventory_quantity: 10,
    title: "Test variant rank (1)",
    rank: 2,
    sku: "test-sku1",
    ean: "test-ean1",
    upc: "test-upc1",
    barcode: "test-barcode 1",
    product_id: "test-product",
    prices: [{ id: "test-price1", currency_code: "usd", amount: 100 }],
    // options: [{ id: "test-variant-option-1", value: "Default variant 1" }],
  })

  const variantOption_2 = manager.create(ProductOptionValue, {
    id: "test-option-variant2",
    option_id: "test-option",
    value: "test-option2",
    variant_id: "test-variant_1",
    // product_id: "test-product",
  })
  await manager.save(variant2)

  await manager.save(variantOption_2)

  // variant2.options = [variantOption_2]

  const variant3 = await manager.create(ProductVariant, {
    id: "test-variant_2",
    inventory_quantity: 10,
    title: "Test variant rank (2)",
    rank: 1,
    sku: "test-sku2",
    ean: "test-ean2",
    upc: "test-upc2",
    product_id: "test-product",
    prices: [{ id: "test-price2", currency_code: "usd", amount: 100 }],
    // options: [{ id: "test-variant-option-2", value: "Default variant 2" }],
  })

  const variantOption_3 = manager.create(ProductOptionValue, {
    id: "test-option-variant3",
    option_id: "test-option",
    value: "test-option3",
    variant_id: "test-variant_2",
    // product_id: "test-product",
  })

  await manager.save(variant3)
  await manager.save(variantOption_3)

  // variant3.options = [variantOption_3]

  const moneyAmount = await manager.create(MoneyAmount, {
    id: "money_amount",
    amount: 100,
    currency_code: "usd",
    variant_id: "test-variant",
  })

  await manager.save(moneyAmount)
}
