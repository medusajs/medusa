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
  buildEndpoint: (id) => `/admin/swaps/${id}`,
  setup: async (manager, api) => {
    const customer = await manager.create(Customer, {
      email: "jane@medusa.test",
    })
    await manager.save(customer)

    const region = await manager.create(Region, {
      name: "United States",
      currency_code: "usd",
      countries: [{ iso_2: "us" }],
      fulfillment_providers: [{ id: "test-ful" }],
      payment_providers: [{ id: "test-pay" }],
      tax_rate: 0,
    })

    await manager.save(region)

    const address = await manager.create(Address, {
      first_name: "Jane",
      last_name: "Medusan",
      country_code: "us",
    })
    await manager.save(address)

    const order = manager.create(Order, {
      customer_id: customer.id,
      email: customer.email,
      payment_status: "captured",
      fulfillment_status: "fulfilled",
      shipping_address_id: address.id,
      region_id: region.id,
      currency_code: "usd",
      tax_rate: 0,
      discounts: [],
      payments: [
        {
          amount: 10000,
          currency_code: "usd",
          amount_refunded: 0,
          provider_id: "test-ful",
          data: {},
        },
      ],
      items: [],
    })
    await manager.save(order)
    const cart = manager.create(Cart, {
      customer_id: customer.id,
      email: customer.email,
      shipping_address_id: address.id,
      billing_address_id: address.id,
      region_id: region.id,
      type: "swap",
      metadata: {
        parent_order_id: order.id,
      },
    })

    await manager.save(cart)

    const swap = manager.create(Swap, {
      order_id: order.id,
      payment_status: "captured",
      fulfillment_status: "fulfilled",
      cart_id: "test-cart",
      payment: {
        amount: 10000,
        currency_code: "usd",
        amount_refunded: 0,
        provider_id: "test",
        data: {},
      },
      additional_items: [
        {
          id: "test-item-swapped",
          fulfilled_quantity: 1,
          title: "Line Item",
          description: "Line Item Desc",
          thumbnail: "https://test.js/1234",
          unit_price: 9000,
          quantity: 1,
          variant_id: "test-variant-2",
          cart_id: "test-cart",
        },
      ],
    })

    await manager.save(swap)

    const li = manager.create(LineItem, {
      id: "return-item-1",
      fulfilled_quantity: 1,
      title: "Return Line Item",
      description: "Line Item Desc",
      thumbnail: "https://test.js/1234",
      unit_price: 8000,
      quantity: 1,
      variant_id: "test-variant",
      order_id: orderWithSwap.id,
      cart_id: cart.id,
    })

    await manager.save(li)
    return swap.id
  },
  snapshotMatch: {
    return_reason: {
      id: expect.stringMatching(/^rr_*/),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  },
}
