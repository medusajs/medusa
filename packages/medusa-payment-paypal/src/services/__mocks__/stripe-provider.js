import { IdMap } from "medusa-test-utils"

export const StripeProviderServiceMock = {
  retrievePayment: jest.fn().mockImplementation((payData) => {
    if (payData.id === "pi_123456789") {
      return Promise.resolve({
        id: "pi",
        customer: "cus_123456789",
      })
    }
    if (payData.id === "pi_no") {
      return Promise.resolve({
        id: "pi_no",
      })
    }
    return Promise.resolve(undefined)
  }),
  cancelPayment: jest.fn().mockImplementation((cart) => {
    return Promise.resolve()
  }),
  updatePaymentIntentCustomer: jest.fn().mockImplementation((cart) => {
    return Promise.resolve()
  }),
  retrieveCustomer: jest.fn().mockImplementation((customerId) => {
    if (customerId === "cus_123456789_new") {
      return Promise.resolve({
        id: "cus_123456789_new",
      })
    }
    return Promise.resolve(undefined)
  }),
  createCustomer: jest.fn().mockImplementation((customer) => {
    if (customer._id === IdMap.getId("vvd")) {
      return Promise.resolve({
        id: "cus_123456789_new_vvd",
      })
    }
    return Promise.resolve(undefined)
  }),
  createPayment: jest.fn().mockImplementation((cart) => {
    return Promise.resolve({
      id: "pi_new",
      customer: "cus_123456789_new",
    })
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return StripeProviderServiceMock
})

export default mock
