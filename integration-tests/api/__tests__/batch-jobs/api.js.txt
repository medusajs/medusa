const path = require("path")

const setupServer = require("../../../environment-helpers/setup-server")
const { useApi } = require("../../../environment-helpers/use-api")
const { initDb, useDb } = require("../../../environment-helpers/use-db")

const adminSeeder = require("../../../helpers/admin-seeder")
const userSeeder = require("../../../helpers/user-seeder")

const { simpleBatchJobFactory } = require("../../../factories")

jest.setTimeout(50000)

const adminReqConfig = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const setupJobDb = async (dbConnection) => {
  await adminSeeder(dbConnection)
  await userSeeder(dbConnection)

  await simpleBatchJobFactory(dbConnection, {
    id: "job_1",
    type: "product-export",
    created_by: expect.any(String),
  })
  await simpleBatchJobFactory(dbConnection, {
    id: "job_2",
    type: "product-export",
    created_by: expect.any(String),
  })
  await simpleBatchJobFactory(dbConnection, {
    id: "job_3",
    type: "product-export",
    created_by: expect.any(String),
  })
  await simpleBatchJobFactory(dbConnection, {
    id: "job_4",
    type: "product-export",
    status: "awaiting_confirmation",
    created_by: "member-user",
  })
  await simpleBatchJobFactory(dbConnection, {
    id: "job_5",
    type: "product-export",
    status: "completed",
    completed_at: "2022-06-27T22:00:00.000Z",
    created_by: expect.any(String),
  })
}

describe("/admin/batch-jobs", () => {
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
      expect(response.data.batch_jobs.length).toEqual(4)
      expect(response.data).toEqual(
        expect.objectContaining({
          batch_jobs: expect.arrayContaining([
            expect.objectContaining({
              id: "job_5",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              created_by: expect.any(String),
            }),
            expect.objectContaining({
              id: "job_3",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              created_by: expect.any(String),
            }),
            expect.objectContaining({
              id: "job_2",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              created_by: expect.any(String),
            }),
            expect.objectContaining({
              id: "job_1",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              created_by: expect.any(String),
            }),
          ]),
        })
      )
    })

    it("lists batch jobs created by the user and where completed_at is null ", async () => {
      const api = useApi()
      const response = await api.get(
        "/admin/batch-jobs?completed_at=null",
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.batch_jobs.length).toEqual(3)
      expect(response.data).toEqual(
        expect.objectContaining({
          batch_jobs: expect.arrayContaining([
            expect.objectContaining({
              id: "job_3",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              created_by: expect.any(String),
            }),
            expect.objectContaining({
              id: "job_2",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              created_by: expect.any(String),
            }),
            expect.objectContaining({
              id: "job_1",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              created_by: expect.any(String),
            }),
          ]),
        })
      )
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
      expect(response.data.batch_job).toEqual(
        expect.objectContaining({
          created_at: expect.any(String),
          updated_at: expect.any(String),
          created_by: expect.any(String),
        })
      )
    })

    it("should fail on batch job created by other user", async () => {
      const api = useApi()
      await api.get("/admin/batch-jobs/job_4", adminReqConfig).catch((err) => {
        expect(err.response.status).toEqual(400)
        expect(err.response.data.type).toEqual("not_allowed")
        expect(err.response.data.message).toEqual(
          "Cannot access a batch job that does not belong to the logged in user"
        )
      })
    })
  })

  describe("POST /admin/batch-jobs/", () => {
    beforeEach(async () => {
      await setupJobDb(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Creates a batch job", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/batch-jobs",
        {
          type: "product-export",
          context: {},
        },
        adminReqConfig
      )

      expect(response.status).toEqual(201)
      expect(response.data.batch_job).toEqual(
        expect.objectContaining({
          created_by: expect.any(String),
          status: "created",
          id: expect.any(String),
        })
      )
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

      await api
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
      await setupJobDb(dbConnection)
      await simpleBatchJobFactory(dbConnection, {
        id: "job_complete",
        type: "product-export",
        created_by: expect.any(String),
        completed_at: new Date(),
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Fails to cancel a batch job created by a different user", async () => {
      expect.assertions(3)
      const api = useApi()

      const jobId = "job_4"

      await api
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

    it("Cancels batch job created by the user", async () => {
      const api = useApi()

      const jobId = "job_1"

      const response = await api.post(
        `/admin/batch-jobs/${jobId}/cancel`,
        {},
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.batch_job).toEqual(
        expect.objectContaining({
          created_at: expect.any(String),
          updated_at: expect.any(String),
          canceled_at: expect.any(String),
          status: "canceled",
        })
      )
    })
  })
})
