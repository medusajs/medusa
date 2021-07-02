const {
  ProductCollection,
  ProductTag,
  ProductType,
  Region,
  Product,
  ShippingProfile,
  ProductVariant,
  MoneyAmount,
  Image,
} = require("@medusajs/medusa");

module.exports = async (connection, data = {}) => {
  const manager = connection.manager;

  const defaultProfile = await manager.findOne(ShippingProfile, {
    type: "default",
  });

  const coll = manager.create(ProductCollection, {
    id: "test-collection",
    handle: "test-collection",
    title: "Test collection",
  });

  await manager.save(coll);

  const tag = manager.create(ProductTag, {
    id: "tag1",
    value: "123",
  });

  await manager.save(tag);

  const type = manager.create(ProductType, {
    id: "test-type",
    value: "test-type",
  });

  await manager.save(type);

  const image = manager.create(Image, {
    id: "test-image",
    url: "test-image.png",
  });

  await manager.save(image);

  await manager.insert(Region, {
    id: "test-region",
    name: "Test Region",
    currency_code: "usd",
    tax_rate: 0,
  });

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
    options: [{ id: "test-option", title: "Default value" }],
  });

  p.images = [image];

  await manager.save(p);

  await manager.insert(ProductVariant, {
    id: "test-variant",
    inventory_quantity: 10,
    title: "Test variant",
    sku: "test-sku",
    ean: "test-ean",
    upc: "test-upc",
    barcode: "test-barcode",
    product_id: "test-product",
    prices: [],
    options: [{ id: "test-variant-option", value: "Default variant" }],
  });

  await manager.insert(MoneyAmount, {
    variant_id: "test-variant",
    id: "test-price",
    currency_code: "usd",
    amount: 100,
  });
};
