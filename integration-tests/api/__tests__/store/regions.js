const path = require("path")
const {
  Region,
  ReturnReason,
  Order,
  Customer,
  ShippingProfile,
  Product,
  ProductVariant,
  ShippingOption,
  FulfillmentProvider,
  LineItem,
  Discount,
  DiscountRule,
} = require("@medusajs/medusa")

const setupServer = require("../../../environment-helpers/setup-server")
const { useApi } = require("../../../environment-helpers/use-api")
const { initDb, useDb } = require("../../../environment-helpers/use-db")

jest.setTimeout(30000)

describe("/store/carts", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd, verbose: true })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("GET /store/regions", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager

      await manager.insert(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      })
      await manager.insert(Region, {
        id: "region-1",
        name: "Test Region 1",
        currency_code: "usd",
        tax_rate: 0,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should list the store regions with pagination", async () => {
      const api = useApi()

      const response = await api.get("/store/regions?limit=1&offset=1")

      expect(response.status).toEqual(200)

      expect(response.data.regions.length).toEqual(1)
      expect(response.data.count).toEqual(2)
      expect(response.data.offset).toEqual(1)
      expect(response.data.limit).toEqual(1)
    })

    it("should list the store regions with expand relations", async () => {
      const api = useApi()

      const response = await api.get(
        "/store/regions?limit=1&offset=1&expand=currency"
      )

      expect(response.status).toEqual(200)

      expect(response.data.regions[0].currency).toEqual(
        expect.objectContaining({
          code: "usd",
        })
      )
    })
  })

  describe("GET /store/regions/:id", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager

      await manager.insert(Region, {
        id: "region-id",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should retrieve the region from ID", async () => {
      const api = useApi()

      const response = await api.get(`/store/regions/region-id?expand=currency`)

      expect(response.status).toEqual(200)

      expect(response.data.region).toEqual(
        expect.objectContaining({
          id: "region-id",
          currency: expect.objectContaining({
            code: "usd",
          }),
        })
      )
    })

    it("should throw an error when region ID is invalid", async () => {
      const api = useApi()

      const error = await api
        .get(`/store/regions/invalid-region-id`)
        .catch((e) => e)

      expect(error.response.status).toEqual(404)

      expect(error.response.data).toEqual({
        type: "not_found",
        message: "Region with invalid-region-id was not found",
      })
    })
  })
})
