import { dropDatabase } from "pg-god"
import {
  databaseFactory,
  pgGodCredentials,
} from "../__fixtures__/db-connection"
import { asValue, AwilixContainer, createContainer } from "awilix"
import { Connection, EntityManager } from "typeorm"
import {
  defaultContainerMock,
  fakeUserData,
} from "../__fixtures__/db-transaction"
import { DbTransactionService } from "../index"
import { User } from "../../models"

jest.setTimeout(1000000)

describe("DbTransactionService", function () {
  let dbConnection: Connection
  let container: AwilixContainer
  let dbTransactionService: DbTransactionService

  beforeAll(async () => {
    dbConnection = await databaseFactory.initDb()
    container = createContainer({}, defaultContainerMock)
    defaultContainerMock.register("manager", asValue(dbConnection.manager))
    dbTransactionService = container.resolve(
      DbTransactionService.RESOLUTION_KEY
    )
  })

  afterAll(async () => {
    return await dropDatabase(
      { databaseName: databaseFactory.DB_NAME },
      pgGodCredentials
    )
  })

  it("should have a db connection established", () => {
    expect(dbConnection).toBeDefined()
  })

  it("should start a transaction and commit once finished", async () => {
    await dbTransactionService.run(
      async ({ transactionManager }: { transactionManager: EntityManager }) => {
        await transactionManager
          .createQueryBuilder()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(fakeUserData)
          .execute()
      }
    )
  })
})
