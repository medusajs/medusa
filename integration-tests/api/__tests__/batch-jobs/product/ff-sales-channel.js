const fs = require("fs")
const path = require("path")

const { useApi } = require("../../../../helpers/use-api")
const { useDb } = require("../../../../helpers/use-db")

const adminSeeder = require("../../../helpers/admin-seeder")
const userSeeder = require("../../../helpers/user-seeder")
const { simpleSalesChannelFactory } = require("../../../factories")
const batchJobSeeder = require("../../../helpers/batch-job-seeder")
const {
  simpleProductCollectionFactory,
} = require("../../../factories/simple-product-collection-factory")

const startServerWithEnvironment =
  require("../../../../helpers/start-server-with-environment").default

jest.setTimeout(30000)

function getImportFile() {
  return path.resolve(
    "__tests__",
    "batch-jobs",
    "product",
    "product-import-ss.csv"
  )
}

function copyTemplateFile() {
  const csvTemplate = path.resolve(
    "__tests__",
    "batch-jobs",
    "product",
    "product-import-ss-template.csv"
  )
  const destination = getImportFile()
  fs.copyFileSync(csvTemplate, destination)
}

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

  const collectionHandle1 = "test-collection1"

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))

    cleanTempData()

    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_SALES_CHANNELS: true },
      uploadDir: __dirname,
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
    try {
      await batchJobSeeder(dbConnection)
      await adminSeeder(dbConnection)
      await userSeeder(dbConnection)

      await simpleSalesChannelFactory(dbConnection, {
        name: "Import Sales Channel 1",
      })
      await simpleSalesChannelFactory(dbConnection, {
        name: "Import Sales Channel 2",
      })
      await simpleProductCollectionFactory(dbConnection, {
        handle: collectionHandle1,
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  })

  afterEach(async () => {
    const db = useDb()
    return await db.teardown()
  })

  it("Import products to an existing sales channel", async () => {
    jest.setTimeout(1000000)
    const api = useApi()

    copyTemplateFile()

    const response = await api.post(
      "/admin/batch-jobs",
      {
        type: "product-import",
        context: {
          fileKey: "product-import-ss.csv",
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

      shouldContinuePulling = !(
        batchJob.status === "completed" || batchJob.status === "failed"
      )
    }

    expect(batchJob.status).toBe("completed")

    const productsResponse = await api.get("/admin/products", adminReqConfig)

    expect(productsResponse.data.count).toBe(1)
    expect(productsResponse.data.products).toEqual([
      expect.objectContaining({
        title: "Test product",
        description:
          "Hopper Stripes Bedding, available as duvet cover, pillow sham and sheet.\\n100% organic cotton, soft and crisp to the touch. Made in Portugal.",
        handle: "test-product-product-1",
        variants: [
          expect.objectContaining({
            title: "Test variant",
            sku: "test-sku-1",
          }),
        ],
        sales_channels: [
          expect.objectContaining({
            name: "Import Sales Channel 1",
            is_disabled: false,
          }),
          expect.objectContaining({
            name: "Import Sales Channel 2",
            is_disabled: false,
          }),
        ],
        collection: expect.objectContaining({
          handle: collectionHandle1,
        }),
      }),
    ])
  })
})
