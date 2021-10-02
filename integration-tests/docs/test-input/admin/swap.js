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
  Swap,
} = require("@medusajs/medusa")

module.exports = {
  operationId: "GetSwapsSwap",
  buildEndpoint: id => `/admin/swaps/${id}`,
  setup: async (manager, api) => {
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
      title: "Small",
      product_id: product.id,
      inventory_quantity: 1,
      options: [
        {
          option_id: productOption.id,
          value: "Small",
        },
      ],
    })
    await manager.save(variant)

    const variant1 = await manager.create(ProductVariant, {
      title: "Large",
      product_id: product.id,
      inventory_quantity: 1,
      options: [
        {
          option_id: productOption.id,
          value: "Large",
        },
      ],
    })
    await manager.save(variant1)

    const ma = manager.create(MoneyAmount, {
      variant_id: variant.id,
      currency_code: "usd",
      amount: 8000,
    })
    await manager.save(ma)

    const ma2 = manager.create(MoneyAmount, {
      variant_id: variant1.id,
      currency_code: "usd",
      amount: 8000,
    })
    await manager.save(ma2)

    const region = manager.create(Region, {
      name: "United States",
      currency_code: "usd",
      fulfillment_providers: [{ id: "test-ful" }],
      payment_providers: [{ id: "test-pay" }],
      tax_rate: 0,
    })

    await manager.save(region)
    await manager.query(
      `UPDATE "country" SET region_id='${region.id}' WHERE iso_2 = 'us'`
    )

    const address = await manager.create(Address, {
      first_name: "Jane",
      last_name: "Medusan",
      country_code: "us",
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
      email: "jane@medusa.com",
    })
    await manager.save(customer)

    const order = manager.create(Order, {
      customer_id: customer.id,
      email: customer.email,
      payment_status: "captured",
      fulfillment_status: "fulfilled",
      shipping_address_id: address.id,
      region_id: region.id,
      currency_code: "usd",
      tax_rate: 0,
      discounts: [
        {
          code: "TEST134",
          is_dynamic: false,
          rule: {
            description: "Test Discount",
            type: "percentage",
            value: 10,
            allocation: "total",
          },
          is_disabled: false,
          regions: [
            {
              id: region.id,
            },
          ],
        },
      ],
      payments: [
        {
          amount: 10000,
          currency_code: "usd",
          amount_refunded: 0,
          provider_id: "test-pay",
          data: {},
        },
      ],
      items: [],
    })

    await manager.save(order)
    const li = manager.create(LineItem, {
      fulfilled_quantity: 1,
      returned_quantity: 0,
      title: "Line Item",
      description: "Line Item Desc",
      thumbnail: "https://test.js/1234",
      unit_price: 8000,
      quantity: 1,
      variant_id: variant.id,
      order_id: order.id,
    })

    await manager.save(li)

    const method = manager.create(ShippingMethod, {
      order_id: order.id,
      shipping_option_id: shippingOption.id,
      price: 1000,
      data: {},
    })
    await manager.save(method)

    const response = await api
      .post(
        `/admin/orders/${order.id}/swaps`,
        {
          return_items: [
            {
              item_id: li.id,
              quantity: 1,
            },
          ],
          additional_items: [{ variant_id: variant1.id, quantity: 1 }],
        },
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      )
      .catch(err => {
        console.log(err)
      })

    return response.data.order.swaps[0].id
  },
  snapshotMatch: {
    swap: {
      id: expect.stringMatching(/^swap_*/),
      additional_items: [
        {
          id: expect.stringMatching(/^item_*/),
          cart_id: expect.stringMatching(/^cart_*/),
          swap_id: expect.stringMatching(/^swap_*/),
          variant: {
            id: expect.stringMatching(/^variant_*/),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            product_id: expect.stringMatching(/^prod_*/),
          },
          variant_id: expect.stringMatching(/^variant_*/),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ],
      order_id: expect.stringMatching(/^order_*/),
      order: {
        id: expect.stringMatching(/^order_*/),
        region_id: expect.stringMatching(/^reg_*/),
        customer_id: expect.stringMatching(/^cus_*/),
        shipping_address_id: expect.stringMatching(/^addr_*/),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      cart_id: expect.stringMatching(/^cart_*/),
      cart: {
        id: expect.stringMatching(/^cart_*/),
        discounts: [
          {
            id: expect.stringMatching(/^disc_*/),
            rule_id: expect.stringMatching(/^dru_*/),
            rule: {
              id: expect.stringMatching(/^dru_*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
            starts_at: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
        items: [
          {
            id: expect.stringMatching(/^item_*/),
            cart_id: expect.stringMatching(/^cart_*/),
            swap_id: expect.stringMatching(/^swap_*/),
            variant_id: expect.stringMatching(/^variant_*/),
            variant: {
              id: expect.stringMatching(/^variant_*/),
              product_id: expect.stringMatching(/^prod_*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          {
            id: expect.stringMatching(/^item_*/),
            cart_id: expect.stringMatching(/^cart_*/),
            variant_id: expect.stringMatching(/^variant_*/),
            variant: {
              id: expect.stringMatching(/^variant_*/),
              product_id: expect.stringMatching(/^prod_*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
        type: "swap",
        region_id: expect.stringMatching(/^reg_*/),
        region: {
          id: expect.stringMatching(/^reg_*/),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        customer_id: expect.stringMatching(/^cus_*/),
        shipping_address_id: expect.stringMatching(/^addr_*/),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        metadata: {
          parent_order_id: expect.stringMatching(/^order_*/),
          swap_id: expect.stringMatching(/^swap_*/),
        },
      },
      return_order: {
        id: expect.stringMatching(/^ret_*/),
        swap_id: expect.stringMatching(/^swap_*/),
        items: [
          {
            item_id: expect.stringMatching(/^item_*/),
            return_id: expect.stringMatching(/^ret_*/),
          },
        ],
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  },
}
