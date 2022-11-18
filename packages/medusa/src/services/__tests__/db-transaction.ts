import {
  databaseFactory,
  defaultContainerMock,
  fakeUserData1,
  fakeUserData2,
  retrieveUsers,
} from "../__fixtures__/db-transaction"
import { asValue, AwilixContainer, createContainer } from "awilix"
import { Connection, EntityManager } from "typeorm"
import { DbTransactionService } from "../index"
import { User } from "../../models"

jest.setTimeout(1000000)

describe("DbTransactionService", function () {
  let dbConnection: Connection
  let container: AwilixContainer
  let dbTransactionService: DbTransactionService

  beforeEach(async () => {
    await databaseFactory.dropDb()
    dbConnection = await databaseFactory.initDb()

    container = createContainer({}, defaultContainerMock)
    defaultContainerMock.register("manager", asValue(dbConnection.manager))
    dbTransactionService = container.resolve(
      DbTransactionService.RESOLUTION_KEY
    )
  })

  afterEach(async () => {
    await databaseFactory.dropDb()
    return await dbConnection.close()
  })

  it("should have a db connection established", () => {
    expect(dbConnection).toBeDefined()
  })

  it("should commit a transaction", async () => {
    await dbTransactionService.run(
      async ({ transactionManager }: { transactionManager: EntityManager }) => {
        await transactionManager
          .createQueryBuilder()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(fakeUserData1)
          .execute()
      }
    )

    const users = await retrieveUsers(dbConnection)

    expect(users).toHaveLength(1)
    expect(users[0]).toEqual(expect.objectContaining(fakeUserData1))
  })

  it("should commit all nested transactions", async () => {
    await dbTransactionService.run(
      async ({
        transactionManager: tm1,
      }: {
        transactionManager: EntityManager
      }) => {
        await tm1
          .createQueryBuilder()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(fakeUserData1)
          .execute()

        await dbTransactionService.run(
          async ({
            transactionManager: tm2,
          }: {
            transactionManager: EntityManager
          }) => {
            await tm2
              .createQueryBuilder()
              .createQueryBuilder()
              .insert()
              .into(User)
              .values(fakeUserData2)
              .execute()
          }
        )
      }
    )

    const users = await retrieveUsers(dbConnection)

    expect(users).toHaveLength(2)
    expect(users[0]).toEqual(expect.objectContaining(fakeUserData1))
    expect(users[1]).toEqual(expect.objectContaining(fakeUserData2))
  })

  it("should commit transaction of different depth", async () => {
    await dbTransactionService.run(
      async ({
        transactionManager: tm1,
      }: {
        transactionManager: EntityManager
      }) => {
        await tm1
          .createQueryBuilder()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(fakeUserData1)
          .execute()

        await dbTransactionService.run(
          async ({
            transactionManager: tm2,
          }: {
            transactionManager: EntityManager
          }) => {
            await tm2
              .createQueryBuilder()
              .createQueryBuilder()
              .insert()
              .into(User)
              .values(fakeUserData2)
              .execute()
          },
          {
            transactionManager: tm1,
          }
        )
      }
    )

    const users = await retrieveUsers(dbConnection)

    expect(users).toHaveLength(2)
    expect(users[0]).toEqual(expect.objectContaining(fakeUserData1))
    expect(users[1]).toEqual(expect.objectContaining(fakeUserData2))
  })

  it("should rollback a transaction", async () => {
    const errorMessage = "failed"
    let err

    await dbTransactionService
      .run(
        async ({
          transactionManager,
        }: {
          transactionManager: EntityManager
        }) => {
          await transactionManager
            .createQueryBuilder()
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(fakeUserData1)
            .execute()

          throw new Error(errorMessage)
        }
      )
      .catch((e) => (err = e))

    const users = await retrieveUsers(dbConnection)

    expect(users).toHaveLength(0)
    expect(err).toBeDefined()
    expect(err.message).toBe(errorMessage)
  })

  it("should rollback all nested transactions if the last one fail and bubble back the error", async () => {
    const errorMessage = "failed"
    let err

    await dbTransactionService
      .run(
        async ({
          transactionManager: tm1,
        }: {
          transactionManager: EntityManager
        }) => {
          await tm1
            .createQueryBuilder()
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(fakeUserData1)
            .execute()

          await dbTransactionService.run(
            async ({
              transactionManager: tm2,
            }: {
              transactionManager: EntityManager
            }) => {
              await tm2
                .createQueryBuilder()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values(fakeUserData2)
                .execute()

              throw new Error(errorMessage)
            }
          )
        }
      )
      .catch((e) => (err = e))

    const users = await retrieveUsers(dbConnection)

    expect(users).toHaveLength(0)
    expect(err).toBeDefined()
    expect(err.message).toBe(errorMessage)
  })

  it("should rollback a transaction and", async () => {
    const errorMessage = "failed"
    let err

    await dbTransactionService
      .run(
        async ({
          transactionManager,
        }: {
          transactionManager: EntityManager
        }) => {
          await transactionManager
            .createQueryBuilder()
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(fakeUserData1)
            .execute()

          throw new Error(errorMessage)
        }
      )
      .catch((e) => (err = e))

    const users = await retrieveUsers(dbConnection)

    expect(users).toHaveLength(0)
    expect(err).toBeDefined()
    expect(err.message).toBe(errorMessage)
  })

  it("should rollback all nested transactions if the last one fail and bubble back a custom error", async () => {
    const errorMessage = "failed"
    const customErrorMessage = "custom error handler failed"
    let err

    await dbTransactionService
      .run(
        async ({
          transactionManager: tm1,
        }: {
          transactionManager: EntityManager
        }) => {
          await tm1
            .createQueryBuilder()
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(fakeUserData1)
            .execute()

          await dbTransactionService.run(
            async ({
              transactionManager: tm2,
            }: {
              transactionManager: EntityManager
            }) => {
              await tm2
                .createQueryBuilder()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values(fakeUserData2)
                .execute()

              throw new Error(errorMessage)
            },
            {
              errorHandler: () => {
                throw new Error(customErrorMessage)
              },
            }
          )
        }
      )
      .catch((e) => (err = e))

    const users = await retrieveUsers(dbConnection)

    expect(users).toHaveLength(0)
    expect(err).toBeDefined()
    expect(err.message).toBe(customErrorMessage)
  })
})
