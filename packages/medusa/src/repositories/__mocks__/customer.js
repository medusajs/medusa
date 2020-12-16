import { IdMap } from "medusa-test-utils"

export const customers = {
  testCustomer: {
    _id: IdMap.getId("testCustomer"),
    email: "oliver@medusa.com",
    first_name: "Oliver",
    last_name: "Juhl",
    billingAddress: {},
    password_hash: "123456789",
  },
  deleteCustomer: {
    _id: IdMap.getId("deleteId"),
    email: "oliver@medusa.com",
    first_name: "Oliver",
    last_name: "Juhl",
    billingAddress: {},
    password_hash: "123456789",
  },
  customerWithPhone: {
    _id: IdMap.getId("customerWithPhone"),
    email: "oliver@medusa.com",
    first_name: "Oliver",
    last_name: "Juhl",
    billingAddress: {},
    password_hash: "123456789",
    phone: "12345678",
  },
}

export const CustomerModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query.email === "oliver@medusa.com") {
      return Promise.resolve(customers.testCustomer)
    }
    if (query.phone === "12345678") {
      return Promise.resolve(customers.customerWithPhone)
    }
    if (query._id === IdMap.getId("testCustomer")) {
      return Promise.resolve(customers.testCustomer)
    }
    if (query._id === IdMap.getId("deleteId")) {
      return Promise.resolve(customers.deleteCustomer)
    }
    return Promise.resolve(undefined)
  }),
}
