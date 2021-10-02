const {
  Region,
  ProductOption,
  Product,
  ProductVariant,
  ShippingProfile,
  MoneyAmount,
  Cart,
} = require("@medusajs/medusa")

module.exports = {
  operationId: "GetCartsCart",
  buildEndpoint: (id) => `/store/carts/${id}`,
  setup: async (manager, api) => {
    const defaultProfile = await manager.findOne(ShippingProfile, {
      type: "default",
    })

    const region = manager.create(Region, {
      name: "United States",
      currency_code: "usd",
      tax_rate: 0,
      countries: [
        {
          iso_2: "us",
        },
      ],
    })
    await manager.save(region)

    const option = manager.create(ProductOption, {
      title: "Size",
    })
    await manager.save(option)

    const product = manager.create(Product, {
      title: "Basic Tee",
      profile_id: defaultProfile.id,
      options: [option],
    })
    await manager.save(product)

    const variant1 = manager.create(ProductVariant, {
      title: "Small",
      product_id: product.id,
      inventory_quantity: 1,
      options: [
        {
          option_id: option.id,
          value: "Size",
        },
      ],
    })
    await manager.save(variant1)

    const variant2 = manager.create(ProductVariant, {
      title: "Large",
      product_id: product.id,
      inventory_quantity: 0,
      options: [
        {
          option_id: option.id,
          value: "Size",
        },
      ],
    })
    await manager.save(variant2)

    const ma = manager.create(MoneyAmount, {
      variant_id: variant1.id,
      currency_code: "usd",
      amount: 1000,
    })
    await manager.save(ma)

    const ma2 = manager.create(MoneyAmount, {
      variant_id: variant2.id,
      currency_code: "usd",
      amount: 8000,
    })
    await manager.save(ma2)

    const response = await api.post("/store/carts")
    const id = response.data.cart.id
    await api.post(`/store/carts/${id}/line-items`, {
      variant_id: variant1.id,
      quantity: 1,
    })

    return id
  },
  snapshotMatch: {
    cart: {
      id: expect.stringMatching(/^cart_*/),
      region_id: expect.stringMatching(/^reg_*/),
      region: {
        id: expect.stringMatching(/^reg_*/),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      items: [
        {
          id: expect.stringMatching(/^item_*/),
          cart_id: expect.stringMatching(/^cart_*/),
          variant_id: expect.stringMatching(/^variant_*/),
          variant: {
            id: expect.stringMatching(/^variant_*/),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            product_id: expect.stringMatching(/^prod_*/),
          },
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ],
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  },
}
