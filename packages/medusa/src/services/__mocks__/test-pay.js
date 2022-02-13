export const testPayServiceMock = {
  identifier: "test-pay",
  getIdentifier: "test-pay",
  getStatus: jest.fn().mockResolvedValue(Promise.resolve("authorised")),
  retrieveSavedMethods: jest.fn().mockResolvedValue(Promise.resolve([])),
  getPaymentData: jest.fn().mockResolvedValue(Promise.resolve({})),
  createPayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  retrievePayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  updatePayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  deletePayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  authorizePayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  updatePaymentData: jest.fn().mockImplementation(() => {
    return {}
  }),
  cancelPayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  capturePayment: jest.fn().mockImplementation(() => {
    return {}
  }),
  refundPayment: jest.fn().mockImplementation(() => {
    return {}
  })
}

const mock = jest.fn().mockImplementation(() => {
  return testPayServiceMock
})

export default mock
