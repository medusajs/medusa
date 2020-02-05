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
  wrongEmailCustomer: {
    _id: IdMap.getId("wrongEmailCustomer"),
    email: "oliver.com",
    first_name: "Oliver",
    last_name: "Juhl",
    billingAddress: {},
    password_hash: "123456789",
  },
}

export const CustomerModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query._id === IdMap.getId("testCustomer")) {
      return Promise.resolve(customers.testCustomer)
    }
    if (query._id === IdMap.getId("wrongEmailCustomer")) {
      return Promise.resolve(customers.wrongEmailCustomer)
    }
    return Promise.resolve(undefined)
  }),
}
