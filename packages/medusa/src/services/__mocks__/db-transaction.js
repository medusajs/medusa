import { MockManager } from "medusa-test-utils"

export const dbTransactionServiceMock = {
  connection_: {},
  run: async function (handler) {
    return await handler({
      transactionManager: MockManager,
    })
  },
}

const mock = jest.fn().mockImplementation(() => {
  return dbTransactionServiceMock
})

export default mock
