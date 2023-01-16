const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const {
  simpleProductTaxRateFactory,
  simpleCartFactory,
  simpleRegionFactory,
  simpleProductFactory,
} = require("../../factories")

jest.setTimeout(30000)

describe("Manual Cart Taxes", () => {
  let medusaProcess
  let dbConnection

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

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

  afterEach(async () => {
    return await doAfterEach()
  })

  test("manual taxes; default tax rate", async () => {
    await simpleProductFactory(
      dbConnection,
      {
        id: "test-product",
        variants: [
          {
            id: "test-variant",
          },
        ],
      },
      100
    )

    await simpleCartFactory(
      dbConnection,
      {
        id: "test-cart",
        region: {
          id: "test-region",
          name: "Test region",
          tax_rate: 12,
          automatic_taxes: false,
        },
        line_items: [
          {
            variant_id: "test-variant",
            unit_price: 100,
          },
        ],
      },
      100
    )

    const api = useApi()

    const response = await api.get("/store/carts/test-cart")
    expect(response.status).toEqual(200)
    expect(response.data.cart.tax_total).toEqual(0)
    expect(response.data.cart.total).toEqual(100)
  })

  test("manual taxes; always forces taxes for payment sessions", async () => {
    await simpleProductFactory(
      dbConnection,
      {
        id: "test-product",
        variants: [
          {
            id: "test-variant",
          },
        ],
      },
      100
    )

    await simpleCartFactory(
      dbConnection,
      {
        id: "test-cart",
        region: {
          id: "test-region",
          name: "Test region",
          tax_rate: 12,
          automatic_taxes: false,
        },
        line_items: [
          {
            variant_id: "test-variant",
            unit_price: 100,
          },
        ],
      },
      100
    )

    const api = useApi()

    const response = await api.post("/store/carts/test-cart/payment-sessions")
    expect(response.status).toEqual(200)
    const [paySession] = response.data.cart.payment_sessions
    expect(paySession.data.tax_total).toEqual(12)
    expect(paySession.data.total).toEqual(112)
  })

  test("manual tax calculation w. multiple tax rate overrides", async () => {
    const product1 = await simpleProductFactory(
      dbConnection,
      {
        variants: [
          {
            id: "test-variant",
          },
        ],
      },
      100
    )

    const product2 = await simpleProductFactory(
      dbConnection,
      {
        variants: [
          {
            id: "test-variant-2",
          },
        ],
      },
      100
    )

    const region = await simpleRegionFactory(dbConnection, {
      name: "Test region",
      tax_rate: 12,
    })

    await simpleProductTaxRateFactory(dbConnection, {
      product_id: product1.id,
      rate: {
        region_id: region.id,
        rate: 25,
      },
    })

    await simpleProductTaxRateFactory(dbConnection, {
      product_id: product2.id,
      rate: {
        region_id: region.id,
        rate: 20,
      },
    })

    const cart = await simpleCartFactory(
      dbConnection,
      {
        region: region.id,
        line_items: [
          {
            variant_id: "test-variant",
            unit_price: 100,
          },
          {
            variant_id: "test-variant-2",
            unit_price: 50,
          },
        ],
      },
      100
    )

    const api = useApi()

    const response = await api.post(`/store/carts/${cart.id}/taxes`)

    expect(response.status).toEqual(200)
    expect(response.data.cart.tax_total).toEqual(35)
    expect(response.data.cart.total).toEqual(185)
  })
})
