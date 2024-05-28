const path = require("path")

const setupServer = require("../../../environment-helpers/setup-server")
const { initDb, useDb } = require("../../../environment-helpers/use-db")

jest.setTimeout(30000)

describe("Database options", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({
      cwd,
      databaseExtra: { idle_in_transaction_session_timeout: 1000 },
    })
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("idle_in_transaction_session_timeout", () => {
    it("Resolves successfully", async () => {
      expect.assertions(1)

      let queryRunner

      try {
        queryRunner = dbConnection.createQueryRunner()
        await queryRunner.connect()

        await queryRunner.startTransaction()

        await queryRunner.query(`select * from product`)

        // Idle time is 1000 ms so this should timeout
        await new Promise((resolve) =>
          setTimeout(() => resolve(undefined), 2000)
        )

        // This query should fail with a QueryRunnerAlreadyReleasedError
        await queryRunner.commitTransaction()
      } catch (error) {
        // Query runner will be released in case idle_in_transaction_session_timeout kicks in
        expect(error?.type || error.name).toEqual(
          "QueryRunnerAlreadyReleasedError"
        )
      }
    })
  })
})
