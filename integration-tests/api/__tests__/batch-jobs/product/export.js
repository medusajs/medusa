const path = require("path")
const fs = require("fs/promises")
import { resolve, sep } from "path"
import { simpleSalesChannelFactory } from "../../../factories"

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

jest.setTimeout(180000)

describe("Batch job of product-export type", () => {
  let medusaProcess
  let dbConnection
  let exportFilePath = ""
  let topDir = ""

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({
      cwd,
      uploadDir: __dirname,
    })
  })

  afterAll(async () => {
    if (topDir !== "") {
      await fs.rm(resolve(__dirname, topDir), { recursive: true })
    }

    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  beforeEach(async () => {
    await productSeeder(dbConnection)
    await adminSeeder(dbConnection)
    await userSeeder(dbConnection)

    await simpleSalesChannelFactory(dbConnection, {
      id: "test-channel",
      is_default: true,
    })
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()

    try {
      const isFileExists = (await fs.stat(exportFilePath))?.isFile()

      if (isFileExists) {
        const [, relativeRoot] = exportFilePath
          .replace(__dirname, "")
          .split(sep)

        if ((await fs.stat(resolve(__dirname, relativeRoot)))?.isDirectory()) {
          topDir = relativeRoot
        }

        await fs.unlink(exportFilePath)
      }
    } catch (e) {
      console.log(e)
    }
  })

  it("should export a csv file containing the expected products", async () => {
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
    const createProductRes = await api.post(
      "/admin/products",
      productPayload,
      adminReqConfig
    )
    const productId = createProductRes.data.product.id
    const variantId = createProductRes.data.product.variants[0].id

    const batchPayload = {
      type: "product-export",
      context: {
        filterable_fields: {
          title: "Test export product",
        },
      },
    }
    const batchJobRes = await api.post(
      "/admin/batch-jobs",
      batchPayload,
      adminReqConfig
    )
    const batchJobId = batchJobRes.data.batch_job.id

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
      shouldContinuePulling = !(
        batchJob.status === "completed" || batchJob.status === "failed"
      )
    }

    expect(batchJob.status).toBe("completed")

    exportFilePath = path.resolve(__dirname, batchJob.result.file_key)
    const isFileExists = (await fs.stat(exportFilePath)).isFile()

    expect(isFileExists).toBeTruthy()

    const fileSize = (await fs.stat(exportFilePath)).size
    expect(batchJob.result?.file_size).toBe(fileSize)

    const data = (await fs.readFile(exportFilePath)).toString()
    const [, ...lines] = data.split("\r\n").filter((l) => l)

    expect(lines.length).toBe(1)

    const lineColumn = lines[0].split(";")

    expect(lineColumn[0]).toBe(productId)
    expect(lineColumn[2]).toBe(productPayload.title)
    expect(lineColumn[4]).toBe(productPayload.description)
    expect(lineColumn[23]).toBe(variantId)
    expect(lineColumn[24]).toBe(productPayload.variants[0].title)
    expect(lineColumn[25]).toBe(productPayload.variants[0].sku)
  })

  it("should export a csv file containing the expected products including new line char in the cells", async () => {
    const api = useApi()

    const productPayload = {
      title: "Test export product",
      description: "test-product-description\ntest line 2",
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
    const createProductRes = await api.post(
      "/admin/products",
      productPayload,
      adminReqConfig
    )
    const productId = createProductRes.data.product.id
    const variantId = createProductRes.data.product.variants[0].id

    const batchPayload = {
      type: "product-export",
      context: {
        filterable_fields: {
          title: "Test export product",
        },
      },
    }
    const batchJobRes = await api.post(
      "/admin/batch-jobs",
      batchPayload,
      adminReqConfig
    )
    const batchJobId = batchJobRes.data.batch_job.id

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
      shouldContinuePulling = !(
        batchJob.status === "completed" || batchJob.status === "failed"
      )
    }

    expect(batchJob.status).toBe("completed")

    exportFilePath = path.resolve(__dirname, batchJob.result.file_key)
    const isFileExists = (await fs.stat(exportFilePath)).isFile()

    expect(isFileExists).toBeTruthy()

    const fileSize = (await fs.stat(exportFilePath)).size
    expect(batchJob.result?.file_size).toBe(fileSize)

    const data = (await fs.readFile(exportFilePath)).toString()
    const [, ...lines] = data.split("\r\n").filter((l) => l)

    expect(lines.length).toBe(1)

    const lineColumn = lines[0].split(";")

    expect(lineColumn[0]).toBe(productId)
    expect(lineColumn[2]).toBe(productPayload.title)
    expect(lineColumn[4]).toBe(`"${productPayload.description}"`)
    expect(lineColumn[23]).toBe(variantId)
    expect(lineColumn[24]).toBe(productPayload.variants[0].title)
    expect(lineColumn[25]).toBe(productPayload.variants[0].sku)
  })

  it("should export a csv file containing a limited number of products", async () => {
    const api = useApi()

    const batchPayload = {
      type: "product-export",
      context: {
        batch_size: 1,
        filterable_fields: { collection_id: "test-collection" },
        order: "created_at",
      },
    }

    const batchJobRes = await api.post(
      "/admin/batch-jobs",
      batchPayload,
      adminReqConfig
    )
    const batchJobId = batchJobRes.data.batch_job.id

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
      shouldContinuePulling = !(
        batchJob.status === "completed" || batchJob.status === "failed"
      )
    }

    expect(batchJob.status).toBe("completed")

    exportFilePath = path.resolve(__dirname, batchJob.result.file_key)
    const isFileExists = (await fs.stat(exportFilePath)).isFile()

    expect(isFileExists).toBeTruthy()

    const data = (await fs.readFile(exportFilePath)).toString()
    const [, ...lines] = data.split("\r\n").filter((l) => l)

    expect(lines.length).toBe(4)

    const csvLine = lines[0].split(";")
    expect(csvLine[0]).toBe("test-product")
  })

  it("should be able to import an exported csv file", async () => {
    const api = useApi()

    const batchPayload = {
      type: "product-export",
      context: {
        batch_size: 1,
        filterable_fields: { collection_id: "test-collection" },
        order: "created_at",
      },
    }

    const batchJobRes = await api.post(
      "/admin/batch-jobs",
      batchPayload,
      adminReqConfig
    )
    let batchJobId = batchJobRes.data.batch_job.id

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
      shouldContinuePulling = !(
        batchJob.status === "completed" || batchJob.status === "failed"
      )
    }

    expect(batchJob.status).toBe("completed")

    exportFilePath = path.resolve(__dirname, batchJob.result.file_key)
    const isFileExists = (await fs.stat(exportFilePath)).isFile()

    expect(isFileExists).toBeTruthy()

    const data = (await fs.readFile(exportFilePath)).toString()
    const [header, ...lines] = data.split("\r\n").filter((l) => l)

    expect(lines.length).toBe(4)

    const csvLine = lines[0].split(";")
    expect(csvLine[0]).toBe("test-product")
    expect(csvLine[2]).toBe("Test product")

    csvLine[2] = "Updated test product"
    lines.splice(0, 1, csvLine.join(";"))

    await fs.writeFile(exportFilePath, [header, ...lines].join("\r\n"))

    const importBatchJobRes = await api.post(
      "/admin/batch-jobs",
      {
        type: "product-import",
        context: {
          fileKey: exportFilePath,
        },
      },
      adminReqConfig
    )

    batchJobId = importBatchJobRes.data.batch_job.id

    expect(batchJobId).toBeTruthy()

    shouldContinuePulling = true
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
    expect(productsResponse.data.count).toBe(5)
    expect(productsResponse.data.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: csvLine[0],
          handle: csvLine[1],
          title: csvLine[2],
        }),
      ])
    )
  })
})
