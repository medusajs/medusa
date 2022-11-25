import { MockManager } from "medusa-test-utils"
import { Connection } from "typeorm"
import { DbTransactionService } from "../index"

export const dbTransactionServiceMock: DbTransactionService = Object.create({
  connection_: {} as Connection,
  run: async function (handler) {
    return await handler({
      transactionManager: MockManager,
    })
  },
})

const mock = jest.fn().mockImplementation(() => {
  return dbTransactionServiceMock
})

export default mock
