export const PaymentServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    const id = data.id ?? IdMap.getId("pay_1")
    return Promise.resolve({ ...data, id })
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return PaymentServiceMock
})

export default mock
