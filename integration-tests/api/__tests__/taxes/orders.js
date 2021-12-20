const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const { simpleOrderFactory, simpleProductFactory } = require("../../factories")

jest.setTimeout(30000)

describe("Order Taxes", () => {
  let medusaProcess
  let dbConnection

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    try {
      dbConnection = await initDb({ cwd })
      medusaProcess = await setupServer({ cwd })
    } catch (error) {
      console.log(error)
    }
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  afterEach(async () => {
    return await doAfterEach()
  })

  test("can calculate taxes for legacy tax system", async () => {
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
        region: {
          id: "test-region",
          name: "Test region",
          tax_rate: 12.5,
        },
        line_items: [
          {
            variant_id: "test-variant",
            unit_price: 1000,
          },
        ],
      },
      100
    )

    const api = useApi()

    const response = await api.get(`/store/orders/${order.id}`)
    expect(response.status).toEqual(200)
    expect(response.data.order.tax_total).toEqual(125)
    expect(response.data.order.total).toEqual(1125)
  })

  test("calculates taxes correctly", async () => {
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
    expect(response.data.order.tax_total).toEqual(200)
    expect(response.data.order.total).toEqual(1200)
  })

  test("calculates taxes correctly w. shipping method", async () => {
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
            price: 1000,
            shipping_option: {
              region_id: "test-region",
            },
            tax_lines: [
              {
                rate: 10,
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
    expect(response.data.order.tax_total).toEqual(300)
    expect(response.data.order.total).toEqual(2300)
  })
})
