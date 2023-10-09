const fs = require("fs")
const path = require("path")

const { useApi } = require("../../../../environment-helpers/use-api")
const { useDb } = require("../../../../environment-helpers/use-db")

const adminSeeder = require("../../../../helpers/admin-seeder")
const userSeeder = require("../../../../helpers/user-seeder")
const { simpleProductCategoryFactory } = require("../../../../factories")
const batchJobSeeder = require("../../../../helpers/batch-job-seeder")
const {
  simpleProductCollectionFactory,
} = require("../../../../factories/simple-product-collection-factory")

const startServerWithEnvironment =
  require("../../../../environment-helpers/start-server-with-environment").default

jest.setTimeout(30000)

function getImportFile() {
  return path.resolve(
    "__tests__",
    "batch-jobs",
    "product",
    "product-import-pc.csv"
  )
}

function copyTemplateFile() {
  const csvTemplate = path.resolve(
    "__tests__",
    "batch-jobs",
    "product",
    "product-import-pc-template.csv"
  )
  const destination = getImportFile()
  fs.copyFileSync(csvTemplate, destination)
}

const adminReqConfig = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

function cleanTempData() {
  // cleanup tmp ops files
  const opsFiles = path.resolve("__tests__", "batch-jobs", "product", "imports")

  fs.rmSync(opsFiles, { recursive: true, force: true })
}

describe("Product import - Product Category", () => {
  let cat
  let dbConnection
  let medusaProcess

  const collectionHandle1 = "test-collection1"

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))

    cleanTempData()

    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_PRODUCT_CATEGORIES: true },
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

      await simpleProductCategoryFactory(dbConnection, {
        name: "category",
        handle: "import-category-1",
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

  it("Import products with an existing product category", async () => {
    jest.setTimeout(1000000)
    const api = useApi()

    copyTemplateFile()

    const response = await api.post(
      "/admin/batch-jobs",
      {
        type: "product-import",
        context: {
          fileKey: "product-import-pc.csv",
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

    const productsResponse = await api.get(
      "/admin/products?expand=categories",
      adminReqConfig
    )

    expect(productsResponse.data.count).toBe(1)
    expect(productsResponse.data.products).toEqual([
      expect.objectContaining({
        title: "Test product",
        handle: "test-product-product-1",
        categories: [
          expect.objectContaining({
            handle: "import-category-1",
          }),
        ],
      }),
    ])
  })
})
