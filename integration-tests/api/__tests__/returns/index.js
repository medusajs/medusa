const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")

const {
  simpleOrderFactory,
  simpleProductFactory,
  simpleShippingOptionFactory,
  simpleRegionFactory,
} = require("../../factories")
const {
  simpleDiscountFactory,
} = require("../../factories/simple-discount-factory")

jest.setTimeout(30000)

describe("/admin/orders", () => {
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
    expect(
      response.data.order.returns[0].shipping_method.tax_lines
    ).toHaveLength(1)
    expect(response.data.order.returns[0].shipping_method.tax_lines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rate: 12.5,
          name: "default",
          code: "default",
        }),
      ])
    )
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

  test("creates a return w. fixed discount on the total and return the total with the right precision", async () => {
    await adminSeeder(dbConnection)

    const variant1Price = 4452600
    const product1 = await simpleProductFactory(dbConnection, {
      variants: [
        {
          id: "test-variant",
          prices: [
            {
              amount: variant1Price,
              currency: "usd",
              variant_id: "test-variant",
            },
          ],
        },
      ],
    })

    const variant2Price = 482200
    const product2 = await simpleProductFactory(dbConnection, {
      variants: [
        {
          id: "test-variant-2",
          prices: [
            {
              amount: variant2Price,
              currency: "usd",
              variant_id: "test-variant-2",
            },
          ],
        },
      ],
    })

    const region = await simpleRegionFactory(dbConnection, {
      id: "test-region",
      tax_rate: 12.5,
    })

    const discountAmount = 10000
    const discount = await simpleDiscountFactory(dbConnection, {
      id: "test-discount",
      code: "TEST-2",
      regions: [region.id],
      rule: {
        type: "fixed",
        value: discountAmount,
        allocation: "total",
      },
    })

    const item1Id = "test-item"
    const item2Id = "test-item-2"

    const order = await simpleOrderFactory(dbConnection, {
      email: "test@testson.com",
      region: region.id,
      currency_code: "usd",
      line_items: [
        {
          id: item1Id,
          variant_id: product1.variants[0].id,
          quantity: 2,
          fulfilled_quantity: 2,
          shipped_quantity: 2,
          unit_price: variant1Price,
          adjustments: [
            {
              amount: 9023,
              discount_code: discount.code,
              description: "discount",
              item_id: "test-item",
            },
          ],
          tax_lines: [
            {
              name: "default",
              code: "default",
              rate: 20,
            },
          ],
        },
        {
          id: item2Id,
          variant_id: product2.variants[0].id,
          quantity: 2,
          fulfilled_quantity: 2,
          shipped_quantity: 2,
          unit_price: variant2Price,
          adjustments: [
            {
              amount: 977,
              discount_code: discount.code,
              description: "discount",
              item_id: "test-item",
            },
          ],
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

    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/return`,
      {
        items: [
          {
            item_id: item1Id,
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
     * total item 1 amount (4452600 * 2 - 9023) * 1.2 = 10675412
     * therefore refund amount should be (4452600 - 9023 / 2) * 1.2 = 5337706
     * therefore if the second item gets refunded 5337706.2 * 2 = 10675412 which is the expected total amount
     */
    expect(response.data.order.returns[0].refund_amount).toEqual(5337706)

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

  test("receives a return with a claimed line item", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection, { shipped: true })
    const option = await simpleShippingOptionFactory(dbConnection, {
      region_id: "test-region",
    })
    const api = useApi()

    const createRes = await api.post(
      `/admin/orders/${order.id}/claims`,
      {
        type: "replace",
        shipping_methods: [
          {
            option_id: option.id,
            price: 0,
          },
        ],
        additional_items: [{ variant_id: "test-variant", quantity: 1 }],
        claim_items: [
          {
            item_id: "test-item",
            reason: "missing_item",
            quantity: 1,
          },
        ],
      },
      { headers: { authorization: "Bearer test_token" } }
    )

    const claimId = createRes.data.order.claims[0].id
    const claimLineItem = createRes.data.order.claims[0].additional_items[0]

    const claimFulfillmentCreatedResponse = await api.post(
      `/admin/orders/${order.id}/claims/${claimId}/fulfillments`,
      {},
      { headers: { authorization: "Bearer test_token" } }
    )

    const fulfillmentId =
      claimFulfillmentCreatedResponse.data.order.claims[0].fulfillments[0].id
    await api.post(
      `/admin/orders/${order.id}/claims/${claimId}/shipments`,
      { fulfillment_id: fulfillmentId },
      { headers: { authorization: "Bearer test_token" } }
    )

    const returnCreatedResponse = await api.post(
      `/admin/orders/${order.id}/return`,
      {
        items: [
          {
            item_id: claimLineItem.id,
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

    const returnOrder = returnCreatedResponse.data.order.returns[0]
    const returnId = returnOrder.id
    const returnReceivedResponse = await api.post(
      `/admin/returns/${returnId}/receive`,
      {
        items: returnOrder.items.map((i) => ({
          item_id: i.item_id,
          quantity: i.quantity,
        })),
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(returnReceivedResponse.status).toEqual(200)
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
        fulfilled_quantity: options.shipped ? 2 : undefined,
        shipped_quantity: options.shipped ? 2 : undefined,
        unit_price: 1000,
        adjustments: options.discount
          ? [
              {
                amount: 200,
                discount_code: "TESTCODE",
                description: "discount",
                item_id: "test-item",
              },
            ]
          : [],
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
