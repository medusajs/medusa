const {
  ShippingProfile,
  Customer,
  MoneyAmount,
  LineItem,
  Country,
  ShippingOption,
  ShippingMethod,
  Product,
  ProductVariant,
  Region,
  Order,
  Swap,
  Cart,
  Return,
} = require("@medusajs/medusa");

module.exports = async (connection, data = {}) => {
  const manager = connection.manager;

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
        provider_id: "test",
        data: {},
      },
    ],
    items: [],
    ...data,
  });

  orderWithSwap = await manager.save(orderWithSwap);

  const cart = manager.create(Cart, {
    id: "test-cart",
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
  });

  await manager.save(cart);

  const swap = manager.create(Swap, {
    id: "test-swap",
    order_id: "order-with-swap",
    payment_status: "captured",
    fulfillment_status: "fulfilled",
    cart_id: "test-cart",
    payment: {
      id: "test-payment-swap",
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
  });

  await manager.save(swap);

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
  });

  await manager.save(li);

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
  });

  await manager.save(li2);

  const swapReturn = await manager.create(Return, {
    swap_id: swap.id,
    order_id: orderWithSwap.id,
    item_id: li.id,
    refund_amount: li.quantity * li.unit_price,
    // shipping_method_id: ,
  });

  await manager.save(swapReturn);

  const return_item1 = manager.create(LineItem, {
    ...li,
    unit_price: -1 * li.unit_price,
  });

  await manager.save(return_item1);

  await manager.insert(ShippingMethod, {
    id: "another-test-method",
    shipping_option_id: "test-option",
    cart_id: "test-cart",
    price: 1000,
    data: {},
  });

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
      provider_id: "test",
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
  });

  await manager.save(swapOnSwap);

  await manager.insert(ShippingMethod, {
    id: "test-method-swap-order",
    shipping_option_id: "test-option",
    order_id: "order-with-swap",
    price: 1000,
    data: {},
  });
};
