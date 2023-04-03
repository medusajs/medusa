const path = require("path")
const fs = require("fs/promises")
import { resolve, sep } from "path"

const setupServer = require("../../../../helpers/setup-server")
const { useApi } = require("../../../../helpers/use-api")
const { initDb, useDb } = require("../../../../helpers/use-db")

const adminSeeder = require("../../../helpers/admin-seeder")
const userSeeder = require("../../../helpers/user-seeder")
const orderSeeder = require("../../../helpers/order-seeder")

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

jest.setTimeout(1000000)

describe("Batchjob with type order-export", () => {
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
    await adminSeeder(dbConnection)
    await userSeeder(dbConnection)
    await orderSeeder(dbConnection)
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()

    const isFileExists = (await fs.stat(exportFilePath))?.isFile()

    if (isFileExists) {
      const [, relativeRoot] = exportFilePath.replace(__dirname, "").split(sep)

      if ((await fs.stat(resolve(__dirname, relativeRoot)))?.isDirectory()) {
        topDir = relativeRoot
      }

      await fs.unlink(exportFilePath)
    }
  })

  it("Should export a file containing all orders", async () => {
    jest.setTimeout(1000000)
    const api = useApi()

    const batchPayload = {
      type: "order-export",
      context: {},
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

      batchJob = res.data.batch_job
      shouldContinuePulling = !(
        batchJob.status === "completed" || batchJob.status === "failed"
      )

      if (shouldContinuePulling) {
        await new Promise((resolve, _) => {
          setTimeout(resolve, 1000)
        })
      }
    }

    expect(batchJob.status).toBe("completed")

    expect(batchJob.status).toBe("completed")

    exportFilePath = path.resolve(__dirname, batchJob.result.file_key)
    const isFileExists = (await fs.stat(exportFilePath)).isFile()

    expect(isFileExists).toBeTruthy()

    const fileSize = (await fs.stat(exportFilePath)).size
    expect(batchJob.result?.file_size).toBe(fileSize)

    const data = (await fs.readFile(exportFilePath)).toString()
    const [, ...lines] = data.split("\r\n").filter((l) => l)

    expect(lines.length).toBe(6)

    const csvLine = lines[0].split(";")

    expect(csvLine[0]).toBe("discount-order")
    expect(csvLine[1]).toBe("6")
    expect(csvLine[14]).toBe("fulfilled")
    expect(csvLine[15]).toBe("captured")
    expect(csvLine[16]).toBe("8000")
  })

  it("Should export a file containing a limited number of orders", async () => {
    jest.setTimeout(1000000)
    const api = useApi()

    const batchPayload = {
      type: "order-export",
      context: { batch_size: 3 },
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

      batchJob = res.data.batch_job
      shouldContinuePulling = !(
        batchJob.status === "completed" || batchJob.status === "failed"
      )

      if (shouldContinuePulling) {
        await new Promise((resolve, _) => {
          setTimeout(resolve, 1000)
        })
      }
    }

    exportFilePath = path.resolve(__dirname, batchJob.result.file_key)
    const isFileExists = (await fs.stat(exportFilePath)).isFile()

    expect(isFileExists).toBeTruthy()

    const data = (await fs.readFile(exportFilePath)).toString()
    const [, ...lines] = data.split("\r\n").filter((l) => l)

    expect(lines.length).toBe(3)
  })

  it("Should export a file with orders from a single customer", async () => {
    jest.setTimeout(1000000)
    const api = useApi()

    const batchPayload = {
      type: "order-export",
      context: { filterable_fields: { email: "test@email.com" } },
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

      batchJob = res.data.batch_job
      shouldContinuePulling = !(
        batchJob.status === "completed" || batchJob.status === "failed"
      )

      if (shouldContinuePulling) {
        await new Promise((resolve, _) => {
          setTimeout(resolve, 1000)
        })
      }
    }

    expect(batchJob.status).toBe("completed")

    exportFilePath = path.resolve(__dirname, batchJob.result.file_key)
    const isFileExists = (await fs.stat(exportFilePath)).isFile()

    expect(isFileExists).toBeTruthy()

    const data = (await fs.readFile(exportFilePath)).toString()
    const [, ...lines] = data.split("\r\n").filter((l) => l)

    expect(lines.length).toBe(1)

    const csvLine = lines[0].split(";")

    expect(csvLine[0]).toBe("test-order")
    expect(csvLine[6]).toBe("test@email.com")
  })
})
