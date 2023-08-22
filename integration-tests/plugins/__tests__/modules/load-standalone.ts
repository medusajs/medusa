import dbFactory from "./../../../environment-helpers/use-template-db"

jest.setTimeout(30000)

describe("Standalone Modules", () => {
  beforeAll(async () => {
    const DB_HOST = process.env.DB_HOST
    const DB_USERNAME = process.env.DB_USERNAME
    const DB_PASSWORD = process.env.DB_PASSWORD
    const DB_NAME = process.env.DB_TEMP_NAME

    process.env.POSTGRES_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
    await dbFactory.createFromTemplate(DB_NAME)
  })

  afterAll(async () => {
    process.env.POSTGRES_URL = undefined
  })

  it("Should migrate database and initialize Product module using connection string from environment variable ", async function () {
    const { initialize, runMigrations } = require("@medusajs/product")
    await runMigrations()

    const product = await initialize()
    const productList = await product.list()

    expect(productList).toEqual(expect.arrayContaining([]))
  })
})
