import { IdMap } from "medusa-test-utils"

export const orders = {
  testOrder: {
    id: IdMap.getId("test-order"),
    email: "virgil@vandijk.dk",
    sales_channel_id: "test-channel",
    sales_channel: {
      id: "test-channel",
    },
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
        id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 123,
          variant: {
            id: IdMap.getId("can-cover"),
          },
          product: {
            id: IdMap.getId("validId"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    regionid: IdMap.getId("testRegion"),
    currency_code: "USD",
    customerid: IdMap.getId("testCustomer"),
    fulfillments: [],
    payment_method: {
      providerid: "default_provider",
      data: {},
    },
    no_notification: true,
    shipping_method: [
      {
        providerid: "default_provider",
        profileid: IdMap.getId("validId"),
        data: {},
        items: {},
      },
    ],
  },
  processedOrder: {
    id: IdMap.getId("processed-order"),
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
        id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 123,
          variant: {
            id: IdMap.getId("can-cover"),
          },
          product: {
            id: IdMap.getId("validId"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    regionid: IdMap.getId("region-france"),
    currency_code: "EUR",
    customerid: IdMap.getId("test-customer"),
    payment_method: {
      providerid: "default_provider",
    },
    no_notification: false,
    shipping_methods: [
      {
        id: IdMap.getId("expensiveShipping"),
        name: "Expensive Shipping",
        price: 100,
        providerid: "default_provider",
        profileid: IdMap.getId("default"),
      },
      {
        id: IdMap.getId("freeShipping"),
        name: "Free Shipping",
        price: 10,
        providerid: "default_provider",
        profileid: IdMap.getId("profile1"),
      },
    ],
    tax_rate: 0,
    fulfillment_status: "fulfilled",
    payment_status: "captured",
    status: "completed",
  },
}

export const OrderServiceMock = {
  withTransaction: function () {
    return this
  },

  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve(orders.testOrder)
  }),
  registerReturnReceived: jest.fn().mockImplementation((data) => {
    return Promise.resolve()
  }),
  createFromCart: jest.fn().mockImplementation((data) => {
    return Promise.resolve(orders.testOrder)
  }),
  update: jest.fn().mockImplementation((data) => {
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
  retrieve: jest.fn().mockImplementation((orderId) => {
    if (orderId === IdMap.getId("test-order")) {
      return Promise.resolve(orders.testOrder)
    }
    if (orderId === IdMap.getId("processed-order")) {
      return Promise.resolve(orders.processedOrder)
    }
    return Promise.resolve(undefined)
  }),
  retrieveWithTotals: jest.fn().mockImplementation((orderId) => {
    if (orderId === IdMap.getId("test-order")) {
      return Promise.resolve(orders.testOrder)
    }
    if (orderId === IdMap.getId("processed-order")) {
      return Promise.resolve(orders.processedOrder)
    }
    return Promise.resolve(undefined)
  }),
  retrieveByCartId: jest.fn().mockImplementation((cartId) => {
    return Promise.resolve({ id: IdMap.getId("test-order") })
  }),
  decorate: jest.fn().mockImplementation((order) => {
    order.decorated = true
    return order
  }),
  cancel: jest.fn().mockImplementation((order) => {
    if (order === IdMap.getId("test-order")) {
      orders.testOrder.status = "cancelled"
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),

  cancelFulfillment: jest.fn().mockImplementation((f) => {
    return Promise.resolve({ f })
  }),

  archive: jest.fn().mockImplementation((order) => {
    if (order === IdMap.getId("processed-order")) {
      orders.processedOrder.status = "archived"
      return Promise.resolve(orders.processedOrder)
    }
    return Promise.resolve(undefined)
  }),
  createFulfillment: jest.fn().mockImplementation((order) => {
    if (order === IdMap.getId("test-order")) {
      orders.testOrder.fulfillment_status = "fulfilled"
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),
  capturePayment: jest.fn().mockImplementation((order) => {
    if (order === IdMap.getId("test-order")) {
      orders.testOrder.payment_status = "captured"
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),
  receiveReturn: jest.fn().mockImplementation((order) => {
    if (order === IdMap.getId("test-order")) {
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),
  list: jest.fn().mockImplementation(() => {
    return Promise.resolve([orders.testOrder])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return OrderServiceMock
})

export default mock
