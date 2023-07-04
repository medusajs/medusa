const path = require("path")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")

const { simpleProductFactory, simpleOrderFactory } = require("../../factories")
const adminSeeder = require("../../helpers/admin-seeder")

const createReturnableOrder = async (dbConnection, options) => {
  await simpleProductFactory(
    dbConnection,
    {
      id: "test-product",
      variants: [{ id: "test-variant" }],
    },
    100
  )

  let discounts = []

  if (options?.discount) {
    discounts = [
      {
        code: "TESTCODE",
      },
    ]
  }

  let unitPrice = options.includes_tax ? 1200 : 1000
  if (options.oldTaxes) {
    unitPrice = options.includes_tax ? 1125 : 1000
  }

  return await simpleOrderFactory(dbConnection, {
    email: "test@testson.com",
    tax_rate: options?.oldTaxes ? undefined : null,
    region: {
      id: "test-region",
      name: "Test region",
      tax_rate: 12.5,
    },
    discounts,
    line_items: [
      {
        id: "test-item",
        variant_id: "test-variant",
        quantity: 2,
        fulfilled_quantity: options?.shipped ? 2 : undefined,
        shipped_quantity: options?.shipped ? 2 : undefined,
        unit_price: unitPrice,
        includes_tax: options?.includes_tax,
        tax_lines: [
          {
            name: "default",
            code: "default",
            rate: 20,
          },
        ],
      },
    ],
  })
}

jest.setTimeout(30000)

describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] /store/carts", () => {
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

  afterEach(async () => {
    const db = useDb()
    return await db.teardown()
  })

  it("creates a return with the old tax system and tax inclusive line", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection, {
      oldTaxes: true,
      includes_tax: true,
    })
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/return`,
      {
        items: [
          {
            item_id: "test-item",
            quantity: 1,
            note: "TOO SMALL",
          },
        ],
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)

    /*
     * Region has default tax rate 12.5 therefore refund amount should be
     * 1000 * 1.125 = 1125
     */
    expect(response.data.order.returns[0].refund_amount).toEqual(1125)
    expect(response.data.order.returns[0].items).toHaveLength(1)
    expect(response.data.order.returns[0].items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          item_id: "test-item",
          quantity: 1,
          note: "TOO SMALL",
        }),
      ])
    )
  })

  it("creates a return with the old tax system and tax exclusive line", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection, {
      oldTaxes: true,
      includes_tax: false,
    })
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/return`,
      {
        items: [
          {
            item_id: "test-item",
            quantity: 1,
            note: "TOO SMALL",
          },
        ],
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)

    /*
     * Region has default tax rate 12.5 therefore refund amount should be
     * 1000 * 1.125 = 1125
     */
    expect(response.data.order.returns[0].refund_amount).toEqual(1125)
    expect(response.data.order.returns[0].items).toHaveLength(1)
    expect(response.data.order.returns[0].items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          item_id: "test-item",
          quantity: 1,
          note: "TOO SMALL",
        }),
      ])
    )
  })

  it("creates a return with tax inclusive line", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection, {
      includes_tax: true,
    })
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/return`,
      {
        items: [
          {
            item_id: "test-item",
            quantity: 1,
            note: "TOO SMALL",
          },
        ],
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)

    /*
     * Region has a tax rate of 20% therefore refund amount should be
     * 1000 * 1.2 = 1200
     */
    expect(response.data.order.returns[0].refund_amount).toEqual(1200)
    expect(response.data.order.returns[0].items).toHaveLength(1)
    expect(response.data.order.returns[0].items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          item_id: "test-item",
          quantity: 1,
          note: "TOO SMALL",
        }),
      ])
    )
  })

  it("creates a return with tax exclusive line", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection, {
      includes_tax: false,
    })
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/return`,
      {
        items: [
          {
            item_id: "test-item",
            quantity: 1,
            note: "TOO SMALL",
          },
        ],
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)

    /*
     * Region has a tax rate of 20% therefore refund amount should be
     * 1000 * 1.2 = 1200
     */
    expect(response.data.order.returns[0].refund_amount).toEqual(1200)
    expect(response.data.order.returns[0].items).toHaveLength(1)
    expect(response.data.order.returns[0].items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          item_id: "test-item",
          quantity: 1,
          note: "TOO SMALL",
        }),
      ])
    )
  })
})
