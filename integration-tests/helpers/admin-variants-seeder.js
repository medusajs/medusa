const { ProductVariantMoneyAmount } = require("@medusajs/medusa")
const { MoneyAmount } = require("@medusajs/medusa")
const {
  Region,
  Product,
  ProductVariant,
  PriceList,
  CustomerGroup,
  Customer,
  Image,
  ShippingProfile,
  ProductCollection,
  ProductOption,
} = require("@medusajs/medusa")

module.exports = async (dataSource, data = {}) => {
  const manager = dataSource.manager

  const yesterday = ((today) => new Date(today.setDate(today.getDate() - 1)))(
    new Date()
  )

  const tenDaysAgo = ((today) => new Date(today.setDate(today.getDate() - 10)))(
    new Date()
  )

  const defaultProfile = await manager.findOne(ShippingProfile, {
    where: { type: ShippingProfile.default },
  })

  const collection = manager.create(ProductCollection, {
    id: "test-collection",
    handle: "test-collection",
    title: "Test collection",
  })

  await manager.save(collection)

  await manager.insert(Region, {
    id: "reg-europe",
    name: "Test Region Europe",
    currency_code: "eur",
    tax_rate: 0,
  })

  await manager.insert(Region, {
    id: "reg-us",
    name: "Test Region US",
    currency_code: "usd",
    tax_rate: 0,
  })

  const customer = manager.create(Customer, {
    id: "test-customer",
    email: "john@doe.com",
    first_name: "John",
    last_name: "Doe",
    password_hash:
      "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
    has_account: true,
  })

  const customerGroup = manager.create(CustomerGroup, {
    id: "test-group",
    name: "test-group",
  })

  await manager.save(customerGroup)
  customer.groups = [customerGroup]
  await manager.save(customer)

  const priceListActive = manager.create(PriceList, {
    id: "pl",
    name: "VIP sale",
    description: "All year sale for VIP customers.",
    type: "sale",
    status: "active",
  })

  await manager.save(priceListActive)

  const priceListExpired = manager.create(PriceList, {
    id: "pl_expired",
    name: "VIP summer sale",
    description: "Summer sale for VIP customers.",
    type: "sale",
    status: "active",
    starts_at: tenDaysAgo,
    ends_at: yesterday,
  })

  await manager.save(priceListExpired)

  const priceListWithCustomers = manager.create(PriceList, {
    id: "pl_with_customers",
    name: "VIP winter sale",
    description: "Winter sale for VIP customers.",
    type: "sale",
    status: "active",
  })

  priceListWithCustomers.customer_groups = [customerGroup]

  await manager.save(priceListWithCustomers)

  const productMultiReg = manager.create(Product, {
    id: "test-product",
    handle: "test-product-reg",
    title: "Multi Reg Test product",
    profile_id: defaultProfile.id,
    profiles: [{ id: defaultProfile.id }],
    description: "test-product-description",
    status: "published",
    collection_id: "test-collection",
  })

  const image = manager.create(Image, {
    id: "test-image",
    url: "test-image.png",
  })

  productMultiReg.images = [image]

  await manager.save(productMultiReg)

  await manager.save(ProductOption, {
    id: "test-option",
    title: "test-option",
    product_id: "test-product",
  })

  const variantMultiReg = manager.create(ProductVariant, {
    id: "test-variant",
    inventory_quantity: 10,
    title: "Test variant",
    variant_rank: 0,
    sku: "test-sku",
    ean: "test-ean",
    upc: "test-upc",
    barcode: "test-barcode",
    product_id: "test-product",
    options: [
      {
        id: "test-variant-option-reg",
        value: "Default variant",
        option_id: "test-option",
      },
    ],
  })

  await manager.insert(MoneyAmount, {
    id: "test-price-multi-usd",
    currency_code: "usd",
    amount: 100,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma",
    money_amount_id: "test-price-multi-usd",
    variant_id: "test-variant",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price-discount-multi-usd",
    currency_code: "usd",
    amount: 80,
    price_list_id: "pl",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma1",
    money_amount_id: "test-price-discount-multi-usd",
    variant_id: "test-variant",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price-discount-expired-multi-usd",
    currency_code: "usd",
    amount: 70,
    price_list_id: "pl_expired",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma2",
    money_amount_id: "test-price-discount-expired-multi-usd",
    variant_id: "test-variant",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price-multi-eur",
    currency_code: "eur",
    amount: 100,
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma3",
    money_amount_id: "test-price-multi-eur",
    variant_id: "test-variant",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price-discount-multi-eur",
    currency_code: "eur",
    amount: 80,
    price_list_id: "pl",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma4",
    money_amount_id: "test-price-discount-multi-eur",
    variant_id: "test-variant",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price-discount-multi-eur-with-customer",
    currency_code: "eur",
    amount: 40,
    price_list_id: "pl_with_customers",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma5",
    money_amount_id: "test-price-discount-multi-eur-with-customer",
    variant_id: "test-variant",
  })

  await manager.insert(MoneyAmount, {
    id: "test-price-discount-expired-multi-eur",
    currency_code: "eur",
    amount: 70,
    price_list_id: "pl_expired",
  })

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma6",
    money_amount_id: "test-price-discount-expired-multi-eur",
    variant_id: "test-variant",
  })

  await manager.save(variantMultiReg)
}
