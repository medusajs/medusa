const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
import { BatchJobStatus } from "@medusajs/medusa"

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

  describe("POST /admin/batch/:id/cancel", () => {
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
          id: "job_complete",
          type: "batch_1",
          created_by: "admin_user",
          status: BatchJobStatus.COMPLETED,
        })

        await simpleBatchJobFactory(dbConnection, {
          id: "job_2",
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

    it("Cancels batch job created by the user", async () => {
      const api = useApi()

      const jobId = "job_1"

      const response = await api.post(
        `/admin/batch/${jobId}/cancel`,
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

      const jobId = "job_2"

      api
        .post(`/admin/batch/${jobId}/cancel`, {}, adminReqConfig)
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

      api
        .post(`/admin/batch/${jobId}/cancel`, {}, adminReqConfig)
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