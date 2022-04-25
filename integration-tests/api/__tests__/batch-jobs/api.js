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
    medusaProcess = await setupServer({ cwd })
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

    it("Requests completion of batch job created by the user", async () => {
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
        confirmed_at: null,
        status: "awaiting_confirmation",
      })
    })

    it("Fails to confirm a batch job created by a different user", async () => {
      const api = useApi()

      const jobId = "job_3"

      await api
        .post(`/admin/batch/${jobId}/complete`, {}, adminReqConfig)
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.type).toEqual("not_allowed")
          expect(err.response.data.message).toEqual(
            "Cannot confirm batch jobs created by other users"
          )
        })
    })
  })

  describe("POST /admin/batch/", () => {
    beforeEach(async() => {
      try {
        await adminSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    it("Creates a batch job", async() => {
      const api = useApi()

      const response = await api.post(
        "/admin/batch",
        {
          type: "batch_1",
          context: JSON.stringify({}),
        },
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.batch_job).toMatchSnapshot({
        created_by: "admin_user",
        status: "created",
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("GET /admin/batch/id", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)

        await simpleBatchJobFactory(dbConnection, {
          id: "job_1",
          type: "batch_1",
          created_by: "admin_user",
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

    it("Retrieves batch job with id", async () => {
      const api = useApi()

      const response = await api.get(`/admin/batch/job_1`, adminReqConfig)

      expect(response.status).toEqual(200)
      expect(response.data.batch_job).toMatchSnapshot({
        id: "job_1",
        created_by: "admin_user",
      })
    })

    it("Fails with a descriptive error when retrieving batch job that doesn't exist", async () => {
      expect.assertions(3)

      const api = useApi()

      try {
        await api.get(`/admin/batch/job_2`, adminReqConfig)
      } catch (error) {
        expect(error.response.status).toEqual(404)
        expect(error.response.data.type).toEqual("not_found")
        expect(error.response.data.message).toEqual(
          "Batch job with id job_2 was not found"
        )
      }
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
