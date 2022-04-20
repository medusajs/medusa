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

  describe("POST /admin/batch/:id/complete", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await userSeeder(dbConnection)

        await simpleBatchJobFactory(dbConnection, {
          id: "job_1",
          type: "batch_1",
          created_by: "admin_user",
          status: "created",
        })
        await simpleBatchJobFactory(dbConnection, {
          id: "job_2",
          type: "batch_1",
          status: "awaiting_confirmation",
          created_by: "admin_user",
        })
        await simpleBatchJobFactory(dbConnection, {
          id: "job_3",
          type: "batch_1",
          status: "awaiting_confirmation",
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

    it("Completes batch job created by the user", async () => {
      const api = useApi()

      const jobId = "job_2"

      const response = await api.post(
        `/admin/batch/${jobId}/complete`,
        {},
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.batch_job).toMatchSnapshot({
        created_at: expect.any(String),
        updated_at: expect.any(String),
        completed_at: expect.any(String),
        status: "completed",
      })
    })

    it("Fails to complete a batch job created by a different user", async () => {
      const api = useApi()

      const jobId = "job_3"

      api
        .post(`/admin/batch/${jobId}/complete`, {}, adminReqConfig)
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.type).toEqual("not_allowed")
          expect(err.response.data.message).toEqual(
            "Cannot complete batch jobs created by other users"
          )
        })
    })

    it("Fails to complete a batch job not awaiting completion", async () => {
      const api = useApi()

      const jobId = "job_1"

      api
        .post(`/admin/batch/${jobId}/complete`, {}, adminReqConfig)
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.type).toEqual("invalid_data")
          expect(err.response.data.message).toEqual(
            `Cannot complete a batch job with status "created"`
          )
        })
    })
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
