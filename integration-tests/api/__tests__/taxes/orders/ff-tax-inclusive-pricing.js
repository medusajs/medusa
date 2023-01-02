const path = require("path")

const { useApi } = require("../../../../helpers/use-api")
const { useDb } = require("../../../../helpers/use-db")

const startServerWithEnvironment =
  require("../../../../helpers/start-server-with-environment").default

const {
  simpleOrderFactory,
  simpleProductFactory,
} = require("../../../factories")

jest.setTimeout(30000)

describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING]: Order Taxes", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
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

  afterEach(async () => {
    const db = useDb()
    return await db.teardown()
  })

  test("calculates taxes w. tax inclusive shipping method price", async () => {
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

    const order = await simpleOrderFactory(
      dbConnection,
      {
        email: "test@testson.com",
        tax_rate: null,
        region: {
          id: "test-region",
          name: "Test region",
          tax_rate: null,
        },
        shipping_methods: [
          {
            price: 110,
            includes_tax: true,
            shipping_option: {
              region_id: "test-region",
            },
            tax_lines: [
              {
                rate: 10,
                name: "default",
                code: "default",
              },
            ],
          },
        ],
        line_items: [
          {
            variant_id: "test-variant",
            unit_price: 1000,
            tax_lines: [
              {
                rate: 20,
                name: "default",
                code: "default",
              },
            ],
          },
        ],
      },
      100
    )

    const api = useApi()

    const response = await api.get(`/store/orders/${order.id}`)
    expect(response.status).toEqual(200)
    expect(response.data.order.tax_total).toEqual(210)
    expect(response.data.order.total).toEqual(1310)
  })
})
