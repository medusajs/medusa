const path = require("path")

const setupServer = require("../../../../helpers/setup-server")
const { useApi } = require("../../../../helpers/use-api")
const { initDb, useDb } = require("../../../../helpers/use-db")

const adminSeeder = require("../../../helpers/admin-seeder")
const batchJobSeeder = require("../../../helpers/batch-job-seeder")
const userSeeder = require("../../../helpers/user-seeder")

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

jest.setTimeout(1000000)

describe("Product import batch job", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })

    medusaProcess = await setupServer({
      cwd,
      redisUrl: "redis://127.0.0.1:6379",
      uploadDir: __dirname,
      verbose: true,
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  beforeEach(async () => {
    try {
      await batchJobSeeder(dbConnection)
      await adminSeeder(dbConnection)
      await userSeeder(dbConnection)
    } catch (e) {
      console.log(e)
      throw e
    }
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should import a csv file", async () => {
    jest.setTimeout(1000000)
    const api = useApi()

    const response = await api.post(
      "/admin/batch-jobs",
      {
        type: "product_import",
        context: {
          fileKey: "product-import.csv",
        },
      },
      adminReqConfig
    )

    console.log(response.data)

    const batchJobId = response.data.batch_job.id

    expect(batchJobId).toBeTruthy()

    // Pull to check the status until it is completed
    let batchJob
    let shouldContinuePulling = true
    while (shouldContinuePulling) {
      const res = await api.get(
        `/admin/batch-jobs/${batchJobId}`,
        adminReqConfig
      )

      await new Promise((resolve, _) => {
        setTimeout(resolve, 1000)
      })

      batchJob = res.data.batch_job

      // TODO: check, sometime the job is randomly stuck in a state (mostly "created" but sometimes in "processing" also)
      shouldContinuePulling = !(
        batchJob.status === "completed" || batchJob.status === "failed"
      )
    }

    expect(batchJob.status).toBe("completed")

    const productsResponse = await api.get("/admin/products", adminReqConfig)

    expect(productsResponse.data.count).toBe(2)
    expect(productsResponse.data.products).toMatchSnapshot()
  })
})
