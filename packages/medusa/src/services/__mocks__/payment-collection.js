import { IdMap } from "medusa-test-utils"

export const PaymentCollectionServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    const id = data.id ?? IdMap.getId("paycol_1")
    return Promise.resolve({ ...data, id })
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return PaymentCollectionServiceMock
})

export default mock
