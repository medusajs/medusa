import { IdMap } from "medusa-test-utils"

export const KlarnaProviderServiceMock = {
  retrievePayment: jest.fn().mockImplementation((cart) => {
    if (cart._id === IdMap.getId("fr-cart")) {
      return Promise.resolve({
        order_id: "123456789",
      })
    }
    return Promise.resolve(undefined)
  }),
  cancelPayment: jest.fn().mockImplementation((cart) => {
    return Promise.resolve()
  }),
  updatePayment: jest.fn().mockImplementation((cart) => {
    return Promise.resolve()
  }),
  capturePayment: jest.fn().mockImplementation((cart) => {
    if (cart._id === IdMap.getId("fr-cart")) {
      return Promise.resolve({
        id: "123456789",
      })
    }
    return Promise.resolve(undefined)
  }),
  createPayment: jest.fn().mockImplementation((cart) => {
    if (cart._id === IdMap.getId("fr-cart")) {
      return Promise.resolve({
        id: "123456789",
        order_amount: 100,
      })
    }
    return Promise.resolve(undefined)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return KlarnaProviderServiceMock
})

export default mock
