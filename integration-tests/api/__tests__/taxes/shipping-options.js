const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { useDb, initDb } = require("../../../helpers/use-db")
const {
  simpleRegionFactory,
  simpleProductFactory,
  simpleShippingTaxRateFactory,
  simpleShippingOptionFactory,
} = require("../../factories")

const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("Shipping Options Totals Calculations", () => {
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

  beforeEach(async () => {
    await adminSeeder(dbConnection)
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("admin gets correct shipping prices", async () => {
    const api = useApi()

    const region = await simpleRegionFactory(dbConnection, {
      tax_rate: 25,
    })
    const so = await simpleShippingOptionFactory(dbConnection, {
      region_id: region.id,
      price: 100,
    })
    await simpleShippingTaxRateFactory(dbConnection, {
      shipping_option_id: so.id,
      rate: {
        region_id: region.id,
        rate: 10,
      },
    })

    const res = await api.get(`/admin/shipping-options`, {
      headers: {
        Authorization: `Bearer test_token`,
      },
    })

    expect(res.data.shipping_options).toHaveLength(1)
    expect(res.data.shipping_options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: so.id,
          amount: 100,
          price_incl_tax: 110,
        }),
      ])
    )
  })

  it("gets correct shipping prices", async () => {
    const api = useApi()

    const region = await simpleRegionFactory(dbConnection, {
      tax_rate: 25,
    })
    const so = await simpleShippingOptionFactory(dbConnection, {
      region_id: region.id,
      price: 100,
    })
    await simpleShippingTaxRateFactory(dbConnection, {
      shipping_option_id: so.id,
      rate: {
        region_id: region.id,
        rate: 10,
      },
    })

    const res = await api.get(`/store/shipping-options?region_id=${region.id}`)

    expect(res.data.shipping_options).toHaveLength(1)
    expect(res.data.shipping_options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: so.id,
          amount: 100,
          price_incl_tax: 110,
        }),
      ])
    )
  })
})
