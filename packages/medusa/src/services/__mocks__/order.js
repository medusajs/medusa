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
    region_id: IdMap.getId("testRegion"),
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
    tax_rate: 0,
    fulfillment_status: "fulfilled",
    payment_status: "captured",
    status: "completed",
  },
}

export const OrderServiceMock = {
  create: jest.fn().mockImplementation(data => {
    return Promise.resolve(orders.testOrder)
  }),
  createFromCart: jest.fn().mockImplementation(data => {
    return Promise.resolve(orders.testOrder)
  }),
  update: jest.fn().mockImplementation(data => {
    if (data === IdMap.getId("test-order")) {
      return Promise.resolve(orders.testOrder)
    }
    if (data === IdMap.getId("processed-order")) {
      return Promise.resolve(orders.processedOrder)
    }
    return Promise.resolve(undefined)
  }),
  setMetadata: jest.fn().mockImplementation((id, key, value) => {
    if (id === IdMap.getId("test-order")) {
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),
  deleteMetadata: jest.fn().mockImplementation((id, key, value) => {
    if (id === IdMap.getId("test-order")) {
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),
  retrieve: jest.fn().mockImplementation(orderId => {
    if (orderId === IdMap.getId("test-order")) {
      return Promise.resolve(orders.testOrder)
    }
    if (orderId === IdMap.getId("processed-order")) {
      return Promise.resolve(orders.processedOrder)
    }
    return Promise.resolve(undefined)
  }),
  retrieveByCartId: jest.fn().mockImplementation(cartId => {
    return Promise.resolve()
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
  archive: jest.fn().mockImplementation(order => {
    if (order === IdMap.getId("processed-order")) {
      orders.processedOrder.status = "archived"
      return Promise.resolve(orders.processedOrder)
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
  requestReturn: jest.fn().mockImplementation(order => {
    if (order === IdMap.getId("test-order")) {
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),
  receiveReturn: jest.fn().mockImplementation(order => {
    if (order === IdMap.getId("test-order")) {
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return OrderServiceMock
})

export default mock
