const fs = require("fs")
const path = require("path")

const { useApi } = require("../../../../helpers/use-api")
const { useDb } = require("../../../../helpers/use-db")

const adminSeeder = require("../../../helpers/admin-seeder")
const userSeeder = require("../../../helpers/user-seeder")
const { simpleSalesChannelFactory } = require("../../../factories")

const startServerWithEnvironment =
  require("../../../../helpers/start-server-with-environment").default

jest.setTimeout(30000)

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

function cleanTempData() {
  // cleanup tmp ops files
  const opsFiles = path.resolve("__tests__", "batch-jobs", "product", "imports")

  fs.rmSync(opsFiles, { recursive: true, force: true })
}

describe("Product import - Sales Channel", () => {
  let dbConnection
  let medusaProcess

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))

    cleanTempData()

    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_SALES_CHANNELS: true },
      redisUrl: "redis://127.0.0.1:6379",
      uploadDir: __dirname,
      verbose: true,
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    cleanTempData()
    medusaProcess.kill()
  })

  beforeEach(async () => {
    await simpleSalesChannelFactory(dbConnection, {
      name: "My Sales Channel",
    })

    try {
      await adminSeeder(dbConnection)
      await userSeeder(dbConnection)
    } catch (e) {
      console.log(e)
      throw e
    }
  })

  afterEach(async () => {
    const db = useDb()
    return await db.teardown()
  })

  describe("Import products to a sales channel", () => {
    it("Import products to an existing sales channel", async () => {
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

      const batchJobId = response.data.batch_job.id

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

        console.log({ status: batchJob.status })

        shouldContinuePulling = !(
          batchJob.status === "completed" || batchJob.status === "failed"
        )
      }

      expect(batchJob.status).toBe("completed")

      const productsResponse = await api.get("/admin/products", adminReqConfig)

      expect(productsResponse.data.count).toBe(2)
    })
  })
})
