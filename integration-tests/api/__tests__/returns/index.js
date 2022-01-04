const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")

const {
  simpleOrderFactory,
  simpleProductFactory,
  simpleShippingOptionFactory,
} = require("../../factories")

describe("/admin/orders", () => {
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

  test("creates a return w. old tax system", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection, { oldTaxes: true })
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
    expect(response.data.order.returns[0].items).toEqual([
      expect.objectContaining({
        item_id: "test-item",
        quantity: 1,
        note: "TOO SMALL",
      }),
    ])
  })

  test("creates a return w. new tax system", async () => {
    await adminSeeder(dbConnection)
    const order = await createReturnableOrder(dbConnection, { oldTaxes: false })

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
     * Region has default tax rate 12.5 but line item has tax rate 20
     * therefore refund amount should be 1000 * 1.2 = 1200
     */
    expect(response.data.order.returns[0].refund_amount).toEqual(1200)

    expect(response.data.order.returns[0].items).toEqual([
      expect.objectContaining({
        item_id: "test-item",
        quantity: 1,
        note: "TOO SMALL",
      }),
    ])
  })

  test("creates a return w. new tax system + shipping", async () => {
    await adminSeeder(dbConnection)
    const order = await createReturnableOrder(dbConnection, { oldTaxes: false })
    const returnOption = await simpleShippingOptionFactory(dbConnection, {
      name: "Return method",
      region_id: "test-region",
      is_return: true,
      price: 1000,
    })

    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/return`,
      {
        return_shipping: {
          option_id: returnOption.id,
        },
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
     * Region has default tax rate 12.5 but line item has tax rate 20
     * therefore refund amount should be 1000 * 1.2 = 1200
     * shipping method will have 12.5 rate 1000 * 1.125 = 1125
     */
    expect(response.data.order.returns[0].refund_amount).toEqual(75)
    expect(response.data.order.returns[0].shipping_method.tax_lines).toEqual([
      expect.objectContaining({
        rate: 12.5,
        name: "default",
        code: "default",
      }),
    ])
    expect(response.data.order.returns[0].items).toEqual([
      expect.objectContaining({
        item_id: "test-item",
        quantity: 1,
        note: "TOO SMALL",
      }),
    ])
  })

  test("creates a return w. discount", async () => {
    await adminSeeder(dbConnection)
    const order = await createReturnableOrder(dbConnection, {
      discount: true,
      oldTaxes: false,
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
     * Region has default tax rate 12.5 but line item has tax rate 20
     * therefore refund amount should be 1000 - 100 * 1.2 = 1080
     */
    expect(response.data.order.returns[0].refund_amount).toEqual(1080)

    expect(response.data.order.returns[0].items).toEqual([
      expect.objectContaining({
        item_id: "test-item",
        quantity: 1,
        note: "TOO SMALL",
      }),
    ])
  })
})

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

  if (options.discount) {
    discounts = [
      {
        code: "TESTCODE",
      },
    ]
  }

  return await simpleOrderFactory(dbConnection, {
    email: "test@testson.com",
    tax_rate: options.oldTaxes ? undefined : null,
    region: {
      id: "test-region",
      name: "Test region",
      tax_rate: 12.5, // Should be ignored due to item tax line
    },
    discounts,
    line_items: [
      {
        id: "test-item",
        variant_id: "test-variant",
        quantity: 2,
        unit_price: 1000,
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
