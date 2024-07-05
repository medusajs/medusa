const path = require("path")
const setupServer = require("../../../environment-helpers/setup-server")
const startServerWithEnvironment =
  require("../../../environment-helpers/start-server-with-environment").default
const { useApi } = require("../../../environment-helpers/use-api")
const { useDb, initDb } = require("../../../environment-helpers/use-db")
const adminSeeder = require("../../../helpers/admin-seeder")

const adminReqConfig = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

jest.setTimeout(30000)
describe("/admin/currencies", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/currencies", function () {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
      } catch (e) {
        console.error(e)
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should retrieve the currencies", async () => {
      const api = useApi()
      const response = await api.get(
        `/admin/currencies?order=code`,
        adminReqConfig
      )

      expect(response.data).toMatchSnapshot()
    })

    it("should retrieve the currencies filtered with q param", async () => {
      const api = useApi()
      const response = await api.get(
        `/admin/currencies?q=us&order=code`,
        adminReqConfig
      )

      const { currencies } = response.data

      expect(currencies).toEqual([
        expect.objectContaining({
          code: "aud",
          name: "Australian Dollar",
        }),
        expect.objectContaining({
          code: "byn",
          name: "Belarusian Ruble",
        }),
        expect.objectContaining({
          code: "rub",
          name: "Russian Ruble",
        }),
        expect.objectContaining({
          code: "usd",
          name: "US Dollar",
        }),
      ])
    })
  })
})
describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] /admin/currencies", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_TAX_INCLUSIVE_PRICING: true },
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/currencies", function () {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
      } catch (e) {
        console.error(e)
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should retrieve the currencies", async () => {
      const api = useApi()
      const response = await api.get(
        `/admin/currencies?order=code`,
        adminReqConfig
      )

      expect(response.data).toMatchSnapshot()
    })
  })

  describe("POST /admin/currencies/:code", function () {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
      } catch (e) {
        console.error(e)
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should update currency includes_tax", async () => {
      const api = useApi()
      const response = await api.post(
        `/admin/currencies/aed`,
        {
          includes_tax: true,
        },
        adminReqConfig
      )

      expect(response.data).toMatchSnapshot()
    })
  })
})
