const path = require("path")
const fs = require('fs/promises')

const setupServer = require("../../../../helpers/setup-server")
const { useApi } = require("../../../../helpers/use-api")
const { initDb, useDb } = require("../../../../helpers/use-db")

const adminSeeder = require("../../../helpers/admin-seeder")
const userSeeder = require("../../../helpers/user-seeder")
const productSeeder = require("../../../helpers/product-seeder")

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

jest.setTimeout(1000000)

describe("Batch job of product-export type", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({
      cwd,
      redisUrl: "redis://127.0.0.1:6379",
      uploadDir: __dirname,
      verbose: false
    })
  })

  const exportFilePath = path.resolve(__dirname, "product-export.csv")

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()

    await fs.unlink(exportFilePath)
  })

  beforeEach(async () => {
    try {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)
      await userSeeder(dbConnection)
    } catch (e) {
      console.log(e)
      throw e
    }
  })

  afterEach(async() => {
    const db = useDb()
    await db.teardown()
  })

  it('should export a csv file containing the expected products', async () => {
    jest.setTimeout(1000000)
    const api = useApi()

    const productPayload = {
      title: "Test export product",
      description: "test-product-description",
      type: { value: "test-type" },
      images: ["test-image.png", "test-image-2.png"],
      collection_id: "test-collection",
      tags: [{ value: "123" }, { value: "456" }],
      options: [{ title: "size" }, { title: "color" }],
      variants: [
        {
          title: "Test variant",
          inventory_quantity: 10,
          sku: "test-variant-sku-product-export",
          prices: [
            {
              currency_code: "usd",
              amount: 100,
            },
            {
              currency_code: "eur",
              amount: 45,
            },
            {
              currency_code: "dkk",
              amount: 30,
            },
          ],
          options: [{ value: "large" }, { value: "green" }],
        },
      ],
    }
    await api.post("/admin/products", productPayload, adminReqConfig)

    const batchPayload = {
      type: "product-export",
      context: {
        filterable_fields: { title: "Test export product" }
      },
    }
    const batchJobRes = await api.post("/admin/batch-jobs", batchPayload, adminReqConfig)
    const batchJobId = batchJobRes?.data?.batch_job?.id

    expect(batchJobId).toBeTruthy()

    // Pull to check the status until it is completed
    let shouldContinuePulling = true
    while (shouldContinuePulling) {
      const res = await api
      .get(`/admin/batch-jobs/${batchJobId}`, adminReqConfig)

      await new Promise((resolve, _) => {
        setTimeout(resolve, 1000)
      })

      const batchJob = res.data.batch_job
      shouldContinuePulling = !(batchJob.status === "completed")
    }

    const isFileExists = (await fs.stat(exportFilePath)).isFile()

    expect(isFileExists).toBeTruthy()

    const data = (await fs.readFile(exportFilePath)).toString()
    const [, ...lines] = data.split("\r\n").filter(l => l)

    expect(lines.length).toBe(1)

    const lineColumn = lines[0].split(";")

    expect(lineColumn[1]).toBe(productPayload.title)
    expect(lineColumn[3]).toBe(productPayload.description)
    expect(lineColumn[22]).toBe(productPayload.variants[0].title)
    expect(lineColumn[23]).toBe(productPayload.variants[0].sku)
  })
})