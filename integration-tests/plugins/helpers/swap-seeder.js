const {
  Discount,
  DiscountRule,
  LineItem,
  ShippingMethod,
  Order,
  Swap,
  Cart,
  Return,
} = require("@medusajs/medusa")
const {
  CustomShippingOption,
} = require("@medusajs/medusa/dist/models/custom-shipping-option")

module.exports = async (connection, data = {}) => {
  const manager = connection.manager

  let orderWithSwap = manager.create(Order, {
    id: "order-with-swap",
    customer_id: "test-customer",
    email: "test@email.com",
    payment_status: "captured",
    fulfillment_status: "fulfilled",
    billing_address: {
      id: "test-billing-address",
      first_name: "lebron",
    },
    shipping_address: {
      id: "test-shipping-address",
      first_name: "lebron",
      country_code: "us",
    },
    region_id: "test-region",
    currency_code: "usd",
    tax_rate: 0,
    discounts: [],
    payments: [
      {
        id: "test-payment",
        amount: 10000,
        currency_code: "usd",
        amount_refunded: 0,
        provider_id: "test-pay",
        data: {},
      },
    ],
    items: [],
    ...data,
  })

  orderWithSwap = await manager.save(orderWithSwap)

  const cart = manager.create(Cart, {
    id: "test-cart-w-swap",
    customer_id: "test-customer",
    email: "test-customer@email.com",
    shipping_address_id: "test-shipping-address",
    billing_address_id: "test-billing-address",
    region_id: "test-region",
    type: "swap",
    metadata: {
      swap_id: "test-swap",
      parent_order_id: orderWithSwap.id,
    },
  })

  await manager.save(cart)

  const swap = manager.create(Swap, {
    id: "test-swap",
    order_id: "order-with-swap",
    payment_status: "captured",
    fulfillment_status: "fulfilled",
    cart_id: "test-cart-w-swap",
    payment: {
      id: "test-payment-swap",
      amount: 10000,
      currency_code: "usd",
      amount_refunded: 0,
      provider_id: "test-pay",
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
        cart_id: "test-cart-w-swap",
      },
    ],
  })

  await manager.save(swap)

  const cartWithCustomSo = manager.create(Cart, {
    id: "test-cart-rma",
    customer_id: "test-customer",
    email: "test-customer@email.com",
    shipping_address_id: "test-shipping-address",
    billing_address_id: "test-billing-address",
    region_id: "test-region",
    type: "swap",
    metadata: {
      swap_id: "test-swap",
      parent_order_id: orderWithSwap.id,
    },
  })

  await manager.save(cartWithCustomSo)

  const liRma = manager.create(LineItem, {
    id: "test-item-rma",
    title: "Line Item RMA",
    description: "Line Item Desc",
    thumbnail: "https://test.js/1234",
    unit_price: 8000,
    quantity: 1,
    variant_id: "test-variant",
    cart_id: "test-cart-rma",
  })
  await manager.save(liRma)

  await manager.insert(CustomShippingOption, {
    id: "cso-test",
    cart_id: cartWithCustomSo.id,
    price: 0,
    shipping_option_id: "test-option",
  })

  const swapWithRMAMethod = manager.create(Swap, {
    id: "test-swap-rma",
    order_id: "order-with-swap",
    payment_status: "captured",
    fulfillment_status: "fulfilled",
    cart_id: cartWithCustomSo.id,
    payment: {
      id: "test-payment-swap",
      amount: 10000,
      currency_code: "usd",
      amount_refunded: 0,
      provider_id: "test-pay",
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

  await manager.save(swapWithRMAMethod)

  const cartTemplate = async (cartId) => {
    const cart = manager.create(Cart, {
      id: cartId,
      customer_id: "test-customer",
      email: "test-customer@email.com",
      shipping_address_id: "test-shipping-address",
      billing_address_id: "test-billing-address",
      region_id: "test-region",
      type: "swap",
      metadata: {},
      ...data,
    })

    await manager.save(cart)
  }

  const swapTemplate = async (cartId) => {
    await cartTemplate(cartId)
    return {
      order_id: orderWithSwap.id,
      fulfillment_status: "fulfilled",
      payment_status: "not_paid",
      cart_id: cartId,
      payment: {
        amount: 5000,
        currency_code: "usd",
        amount_refunded: 0,
        provider_id: "test-pay",
        data: {},
      },
      ...data,
    }
  }

  const swapWithFulfillments = manager.create(Swap, {
    id: "swap-w-f",
    fulfillments: [
      {
        id: "fulfillment-1",
        data: {},
        provider_id: "test-ful",
      },
      {
        id: "fulfillment-2",
        data: {},
        provider_id: "test-ful",
      },
    ],
    ...(await swapTemplate("sc-w-f")),
  })

  await manager.save(swapWithFulfillments)

  const swapWithReturn = manager.create(Swap, {
    id: "swap-w-r",
    return_order: {
      id: "return-id",
      status: "requested",
      refund_amount: 0,
    },
    ...(await swapTemplate("sc-w-r")),
  })

  await manager.save(swapWithReturn)
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

  const li2 = manager.create(LineItem, {
    id: "test-item-many",
    fulfilled_quantity: 4,
    title: "Line Item",
    description: "Line Item Desc",
    thumbnail: "https://test.js/1234",
    unit_price: 8000,
    quantity: 4,
    variant_id: "test-variant",
    order_id: orderWithSwap.id,
  })

  await manager.save(li2)

  const swapReturn = await manager.create(Return, {
    swap_id: swap.id,
    order_id: orderWithSwap.id,
    item_id: li.id,
    refund_amount: li.quantity * li.unit_price,
  })

  await manager.save(swapReturn)

  const return_item1 = manager.create(LineItem, {
    ...li,
    unit_price: -1 * li.unit_price,
  })

  await manager.save(return_item1)

  await manager.insert(ShippingMethod, {
    id: "another-test-method",
    shipping_option_id: "test-option",
    cart_id: "test-cart-w-swap",
    price: 1000,
    data: {},
  })

  const swapOnSwap = manager.create(Swap, {
    id: "swap-on-swap",
    order_id: "order-with-swap",
    payment_status: "captured",
    fulfillment_status: "fulfilled",
    return_order: {
      id: "return-on-swap",
      refund_amount: 9000,
      items: [
        {
          return_id: "return-on-swap",
          item_id: "test-item-swapped",
          quantity: 1,
        },
      ],
    },
    payment: {
      id: "test-payment-swap-on-swap",
      amount: 10000,
      currency_code: "usd",
      amount_refunded: 0,
      provider_id: "test-pay",
      data: {},
    },
    additional_items: [
      {
        id: "test-item-swap-on-swap",
        fulfilled_quantity: 1,
        title: "Line Item",
        description: "Line Item Desc",
        thumbnail: "https://test.js/1234",
        unit_price: 8000,
        quantity: 1,
        variant_id: "test-variant",
      },
    ],
  })

  await manager.save(swapOnSwap)

  await manager.insert(ShippingMethod, {
    id: "test-method-swap-order",
    shipping_option_id: "test-option",
    order_id: "order-with-swap",
    price: 1000,
    data: {},
  })

  await createSwap({ id: "disc-swap" }, manager)
}

const createSwap = async (options, manager) => {
  const swapId = options.id

  const dRule = manager.create(DiscountRule, {
    id: `${swapId}-cart-discount-rule`,
    description: "Ten percent rule",
    type: "percentage",
    value: 10,
    allocation: "total",
  })
  await manager.save(dRule)

  const discount = manager.create(Discount, {
    code: `${swapId}`,
    is_dynamic: false,
    is_disabled: false,
    rule: dRule,
  })
  await manager.save(discount)

  const cart = manager.create(Cart, {
    id: `${swapId}-cart`,
    customer_id: "test-customer",
    email: "test-customer@email.com",
    shipping_address_id: "test-shipping-address",
    billing_address_id: "test-billing-address",
    region_id: "test-region",
    type: "swap",
    discounts: [discount],
    metadata: {
      swap_id: swapId,
      parent_order_id: "order-with-swap",
    },
  })

  await manager.save(cart)

  const swapTemplate = async () => {
    return {
      order_id: `order-with-swap`,
      fulfillment_status: "fulfilled",
      payment_status: "not_paid",
      cart_id: cart.id,
    }
  }

  const swapWithReturn = manager.create(Swap, {
    id: swapId,
    return_order: {
      id: `${swapId}-return-id`,
      status: "requested",
      refund_amount: 0,
    },
    ...(await swapTemplate(swapId)),
  })

  await manager.save(swapWithReturn)
  const li = manager.create(LineItem, {
    id: `${swapId}-return-item-1`,
    fulfilled_quantity: 1,
    title: "Return Line Item",
    description: "Line Item Desc",
    thumbnail: "https://test.js/1234",
    unit_price: 8000,
    quantity: 1,
    variant_id: "test-variant",
    order_id: "order-with-swap",
    cart_id: cart.id,
  })

  await manager.save(li)

  const li2 = manager.create(LineItem, {
    id: `${swapId}-test-item-many`,
    fulfilled_quantity: 4,
    title: "Line Item",
    description: "Line Item Desc",
    thumbnail: "https://test.js/1234",
    unit_price: 8000,
    quantity: 4,
    variant_id: "test-variant",
    order_id: "order-with-swap",
  })

  await manager.save(li2)

  const return_item1 = manager.create(LineItem, {
    ...li,
    unit_price: -1 * li.unit_price,
  })

  await manager.save(return_item1)

  await manager.insert(ShippingMethod, {
    id: `${swapId}-test-method`,
    shipping_option_id: "test-option",
    cart_id: cart.id,
    price: 1000,
    data: {},
  })
}
