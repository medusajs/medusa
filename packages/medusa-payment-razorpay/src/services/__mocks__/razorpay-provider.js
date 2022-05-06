import { IdMap } from "medusa-test-utils"

export const RazorpayProviderServiceMock = {
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
        id: "order_3424242",
        entity: "order",
        amount: 10000,
        amount_paid: 0,
        amount_due:10000,
        currency: "INR",
        receipt: 123,
        offer_id: null,
        status: "created",
        attempts: 0,
        notes: {cart_id:"1234",customer_id:"1234"},
        created_at: 12345678
    })
  }),
  createOrder: jest.fn().mockImplementation((cart) => {
    return Promise.resolve({
        id: "order_2453245235",
        entity: "order",
        amount: 10000,
        amount_paid: 0,
        amount_due:10000,
        currency: "INR",
        receipt: 123,
        offer_id: null,
        status: "created",
        attempts: 0,
        notes: {cart_id:"1234",customer_id:"1234"},
        created_at: 12345678
    })
  })
}

const mock = jest.fn().mockImplementation(() => {
  return RazorpayProviderServiceMock
})

export default mock
