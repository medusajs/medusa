import { IdMap } from "medusa-test-utils"

export const orders = {
  testOrder: {
    _id: IdMap.getId("test-order"),
    email: "oliver@test.dk",
    billing_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    shipping_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    items: [
      {
        _id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 123,
          variant: {
            _id: IdMap.getId("can-cover"),
          },
          product: {
            _id: IdMap.getId("validId"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    region_id: IdMap.getId("region-france"),
    customer_id: IdMap.getId("test-customer"),
    payment_method: {
      provider_id: "default_provider",
    },
    shipping_methods: [
      {
        _id: IdMap.getId("expensiveShipping"),
        name: "Expensive Shipping",
        price: 100,
        provider_id: "default_provider",
        profile_id: IdMap.getId("default"),
      },
      {
        _id: IdMap.getId("freeShipping"),
        name: "Free Shipping",
        price: 10,
        provider_id: "default_provider",
        profile_id: IdMap.getId("profile1"),
      },
    ],
    fulfillment_status: "not_fulfilled",
    payment_status: "awaiting",
    status: "pending",
  },
  processedOrder: {
    _id: IdMap.getId("processed-order"),
    email: "oliver@test.dk",
    billing_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    shipping_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    items: [
      {
        _id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 123,
          variant: {
            _id: IdMap.getId("can-cover"),
          },
          product: {
            _id: IdMap.getId("validId"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    region_id: IdMap.getId("region-france"),
    customer_id: IdMap.getId("test-customer"),
    payment_method: {
      provider_id: "default_provider",
    },
    shipping_methods: [
      {
        _id: IdMap.getId("expensiveShipping"),
        name: "Expensive Shipping",
        price: 100,
        provider_id: "default_provider",
        profile_id: IdMap.getId("default"),
      },
      {
        _id: IdMap.getId("freeShipping"),
        name: "Free Shipping",
        price: 10,
        provider_id: "default_provider",
        profile_id: IdMap.getId("profile1"),
      },
    ],
    fulfillment_status: "fulfilled",
    payment_status: "captured",
    status: "completed",
  },
  orderToRefund: {
    _id: IdMap.getId("refund-order"),
    email: "oliver@test.dk",
    billing_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    shipping_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    items: [
      {
        _id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 100,
          variant: {
            _id: IdMap.getId("eur-8-us-10"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
      {
        _id: IdMap.getId("existingLine2"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 100,
          variant: {
            _id: IdMap.getId("can-cover"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    region_id: IdMap.getId("region-france"),
    customer_id: IdMap.getId("test-customer"),
    payment_method: {
      provider_id: "default_provider",
    },
    shipping_methods: [
      {
        provider_id: "default_provider",
        profile_id: IdMap.getId("default"),
        data: {},
        items: {},
      },
      {
        provider_id: "default_provider",
        profile_id: IdMap.getId("default"),
        data: {},
        items: {},
      },
    ],
    discounts: [],
  },
}

export const OrderModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query._id === IdMap.getId("test-order")) {
      orders.testOrder.payment_status = "awaiting"
      return Promise.resolve(orders.testOrder)
    }
    if (query._id === IdMap.getId("not-fulfilled-order")) {
      orders.testOrder.fulfillment_status = "not_fulfilled"
      orders.testOrder.payment_status = "awaiting"
      return Promise.resolve(orders.testOrder)
    }
    if (query._id === IdMap.getId("fulfilled-order")) {
      orders.testOrder.fulfillment_status = "fulfilled"
      return Promise.resolve(orders.testOrder)
    }
    if (query._id === IdMap.getId("payed-order")) {
      orders.testOrder.fulfillment_status = "not_fulfilled"
      orders.testOrder.payment_status = "captured"
      return Promise.resolve(orders.testOrder)
    }
    if (query._id === IdMap.getId("processed-order")) {
      return Promise.resolve(orders.processedOrder)
    }
    if (query._id === IdMap.getId("order-refund")) {
      orders.orderToRefund.payment_status = "captured"
      return Promise.resolve(orders.orderToRefund)
    }
    return Promise.resolve(undefined)
  }),
}
