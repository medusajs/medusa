const {
  ClaimOrder,
  Order,
  LineItem,
  Fulfillment,
  Return,
} = require("@medusajs/medusa")

module.exports = async (connection, data = {}) => {
  const manager = connection.manager

  let orderWithClaim = manager.create(Order, {
    id: "order-with-claim",
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
        id: "test-payment-for-claim-order",
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

  await manager.save(orderWithClaim)

  const li = manager.create(LineItem, {
    id: "test-item-co-2",
    fulfilled_quantity: 1,
    title: "Line Item",
    description: "Line Item Desc",
    thumbnail: "https://test.js/1234",
    unit_price: 8000,
    quantity: 1,
    variant_id: "test-variant",
    order_id: orderWithClaim.id,
  })

  await manager.save(li)

  const li2 = manager.create(LineItem, {
    id: "test-item-co-3",
    fulfilled_quantity: 4,
    title: "Line Item",
    description: "Line Item Desc",
    thumbnail: "https://test.js/1234",
    unit_price: 8000,
    quantity: 4,
    variant_id: "test-variant",
    order_id: orderWithClaim.id,
  })

  await manager.save(li2)

  const claimWithFulfillment = manager.create(ClaimOrder, {
    id: "claim-w-f",
    type: "replace",
    payment_status: "na",
    fulfillment_status: "not_fulfilled",
    order_id: "order-with-claim",
    ...data,
  })

  const ful1 = manager.create(Fulfillment, {
    id: "fulfillment-co-1",
    data: {},
    provider_id: "test-ful",
  })

  const ful2 = manager.create(Fulfillment, {
    id: "fulfillment-co-2",
    data: {},
    provider_id: "test-ful",
  })

  claimWithFulfillment.fulfillments = [ful1, ful2]

  await manager.save(claimWithFulfillment)

  const claimWithReturn = manager.create(ClaimOrder, {
    id: "claim-w-r",
    type: "replace",
    payment_status: "na",
    fulfillment_status: "not_fulfilled",
    order_id: "order-with-claim",
    ...data,
  })

  await manager.save(claimWithReturn)

  await manager.insert(Return, {
    id: "return-id-2",
    claim_order_id: "claim-w-r",
    status: "requested",
    refund_amount: 0,
    data: {},
  })
}
