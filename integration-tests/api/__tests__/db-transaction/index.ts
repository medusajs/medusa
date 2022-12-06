import { DbTransactionService, User } from "@medusajs/medusa"
import { initDb, useDb } from "../../../helpers/use-db"
import path from "path"
import setupServer from "../../../helpers/setup-server"
import { Connection, EntityManager } from "typeorm"
import {
  fakeUserData1,
  fakeUserData2,
  retrieveUsers,
  Service1,
} from "../__fixtures__/db-transaction"
import { ChildProcess } from "child_process"

jest.setTimeout(100000)

describe("DbTransactionService", function () {
  let medusaProcess: ChildProcess
  let dbConnection: Connection
  let manager: EntityManager
  let dbTransactionService: DbTransactionService
  let service1: Service1

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    try {
      const cwd = path.resolve(path.join(__dirname, "..", ".."))
      dbConnection = await initDb({ cwd })
      manager = dbConnection.manager
      medusaProcess = await setupServer({ cwd } as any)

      dbTransactionService = new DbTransactionService({
        manager,
      })
      service1 = new Service1({ dbTransactionService })
    } catch (e) {
      console.log(e)
    }
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  afterEach(async () => {
    return await doAfterEach()
  })

  it("should have a db connection established", () => {
    expect(dbConnection).toBeDefined()
  })

  it("should commit a transaction", async () => {
    await dbTransactionService.run(
      async ({ transactionManager }: { transactionManager: EntityManager }) => {
        await transactionManager
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

  it("should rollback all nested transactions if one of them fail and bubble back the error", async () => {
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
                .insert()
                .into(User)
                .values(fakeUserData2)
                .execute()
            }
          )

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

  /*  describe("validate backward compatibility with the atomic phase", () => {
      it("should commit the transactions", async () => {
        await service1.createUserInRunBlockCallingAnAtomicPhaseMethod()
  
        const users = await retrieveUsers(dbConnection)
  
        expect(users).toHaveLength(1)
        expect(users[0]).toEqual(expect.objectContaining(fakeUserData1))
      })
    })*/
})
