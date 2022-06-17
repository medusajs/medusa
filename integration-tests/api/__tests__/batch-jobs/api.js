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

const setupJobDb = async (dbConnection) => {
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
      ready_at: new Date(),
      created_by: "admin_user",
    })
    await simpleBatchJobFactory(dbConnection, {
      id: "job_3",
      type: "batch_2",
      ready_at: new Date(),
      created_by: "admin_user",
    })
    await simpleBatchJobFactory(dbConnection, {
      id: "job_4",
      type: "batch_1",
      ready_at: new Date(),
      created_by: "member-user",
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}

describe("/admin/batch-jobs", () => {
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

  describe("GET /admin/batch-jobs", () => {
    beforeEach(async () => {
      await setupJobDb(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists batch jobs created by the user", async () => {
      const api = useApi()
      const response = await api.get("/admin/batch-jobs", adminReqConfig)

      expect(response.status).toEqual(200)
      expect(response.data.batch_jobs.length).toEqual(3)
      expect(response.data).toMatchSnapshot({
        batch_jobs: [
          {
            created_at: expect.any(String),
            updated_at: expect.any(String),
            created_by: "admin_user"
          },
          {
            created_at: expect.any(String),
            updated_at: expect.any(String),
            created_by: "admin_user"
          },
          {
            created_at: expect.any(String),
            updated_at: expect.any(String),
            created_by: "admin_user"
          },
        ],
      })
    })
  })

  describe("GET /admin/batch-jobs/:id", () => {
    beforeEach(async () => {
      await setupJobDb(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("return batch job created by the user", async () => {
      const api = useApi()
      const response = await api.get("/admin/batch-jobs/job_1", adminReqConfig)

      expect(response.status).toEqual(200)
      expect(response.data.batch_job).toEqual(expect.objectContaining({
        created_at: expect.any(String),
        updated_at: expect.any(String),
        created_by: "admin_user"
      }))
    })

    it("should fail on batch job created by other user", async () => {
      const api = useApi()
      await api.get("/admin/batch-jobs/job_4", adminReqConfig)
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.type).toEqual("not_allowed")
          expect(err.response.data.message).toEqual(
            "Cannot access a batch job that does not belong to the logged in user"
          )
        })
    })
  })

  describe("POST /admin/batch-jobs/", () => {
    beforeEach(async() => {
      try {
        await adminSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async() => {
      const db = useDb()
      await db.teardown()
    })

    it("Creates a batch job", async() => {
      const api = useApi()

      const response = await api.post(
        "/admin/batch-jobs",
        {
          type: "batch_1",
          context: {},
        },
        adminReqConfig
      )

      expect(response.status).toEqual(201)
      expect(response.data.batch_job).toMatchSnapshot({
        created_by: "admin_user",
        status: "created",
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("POST /admin/batch-jobs/:id/confirm", () => {
    beforeEach(async () => {
      await setupJobDb(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Fails to confirm a batch job created by a different user", async () => {
      const api = useApi()

      const jobId = "job_4"

      api
        .post(`/admin/batch-jobs/${jobId}/confirm`, {}, adminReqConfig)
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.type).toEqual("not_allowed")
          expect(err.response.data.message).toEqual(
            "Cannot access a batch job that does not belong to the logged in user"
          )
        })
    })
  })

  describe("POST /admin/batch-jobs/:id/cancel", () => {
    beforeEach(async () => {
      try {
        await setupJobDb(dbConnection)
        await simpleBatchJobFactory(dbConnection, {
          id: "job_complete",
          type: "batch_1",
          created_by: "admin_user",
          completed_at: new Date(),
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Cancels batch job created by the user", async () => {
      const api = useApi()

      const jobId = "job_1"

      const response = await api.post(
        `/admin/batch-jobs/${jobId}/cancel`,
        {},
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.batch_job).toMatchSnapshot({
        created_at: expect.any(String),
        updated_at: expect.any(String),
        canceled_at: expect.any(String),
        status: "canceled",
      })
    })

    it("Fails to cancel a batch job created by a different user", async () => {
      expect.assertions(3)
      const api = useApi()

      const jobId = "job_4"

      api
        .post(`/admin/batch-jobs/${jobId}/cancel`, {}, adminReqConfig)
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.type).toEqual("not_allowed")
          expect(err.response.data.message).toEqual(
            "Cannot access a batch job that does not belong to the logged in user"
          )
        })
    })

    it("Fails to cancel a batch job that is already complete", async () => {
      expect.assertions(3)
      const api = useApi()

      const jobId = "job_complete"

      await api
        .post(`/admin/batch-jobs/${jobId}/cancel`, {}, adminReqConfig)
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.type).toEqual("not_allowed")
          expect(err.response.data.message).toEqual(
            "Cannot cancel completed batch job"
          )
        })
    })
  })
})
