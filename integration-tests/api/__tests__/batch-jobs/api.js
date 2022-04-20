const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")
const userSeeder = require("../../helpers/user-seeder")
const { simpleBatchJobFactory } = require("../../factories")

jest.setTimeout(50000)

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("/admin/batch", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd, verbose: false })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/batch", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await userSeeder(dbConnection)

        await simpleBatchJobFactory(dbConnection, {
          id: "job_1",
          type: "batch_1",
          created_by: "admin_user",
        })
        await simpleBatchJobFactory(dbConnection, {
          id: "job_2",
          type: "batch_2",
          created_by: "admin_user",
        })
        await simpleBatchJobFactory(dbConnection, {
          id: "job_3",
          type: "batch_2",
          created_by: "admin_user",
        })
        await simpleBatchJobFactory(dbConnection, {
          id: "job_4",
          type: "batch_1",
          created_by: "member-user",
        })
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists batch jobs created by the user", async () => {
      const api = useApi()

      const response = await api.get("/admin/batch", adminReqConfig)

      expect(response.status).toEqual(200)
      expect(response.data.batch_jobs.length).toEqual(3)
      expect(response.data).toMatchSnapshot({
        batch_jobs: [
          {
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          {
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          {
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
      })
    })
  })
})
