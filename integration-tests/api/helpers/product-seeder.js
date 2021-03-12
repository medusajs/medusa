const {
  ProductCollection,
  ProductTag,
  ProductType,
  Region,
  Product,
  ShippingProfile,
  ProductVariant,
  ProductOptionValue,
  ProductOption,
  MoneyAmount,
  Image,
} = require("@medusajs/medusa");

module.exports = async (connection, data = {}) => {
  const manager = connection.manager;

  const defaultProfile = await manager.findOne(ShippingProfile, {
    type: "default",
  });

  await manager.insert(ProductCollection, {
    id: "test-collection",
    title: "Test collection",
  });

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
    title: "Test product",
    profile_id: defaultProfile.id,
    images: [{ id: "test-image", url: "test-image.png" }],
    description: "test-product-description",
    collection_id: "test-collection",
    type: { id: "test-type", value: "test-type" },
    tags: [
      { id: "tag1", value: "123" },
      { tag: "tag2", value: "456" },
    ],
    options: [{ id: "test-option", title: "Default value" }],
  });

  await manager.insert(Product, {
    id: "test-product-2",
    handle: "test-product-two",
    title: "Test product two",
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
    product_id: "test-product",
    prices: [{ id: "test-price", currency_code: "usd", amount: 100 }],
    options: [{ id: "test-variant-option", value: "Default variant" }],
  });

  const productOption = manager.create(ProductOption, {
    id: "test-option",
    title: "Default value",
    product_id: "test-product-2",
  });

  await manager.save(productOption);

  await manager.insert(ProductVariant, {
    id: "test-variant-2",
    inventory_quantity: 10,
    title: "Test variant",
    product_id: "test-product-2",
    prices: [{ id: "test-price", currency_code: "usd", amount: 100 }],
  });

  const ma = manager.create(MoneyAmount, {
    variant_id: "test-variant-2",
    currency_code: "usd",
    amount: 100,
  });

  await manager.save(ma);

  const option = manager.create(ProductOptionValue, {
    id: "test-variant-option",
    value: "Default variant",
    option_id: "test-option",
    variant_id: "test-variant-2",
  });

  await manager.save(option);
};
