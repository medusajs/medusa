const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { initDb, useDb } = require("../../../helpers/use-db")

jest.setTimeout(30000)

describe("Database options", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({
      cwd,
      database_extra: { idle_in_transaction_session_timeout: 2000 },
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

        await new Promise((resolve) =>
          setTimeout(() => resolve(console.log("")), 4000)
        )

        await queryRunner.commitTransaction()

        if (!queryRunner.isReleased) {
          await queryRunner.release()
        }
      } catch (error) {
        // Query runner will be released in case the idle session option kicks in
        // Therefore, out current error handler already covers the case when the session is idle
        // It throws a 409, invalid state
        expect(error?.type || error.name).toEqual(
          "QueryRunnerAlreadyReleasedError"
        )
      }
    })
  })
})
