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
    items: [],
    region: IdMap.getId("region-france"),
    customer_id: IdMap.getId("test-customer"),
    payment_method: {},
    shipping_methods: {},
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
      return Promise.resolve(orders.testOrder)
    }
    return Promise.resolve(undefined)
  }),
}
