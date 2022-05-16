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

  beforeAll(async() => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async() => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
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

    afterEach(async() => {
      const db = useDb()
      await db.teardown()
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
})
