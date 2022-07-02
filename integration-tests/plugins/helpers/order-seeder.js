const {
  Customer,
  Discount,
  DiscountRule,
  LineItem,
  MoneyAmount,
  Order,
  Payment,
  Product,
  ProductVariant,
  Region,
  ShippingMethod,
  ShippingOption,
  ShippingProfile,
  Swap,
} = require("@medusajs/medusa")

module.exports = async (connection, data = {}) => {
  const manager = connection.manager

  const defaultProfile = await manager.findOne(ShippingProfile, {
    type: "default",
  })

  await manager.insert(Product, {
    id: "test-product",
    title: "test product",
    profile_id: defaultProfile.id,
    options: [{ id: "test-option", title: "Size" }],
  })

  await manager.insert(ProductVariant, {
    id: "test-variant",
    title: "test variant",
    product_id: "test-product",
    inventory_quantity: 1,
    options: [
      {
        option_id: "test-option",
        value: "Size",
      },
    ],
  })

  await manager.insert(ProductVariant, {
    id: "test-variant-2",
    title: "Swap product",
    product_id: "test-product",
    inventory_quantity: 1,
    options: [
      {
        option_id: "test-option",
        value: "Large",
      },
    ],
  })

  const ma2 = manager.create(MoneyAmount, {
    variant_id: "test-variant-2",
    currency_code: "usd",
    amount: 8000,
  })
  await manager.save(ma2)

  const ma = manager.create(MoneyAmount, {
    variant_id: "test-variant",
    currency_code: "usd",
    amount: 8000,
  })
  await manager.save(ma)

  await manager.insert(Region, {
    id: "test-region",
    name: "Test Region",
    currency_code: "usd",
    tax_rate: 0,
  })

  await manager.query(
    `UPDATE "country" SET region_id='test-region' WHERE iso_2 = 'us'`
  )

  await manager.insert(Customer, {
    id: "test-customer",
    email: "test@email.com",
  })

  await manager.insert(ShippingOption, {
    id: "test-option",
    name: "test-option",
    provider_id: "test-ful",
    region_id: "test-region",
    profile_id: defaultProfile.id,
    price_type: "flat_rate",
    amount: 1000,
    data: {},
  })

  await manager.insert(ShippingOption, {
    id: "test-return-option",
    name: "Test ret",
    profile_id: defaultProfile.id,
    region_id: "test-region",
    provider_id: "test-ful",
    data: {},
    price_type: "flat_rate",
    amount: 1000,
    is_return: true,
  })

  const order = manager.create(Order, {
    id: "test-order",
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
    discounts: [
      {
        id: "test-discount",
        code: "TEST134",
        is_dynamic: false,
        rule: {
          id: "test-rule",
          description: "Test Discount",
          type: "percentage",
          value: 10,
          allocation: "total",
        },
        is_disabled: false,
        regions: [
          {
            id: "test-region",
          },
        ],
      },
    ],
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

  await manager.save(order)

  const li = manager.create(LineItem, {
    id: "test-item",
    fulfilled_quantity: 1,
    returned_quantity: 0,
    title: "Line Item",
    description: "Line Item Desc",
    thumbnail: "https://test.js/1234",
    unit_price: 8000,
    quantity: 1,
    variant_id: "test-variant",
    order_id: "test-order",
  })

  await manager.save(li)

  await manager.insert(ShippingMethod, {
    id: "test-method",
    order_id: "test-order",
    shipping_option_id: "test-option",
    price: 1000,
    data: {},
  })

  const orderTemplate = () => {
    return {
      customer_id: "test-customer",
      email: "test@gmail.com",
      payment_status: "not_paid",
      fulfillment_status: "not_fulfilled",
      region_id: "test-region",
      currency_code: "usd",
      tax_rate: 0,
      ...data,
    }
  }

  const paymentTemplate = () => {
    return {
      amount: 10000,
      currency_code: "usd",
      provider_id: "test-pay",
      data: {},
    }
  }

  const orderWithClaim = manager.create(Order, {
    id: "test-order-w-c",
    claims: [
      {
        type: "replace",
        id: "claim-1",
        payment_status: "na",
        fulfillment_status: "not_fulfilled",
        payment_provider: "test-pay",
      },
    ],
    ...orderTemplate(),
  })

  await manager.save(orderWithClaim)

  await manager.insert(Payment, {
    order_id: "test-order-w-c",
    id: "o-pay1",
    ...paymentTemplate(),
  })

  const orderWithSwap = manager.create(Order, {
    id: "test-order-w-s",
    ...orderTemplate(),
  })

  await manager.save(orderWithSwap)

  await manager.insert(Payment, {
    order_id: "test-order-w-s",
    id: "o-pay2",
    ...paymentTemplate(),
  })

  const swap1 = manager.create(Swap, {
    id: "swap-1",
    order_id: "test-order-w-s",
    fulfillment_status: "not_fulfilled",
    payment_status: "not_paid",
  })

  const pay1 = manager.create(Payment, {
    id: "pay1",
    ...paymentTemplate(),
  })

  swap1.payment = pay1

  const swap2 = manager.create(Swap, {
    id: "swap-2",
    order_id: "test-order-w-s",
    fulfillment_status: "not_fulfilled",
    payment_status: "not_paid",
  })

  const pay2 = manager.create(Payment, {
    id: "pay2",
    ...paymentTemplate(),
  })

  swap2.payment = pay2

  await manager.save(swap1)
  await manager.save(swap2)

  const orderWithFulfillment = manager.create(Order, {
    id: "test-order-w-f",
    fulfillments: [
      {
        id: "fulfillment-on-order-1",
        data: {},
        provider_id: "test-ful",
      },
      {
        id: "fulfillment-on-order-2",
        data: {},
        provider_id: "test-ful",
      },
    ],
    ...orderTemplate(),
  })

  await manager.save(orderWithFulfillment)

  await manager.insert(Payment, {
    order_id: "test-order-w-f",
    id: "o-pay3",
    ...paymentTemplate(),
  })

  const orderWithReturn = manager.create(Order, {
    id: "test-order-w-r",
    returns: [
      {
        id: "return-on-order-1",
        refund_amount: 0,
      },
      {
        id: "return-on-order-2",
        refund_amount: 0,
      },
    ],
    ...orderTemplate(),
  })

  await manager.save(orderWithReturn)

  await manager.insert(Payment, {
    order_id: "test-order-w-r",
    id: "o-pay4",
    ...paymentTemplate(),
  })

  const drule = manager.create(DiscountRule, {
    id: "test-rule",
    description: "Test Discount",
    type: "percentage",
    value: 10,
    allocation: "total",
  })

  const discount = manager.create(Discount, {
    id: "test-discount-o",
    code: "TEST1234",
    is_dynamic: false,
    rule: drule,
    is_disabled: false,
    regions: [
      {
        id: "test-region",
      },
    ],
  })
  await manager.save(discount)

  const payment = manager.create(Payment, {
    id: "test-payment-d",
    amount: 10000,
    currency_code: "usd",
    amount_refunded: 0,
    provider_id: "test-pay",
    captured_at: new Date(),
    data: {},
  })

  const discountedOrder = manager.create(Order, {
    id: "discount-order",
    customer_id: "test-customer",
    email: "test-discount@email.com",
    payment_status: "captured",
    fulfillment_status: "fulfilled",
    discounts: [discount],
    billing_address: {
      id: "test-discount-billing-address",
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
    payments: [payment],
    items: [],
    ...data,
  })

  await manager.save(discountedOrder)

  const dli = manager.create(LineItem, {
    id: "test-item-1",
    fulfilled_quantity: 1,
    returned_quantity: 0,
    title: "Line Item",
    description: "Line Item Desc",
    thumbnail: "https://test.js/1234",
    unit_price: 8000,
    quantity: 1,
    variant_id: "test-variant",
    order_id: "discount-order",
  })

  await manager.save(dli)
}
