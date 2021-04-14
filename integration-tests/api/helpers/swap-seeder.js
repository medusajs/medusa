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

  const li = manager.create(LineItem, {
    id: "test-item-2",
    fulfilled_quantity: 1,
    title: "Line Item",
    description: "Line Item Desc",
    thumbnail: "https://test.js/1234",
    unit_price: 8000,
    quantity: 1,
    variant_id: "test-variant",
    order_id: orderWithSwap.id,
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

  const swap = manager.create(Swap, {
    id: "test-swap",
    order_id: "order-with-swap",
    payment_status: "captured",
    fulfillment_status: "fulfilled",
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
        unit_price: 8000,
        quantity: 1,
        variant_id: "test-variant-2",
      },
    ],
  });

  await manager.save(swap);

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
