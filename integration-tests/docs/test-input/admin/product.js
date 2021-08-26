const {
  ShippingProfile,
  Customer,
  Order,
  LineItem,
  MoneyAmount,
  ShippingMethod,
  ShippingOption,
  ShippingOptionRequirement,
  ProductOption,
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
} = require("@medusajs/medusa")

module.exports = {
  operationId: "GetProductsProduct",
  buildEndpoint: (id) => `/admin/products/${id}`,
  setup: async (manager) => {
    const defaultProfile = await manager.findOne(ShippingProfile, {
      type: "default",
    })

    const product = await manager.create(Product, {
      title: "Basic Tee",
      profile_id: defaultProfile.id,
    })

    await manager.save(product)

    const productOption = await manager.create(ProductOption, {
      title: "Size",
      product_id: product.id,
    })
    await manager.save(productOption)

    const variant = await manager.create(ProductVariant, {
      title: "One Size",
      product_id: product.id,
      inventory_quantity: 1,
      options: [
        {
          option_id: productOption.id,
          value: "Size",
        },
      ],
    })
    await manager.save(variant)

    const ma = manager.create(MoneyAmount, {
      variant_id: variant.id,
      currency_code: "usd",
      amount: 8000,
    })
    await manager.save(ma)

    return product.id
  },
  snapshotMatch: {
    product: {
      id: expect.stringMatching(/^prod_*/),
      options: [
        {
          id: expect.stringMatching(/^opt_*/),
          product_id: expect.stringMatching(/^prod_*/),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ],
      variants: [
        {
          id: expect.stringMatching(/^variant_*/),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          product_id: expect.stringMatching(/^prod_*/),
          prices: [
            {
              id: expect.stringMatching(/^ma_*/),
              variant_id: expect.stringMatching(/^variant_*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          options: [
            {
              id: expect.stringMatching(/^optval_*/),
              variant_id: expect.stringMatching(/^variant_*/),
              option_id: expect.stringMatching(/^opt_*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
        },
      ],
      profile_id: expect.stringMatching(/^sp_*/),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  },
}
