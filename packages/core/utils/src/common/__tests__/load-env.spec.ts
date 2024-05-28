import { join } from "node:path"
import { writeFile, rm, mkdir } from "node:fs/promises"
import { loadEnv } from "../load-env"

const filesystem = {
  tmpFolder: join(__dirname, "tmp"),
  setup() {
    return mkdir(this.tmpFolder, { recursive: true })
  },
  teardown() {
    return rm(this.tmpFolder, { recursive: true })
  },
  create(filePath: string, contents: string) {
    return writeFile(join(this.tmpFolder, filePath), contents)
  },
}

describe("loadEnv", function () {
  beforeEach(async () => {
    await filesystem.setup()
  })

  afterEach(async () => {
    await filesystem.teardown()
    delete process.env.MEDUSA_VERSION
    delete process.env.MEDUSA_DEV_VERSION
    delete process.env.MEDUSA_TEST_VERSION
    delete process.env.MEDUSA_STAGING_VERSION
    delete process.env.MEDUSA_PRODUCTION_VERSION
  })

  it("should load .env file when in unknown environment", async function () {
    await filesystem.create(".env", "MEDUSA_VERSION=1.0")
    loadEnv("", filesystem.tmpFolder)

    expect(process.env.MEDUSA_VERSION).toEqual("1.0")
  })

  it("should load .env file for known environments", async function () {
    await filesystem.create(".env", "MEDUSA_DEV_VERSION=1.0")
    await filesystem.create(".env.test", "MEDUSA_TEST_VERSION=1.0")
    await filesystem.create(".env.staging", "MEDUSA_STAGING_VERSION=1.0")
    await filesystem.create(".env.production", "MEDUSA_PRODUCTION_VERSION=1.0")

    loadEnv("development", filesystem.tmpFolder)
    loadEnv("test", filesystem.tmpFolder)
    loadEnv("staging", filesystem.tmpFolder)
    loadEnv("production", filesystem.tmpFolder)

    expect(process.env.MEDUSA_DEV_VERSION).toEqual("1.0")
    expect(process.env.MEDUSA_TEST_VERSION).toEqual("1.0")
    expect(process.env.MEDUSA_STAGING_VERSION).toEqual("1.0")
    expect(process.env.MEDUSA_PRODUCTION_VERSION).toEqual("1.0")
  })
})
