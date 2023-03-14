const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")

const {
  simpleOrderFactory,
  simpleShippingOptionFactory,
  simplePaymentFactory,
  simpleProductFactory,
} = require("../../factories")

describe("Claims", () => {
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

  test("creates a refund claim with custom refund amount", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/claims`,
      {
        type: "refund",
        refund_amount: 1000,
        claim_items: [
          {
            item_id: "test-item",
            reason: "missing_item",
            quantity: 1,
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
    expect(response.data.order.claims[0]).toEqual(
      expect.objectContaining({
        order_id: expect.any(String),
        refund_amount: 1000,
        claim_items: expect.arrayContaining([
          expect.objectContaining({
            item: expect.any(Object),
            item_id: "test-item",
            quantity: 1,
          }),
        ]),
      })
    )
  })

  test("creates a refund claim", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/claims`,
      {
        type: "refund",
        claim_items: [
          {
            item_id: "test-item",
            reason: "missing_item",
            quantity: 1,
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
    expect(response.data.order.claims[0]).toEqual(
      expect.objectContaining({
        order_id: expect.any(String),
        refund_amount: 1200,
        claim_items: expect.arrayContaining([
          expect.objectContaining({
            item: expect.any(Object),
            item_id: "test-item",
            quantity: 1,
          }),
        ]),
      })
    )
  })

  test("creates a refund claim + return", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/claims`,
      {
        type: "refund",
        claim_items: [
          {
            item_id: "test-item",
            reason: "missing_item",
            quantity: 1,
          },
        ],
        return_shipping: {
          price: 0,
        },
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    const claim = response.data.order.claims[0]
    const refund = response.data.order.refunds[0]
    const returnOrder = response.data.order.returns[0]

    expect(response.status).toEqual(200)
    expect(claim.refund_amount).toEqual(1200)
    expect(refund.amount).toEqual(1200)
    expect(returnOrder.refund_amount).toEqual(1200)
  })

  test("creates a refund claim + return with a custom amount", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/claims`,
      {
        type: "refund",
        refund_amount: 500,
        claim_items: [
          {
            item_id: "test-item",
            reason: "missing_item",
            quantity: 1,
          },
        ],
        return_shipping: {
          price: 0,
        },
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    const claim = response.data.order.claims[0]
    const refund = response.data.order.refunds[0]
    const returnOrder = response.data.order.returns[0]

    expect(response.status).toEqual(200)
    expect(claim.refund_amount).toEqual(500)
    expect(refund.amount).toEqual(500)
    expect(returnOrder.refund_amount).toEqual(500)
  })

  test("creates a replace claim", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/claims`,
      {
        type: "replace",
        additional_items: [{ variant_id: "test-variant", quantity: 1 }],
        claim_items: [
          {
            item_id: "test-item",
            reason: "missing_item",
            quantity: 1,
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
    expect(response.data.order.claims[0]).toEqual(
      expect.objectContaining({
        id: expect.stringMatching(/^claim_*/),
        order_id: expect.any(String),
        additional_items: expect.arrayContaining([
          expect.objectContaining({
            id: expect.stringMatching(/^item_*/),
            claim_order_id: expect.stringMatching(/^claim_*/),
            variant: expect.objectContaining({ id: "test-variant" }),
            tax_lines: expect.arrayContaining([
              expect.objectContaining({
                id: expect.stringMatching(/^litl_*/),
                item_id: expect.stringMatching(/^item_*/),
                rate: 12.5,
              }),
            ]),
          }),
        ]),
        claim_items: expect.arrayContaining([
          expect.objectContaining({
            item: expect.any(Object),
            item_id: "test-item",
            quantity: 1,
          }),
        ]),
      })
    )
  })

  test("creates a replace claim fulfillment", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
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
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    const response = await api.post(
      `/admin/orders/${order.id}/claims/${createRes.data.order.claims[0].id}/fulfillments`,
      {},
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)
  })

  test(" should throw and not have dangling claim order upon a claim creation without reasons on claim items", async () => {
    const api = useApi()

    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const option = await simpleShippingOptionFactory(dbConnection, {
      region_id: "test-region",
    })

    const err = await api
      .post(
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
              quantity: 1,
            },
          ],
        },
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )
      .catch((e) => e)

    const claimOrders = await dbConnection.manager.query(
      `SELECT *
       FROM claim_order
       WHERE order_id = '${order.id}'`
    )

    expect(err).toBeDefined()
    expect(err.response.status).toBe(400)
    expect(claimOrders).toEqual([])
  })
})

export const createReturnableOrder = async (dbConnection, options = {}) => {
  await simpleProductFactory(
    dbConnection,
    {
      id: "test-product",
      variants: [
        { id: "test-variant" },
        { id: "variant-2", prices: [{ currency: "usd", amount: 1000 }] },
      ],
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

  const order = await simpleOrderFactory(dbConnection, {
    email: "test@testson.com",
    tax_rate: null,
    fulfillment_status: "fulfilled",
    payment_status: "captured",
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
        fulfilled_quantity: 2,
        shipped_quantity: 2,
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

  await simplePaymentFactory(dbConnection, {
    provider_id: "test-pay",
    order: order.id,
    amount: 2400,
    captured: true,
  })

  return order
}
