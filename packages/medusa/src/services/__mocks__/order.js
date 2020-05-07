import { IdMap } from "medusa-test-utils"

export const orders = {
  testOrder: {
    _id: IdMap.getId("test-order"),
    email: "virgil@vandijk.dk",
    billing_address: {
      first_name: "Virgil",
      last_name: "Van Dijk",
      address_1: "24 Dunks Drive",
      city: "Los Angeles",
      country_code: "US",
      province: "CA",
      postal_code: "93011",
    },
    shipping_address: {
      first_name: "Virgil",
      last_name: "Van Dijk",
      address_1: "24 Dunks Drive",
      city: "Los Angeles",
      country_code: "US",
      province: "CA",
      postal_code: "93011",
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
    region: IdMap.getId("testRegion"),
    customer_id: IdMap.getId("testCustomer"),
    payment_method: {
      provider_id: "default_provider",
      data: {},
    },
    shipping_method: [
      {
        provider_id: "default_provider",
        profile_id: IdMap.getId("validId"),
        data: {},
        items: {},
      },
    ],
  },
}

export const OrderServiceMock = {
  create: jest.fn().mockImplementation(data => {
    return Promise.resolve(orders.testOrder)
  }),
  update: jest.fn().mockImplementation(data => Promise.resolve()),
  retrieve: jest.fn().mockImplementation(orderId => {
    if (orderId === IdMap.getId("test-order")) {
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),
  decorate: jest.fn().mockImplementation(order => {
    order.decorated = true
    return order
  }),
  cancel: jest.fn().mockImplementation(order => {
    if (order === IdMap.getId("test-order")) {
      orders.testOrder.status = "cancelled"
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),
  createFulfillment: jest.fn().mockImplementation(order => {
    if (order === IdMap.getId("test-order")) {
      orders.testOrder.fulfillment_status = "fulfilled"
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),
  capturePayment: jest.fn().mockImplementation(order => {
    if (order === IdMap.getId("test-order")) {
      orders.testOrder.payment_status = "captured"
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),
  return: jest.fn().mockImplementation(order => {
    if (order === IdMap.getId("test-order")) {
      orders.testOrder.status = "returned"
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return OrderServiceMock
})

export default mock
