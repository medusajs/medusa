const {
  ShippingProfile,
  Customer,
  MoneyAmount,
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
  operationId: "GetDraftOrdersDraftOrder",
  buildEndpoint: (id) => `/admin/draft-orders/${id}`,
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

    const region = await manager.create(Region, {
      name: "United States",
      currency_code: "usd",
      tax_rate: 0,
      payment_providers: [
        {
          id: "test-pay",
          is_installed: true,
        },
      ],
    })
    await manager.save(region)

    const address = await manager.create(Address, {
      first_name: "Jane",
      last_name: "Medusan",
      country_code: "dk",
    })
    await manager.save(address)

    const shippingOption = await manager.create(ShippingOption, {
      name: "Standard Shipping",
      provider_id: "test-ful",
      region_id: region.id,
      profile_id: defaultProfile.id,
      price_type: "flat_rate",
      amount: 1000,
      data: {},
    })
    await manager.save(shippingOption)

    const customer = await manager.create(Customer, {
      email: "jane@medusa.test",
    })
    await manager.save(customer)

    const cart = manager.create(Cart, {
      customer_id: customer.id,
      email: "jane@medusa.test",
      shipping_address_id: address.id,
      region_id: region.id,
      currency_code: "usd",
      payment_sessions: [],
      items: [
        {
          fulfilled_quantity: 1,
          title: "Basic Tee - One Size",
          description: "Soft and sweet",
          thumbnail: "https://test.js/1234",
          unit_price: 8000,
          quantity: 1,
          variant_id: variant.id,
        },
      ],
      type: "draft_order",
    })
    await manager.save(cart)

    const draftOrder = manager.create(DraftOrder, {
      status: "open",
      display_id: 4,
      cart_id: cart.id,
      customer_id: customer.id,
      items: [
        {
          fulfilled_quantity: 1,
          title: "Basic Tee - One Size",
          description: "Soft and sweet",
          thumbnail: "https://test.js/1234",
          unit_price: 8000,
          quantity: 1,
          variant_id: variant.id,
        },
      ],
      email: customer.email,
      region_id: region.id,
      discounts: [],
    })

    await manager.save(draftOrder)
    return draftOrder.id
  },
  snapshotMatch: {
    draft_order: {
      id: expect.stringMatching(/^dorder_*/),
      cart: {
        id: expect.stringMatching(/^cart_*/),
        items: [
          {
            id: expect.stringMatching(/^item_*/),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            cart_id: expect.stringMatching(/^cart_*/),
            variant_id: expect.stringMatching(/^variant_*/),
            variant: {
              id: expect.stringMatching(/^variant_*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              product_id: expect.stringMatching(/^prod_*/),
            },
          },
        ],
        customer_id: expect.stringMatching(/^cus_*/),
        shipping_address_id: expect.stringMatching(/^addr_*/),
        shipping_address: {
          id: expect.stringMatching(/^addr_*/),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        region_id: expect.stringMatching(/^reg_*/),
        region: {
          id: expect.stringMatching(/^reg_*/),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      cart_id: expect.stringMatching(/^cart_*/),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  },
}
