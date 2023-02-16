const path = require("path")

const { bootstrapApp } = require("../../../helpers/bootstrap-app")
const { initDb, useDb } = require("../../../helpers/use-db")
const { setPort, useApi } = require("../../../helpers/use-api")

const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(50000)

const {
  simpleOrderFactory,
  simpleStoreFactory,
  simpleProductFactory,
  simpleShippingOptionFactory,
} = require("../../factories")

describe("medusa-plugin-sendgrid", () => {
  let appContainer
  let dbConnection
  let express

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    const { container, app, port } = await bootstrapApp({ cwd })
    appContainer = container

    setPort(port)
    express = app.listen(port, (err) => {
      process.send(port)
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    express.close()
  })

  afterEach(async () => {
    return await doAfterEach()
  })

  test("order canceled data", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection, {
      notShipped: true,
    })
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/cancel`,
      {},
      { headers: { authorization: "Bearer test_token" } }
    )
    expect(response.status).toEqual(200)

    const sendgridService = appContainer.resolve("sendgridService")
    const data = await sendgridService.fetchData("order.canceled", {
      id: order.id,
    })

    expect(data).toMatchSnapshot({
      date: expect.any(String),
      id: expect.any(String),
      display_id: expect.any(Number),
      sales_channel_id: null,
      created_at: expect.any(Date),
      canceled_at: expect.any(Date),
      updated_at: expect.any(Date),
      customer_id: expect.any(String),
      customer: {
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
      shipping_methods: [
        {
          id: expect.any(String),
          shipping_option_id: expect.any(String),
          order_id: expect.any(String),
          shipping_option: {
            id: expect.any(String),
            profile_id: expect.any(String),
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
          },
        },
      ],
      shipping_address_id: expect.any(String),
      shipping_address: {
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
      items: [
        {
          adjustments: [],
          created_at: expect.any(Date),
          order_edit_id: null,
          original_item_id: null,
          updated_at: expect.any(Date),
          order_id: expect.any(String),
          tax_lines: [
            {
              id: expect.any(String),
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
            },
          ],
          variant: {
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            product: {
              profile_id: expect.any(String),
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
            },
          },
        },
      ],
      region: {
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
    })
  })

  test("order shipment created data", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection, {
      notShipped: true,
    })
    const api = useApi()

    const { data: fulfillmentData } = await api.post(
      `/admin/orders/${order.id}/fulfillment`,
      { items: [{ item_id: "test-item", quantity: 2 }] },
      { headers: { authorization: "Bearer test_token" } }
    )

    const fulfillment = fulfillmentData.order.fulfillments[0]

    const response = await api.post(
      `/admin/orders/${order.id}/shipment`,
      { fulfillment_id: fulfillment.id },
      { headers: { authorization: "Bearer test_token" } }
    )

    expect(response.status).toEqual(200)

    const sendgridService = appContainer.resolve("sendgridService")
    const data = await sendgridService.fetchData("order.shipment_created", {
      id: order.id,
      fulfillment_id: fulfillment.id,
    })

    expect(data).toMatchSnapshot({
      date: expect.any(String),
      fulfillment: {
        id: expect.any(String),
        order_id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        shipped_at: expect.any(Date),
        items: [
          {
            fulfillment_id: expect.any(String),
          },
        ],
      },
      order: {
        display_id: expect.any(Number),
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        customer_id: expect.any(String),
        customer: {
          id: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        },

        fulfillments: [
          {
            id: expect.any(String),
            order_id: expect.any(String),
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            shipped_at: expect.any(Date),
            items: [
              {
                fulfillment_id: expect.any(String),
              },
            ],
          },
        ],
        shipping_methods: [
          {
            id: expect.any(String),
            shipping_option_id: expect.any(String),
            order_id: expect.any(String),
            shipping_option: {
              id: expect.any(String),
              profile_id: expect.any(String),
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
            },
          },
        ],
        shipping_address_id: expect.any(String),
        shipping_address: {
          id: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        },
        items: [
          {
            adjustments: [],
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            order_edit_id: null,
            original_item_id: null,
            order_id: expect.any(String),
            tax_lines: [
              {
                id: expect.any(String),
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
              },
            ],
            variant: {
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
              product: {
                profile_id: expect.any(String),
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
              },
            },
          },
        ],
        region: {
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        },
      },
    })
  })

  test("order placed data", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const sendgridService = appContainer.resolve("sendgridService")
    const data = await sendgridService.fetchData("order.placed", {
      id: order.id,
    })

    expect(data).toMatchSnapshot({
      date: expect.any(String),
      id: expect.any(String),
      display_id: expect.any(Number),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      customer_id: expect.any(String),
      customer: {
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
      shipping_address_id: expect.any(String),
      shipping_address: {
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
      items: [
        {
          adjustments: [],
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          order_id: expect.any(String),
          order_edit_id: null,
          original_item_id: null,
          tax_lines: [
            {
              id: expect.any(String),
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
            },
          ],
          variant: {
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            product: {
              profile_id: expect.any(String),
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
            },
          },
          totals: {
            tax_lines: [
              {
                id: expect.any(String),
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
              },
            ],
          },
        },
      ],
      region: {
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
    })
  })

  test("swap received data", async () => {
    await simpleStoreFactory(dbConnection)
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/swaps`,
      {
        additional_items: [{ variant_id: "variant-2", quantity: 1 }],
        return_items: [{ item_id: "test-item", quantity: 1 }],
      },
      { headers: { authorization: "Bearer test_token" } }
    )

    expect(response.status).toEqual(200)

    const swap = response.data.order.swaps[0]
    const returnOrder = swap.return_order
    await api.post(
      `/admin/returns/${returnOrder.id}/receive`,
      {
        items: returnOrder.items.map((i) => ({
          item_id: i.item_id,
          quantity: i.quantity,
        })),
      },
      { headers: { authorization: "Bearer test_token" } }
    )

    const sendgridService = appContainer.resolve("sendgridService")
    const data = await sendgridService.fetchData("swap.received", {
      id: swap.id,
      order_id: order.id,
    })

    expect(data.return_total).toMatchSnapshot()
    expect(data.refund_amount).toMatchSnapshot()
    expect(data.additional_total).toMatchSnapshot()
  })

  test("items returned data", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/return`,
      {
        items: [{ item_id: "test-item", quantity: 1 }],
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)

    const returnOrder = response.data.order.returns[0]
    const returnId = returnOrder.id
    await api.post(
      `/admin/returns/${returnId}/receive`,
      {
        items: returnOrder.items.map((i) => ({
          item_id: i.item_id,
          quantity: i.quantity,
        })),
      },
      { headers: { authorization: "Bearer test_token" } }
    )

    const sendgridService = appContainer.resolve("sendgridService")
    const data = await sendgridService.fetchData("order.items_returned", {
      id: order.id,
      return_id: returnId,
    })

    const returnSnap = getReturnSnap(true)
    expect(data).toMatchSnapshot(returnSnap)
  })

  test("claim shipment created data", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const shippingOut = await simpleShippingOptionFactory(dbConnection, {
      region_id: "test-region",
      price: 500,
    })
    const api = useApi()
    const response = await api.post(
      `/admin/orders/${order.id}/claims`,
      {
        type: "replace",
        additional_items: [{ variant_id: "variant-2", quantity: 1 }],
        shipping_methods: [
          {
            option_id: shippingOut.id,
            price: 0,
          },
        ],
        claim_items: [
          { reason: "missing_item", item_id: "test-item", quantity: 1 },
        ],
      },
      { headers: { authorization: "Bearer test_token" } }
    )

    expect(response.status).toEqual(200)

    const claimId = response.data.order.claims[0].id

    const { data: fulfillmentData } = await api.post(
      `/admin/orders/${order.id}/claims/${claimId}/fulfillments`,
      {},
      { headers: { authorization: "Bearer test_token" } }
    )

    const fulfillmentId = fulfillmentData.order.claims[0].fulfillments[0].id
    await api.post(
      `/admin/orders/${order.id}/claims/${claimId}/shipments`,
      { fulfillment_id: fulfillmentId },
      { headers: { authorization: "Bearer test_token" } }
    )

    const sendgridService = appContainer.resolve("sendgridService")
    const data = await sendgridService.fetchData("claim.shipment_created", {
      id: claimId,
      fulfillment_id: fulfillmentId,
    })

    const orderSnap = {
      id: expect.any(String),
      display_id: expect.any(Number),
      customer_id: expect.any(String),
      shipping_address_id: expect.any(String),
      shipping_address: {
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      items: [
        {
          id: expect.any(String),
          order_id: expect.any(String),
          order_edit_id: null,
          original_item_id: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          variant: {
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            product: {
              profile_id: expect.any(String),
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
            },
          },
        },
      ],
    }

    expect(data).toMatchSnapshot({
      claim: {
        id: expect.any(String),
        order_id: expect.any(String),
        shipping_address_id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        idempotency_key: expect.any(String),
        order: orderSnap,
      },
      fulfillment: {
        id: expect.any(String),
        claim_order_id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        shipped_at: expect.any(Date),
        items: [
          {
            fulfillment_id: expect.any(String),
            item_id: expect.any(String),
          },
        ],
      },
      order: orderSnap,
    })
  })

  test("swap shipment created data", async () => {
    await simpleStoreFactory(dbConnection)
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const shippingOut = await simpleShippingOptionFactory(dbConnection, {
      region_id: "test-region",
      price: 500,
    })
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/swaps`,
      {
        additional_items: [{ variant_id: "variant-2", quantity: 1 }],
        return_items: [{ item_id: "test-item", quantity: 1 }],
      },
      { headers: { authorization: "Bearer test_token" } }
    )

    expect(response.status).toEqual(200)

    const swapId = response.data.order.swaps[0].id
    const cartId = response.data.order.swaps[0].cart_id

    await api.post(`/store/carts/${cartId}`, {
      shipping_address: {
        address_1: "121 W Something St",
        postal_code: "1234",
        province: "something",
        city: "ville la something",
        phone: "12353245",
      },
    })

    await api.post(`/store/carts/${cartId}/shipping-methods`, {
      option_id: shippingOut.id,
    })

    await api.post(`/store/carts/${cartId}/payment-sessions`)
    await api.post(`/store/carts/${cartId}/complete`)

    const { data: fulfillmentData } = await api.post(
      `/admin/orders/${order.id}/swaps/${swapId}/fulfillments`,
      {},
      { headers: { authorization: "Bearer test_token" } }
    )

    const fulfillmentId = fulfillmentData.order.swaps[0].fulfillments[0].id
    await api.post(
      `/admin/orders/${order.id}/swaps/${swapId}/shipments`,
      { fulfillment_id: fulfillmentId },
      { headers: { authorization: "Bearer test_token" } }
    )

    const sendgridService = appContainer.resolve("sendgridService")
    const data = await sendgridService.fetchData("swap.shipment_created", {
      id: swapId,
      fulfillment_id: fulfillmentId,
    })

    const itemSnap = {
      id: expect.any(String),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      order_edit_id: null,
      original_item_id: null,
      variant: {
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        product: {
          profile_id: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        },
      },
      tax_lines: [
        {
          id: expect.any(String),
          item_id: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        },
      ],
    }

    const swapSnap = {
      id: expect.any(String),
      cart_id: expect.any(String),
      order_id: expect.any(String),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      confirmed_at: expect.any(Date),
      idempotency_key: expect.any(String),
      shipping_address_id: expect.any(String),
      additional_items: [
        {
          swap_id: expect.any(String),
          cart_id: expect.any(String),
          ...itemSnap,
        },
      ],
    }

    expect(data).toMatchSnapshot({
      date: expect.any(String),
      swap: {
        ...swapSnap,
        shipping_address: {
          id: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        },
        shipping_methods: [
          {
            id: expect.any(String),
            cart_id: expect.any(String),
            swap_id: expect.any(String),
            shipping_option: {
              id: expect.any(String),
              profile_id: expect.any(String),
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
            },
            shipping_option_id: expect.any(String),
            tax_lines: [
              {
                id: expect.any(String),
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
                shipping_method_id: expect.any(String),
              },
            ],
          },
        ],
        return_order: {
          id: expect.any(String),
          swap_id: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          items: [
            {
              return_id: expect.any(String),
            },
          ],
        },
      },
      fulfillment: {
        id: expect.any(String),
        created_at: expect.any(Date),
        shipped_at: expect.any(Date),
        updated_at: expect.any(Date),
        swap_id: expect.any(String),
        items: [
          {
            fulfillment_id: expect.any(String),
            item_id: expect.any(String),
          },
        ],
      },
      order: {
        display_id: expect.any(Number),
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        items: [{ order_id: expect.any(String), ...itemSnap }],
        customer_id: expect.any(String),
        shipping_address_id: expect.any(String),
        sales_channel_id: null,
        swaps: [swapSnap],
        region: {
          id: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        },
      },
      items: [
        {
          swap_id: expect.any(String),
          cart_id: expect.any(String),
          ...itemSnap,
        },
      ],
    })
  })

  test("return requested data", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/return`,
      {
        items: [{ item_id: "test-item", quantity: 1 }],
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)

    const sendgridService = appContainer.resolve("sendgridService")
    const data = await sendgridService.fetchData("order.return_requested", {
      id: response.data.order.id,
      return_id: response.data.order.returns[0].id,
    })
    const returnSnap = getReturnSnap()
    expect(data).toMatchSnapshot(returnSnap)
  })

  test("swap created data", async () => {
    await simpleStoreFactory(dbConnection)
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const api = useApi()
    const response = await api.post(
      `/admin/orders/${order.id}/swaps`,
      {
        additional_items: [{ variant_id: "variant-2", quantity: 1 }],
        return_items: [{ item_id: "test-item", quantity: 1 }],
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)

    const sendgridService = appContainer.resolve("sendgridService")
    const data = await sendgridService.fetchData("swap.created", {
      id: response.data.order.swaps[0].id,
    })

    expect(data.return_total).toMatchSnapshot()
    expect(data.refund_amount).toMatchSnapshot()
    expect(data.additional_total).toMatchSnapshot()
  })
})

const getReturnSnap = (received = false) => {
  const itemSnap = {
    id: expect.any(String),
    order_id: expect.any(String),
    order_edit_id: null,
    original_item_id: null,
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
    variant: {
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      product: {
        profile_id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
    },
    tax_lines: [
      {
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
    ],
  }

  return {
    date: expect.any(String),
    order: {
      display_id: expect.any(Number),
      id: expect.any(String),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      items: [itemSnap],
      customer_id: expect.any(String),
      shipping_address_id: expect.any(String),
      returns: [
        {
          id: expect.any(String),
          received_at: received ? expect.any(Date) : null,
          order_id: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          idempotency_key: expect.any(String),
          items: [
            {
              return_id: expect.any(String),
            },
          ],
        },
      ],
      shipping_address: {
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
      region: {
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
    },
    return_request: {
      id: expect.any(String),
      received_at: received ? expect.any(Date) : null,
      order_id: expect.any(String),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      idempotency_key: expect.any(String),
      items: [
        {
          return_id: expect.any(String),
          item: itemSnap,
        },
      ],
    },
    items: [
      {
        ...itemSnap,
        totals: {
          tax_lines: [
            {
              id: expect.any(String),
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
            },
          ],
        },
      },
    ],
  }
}

const createReturnableOrder = async (dbConnection, options = {}) => {
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

  return await simpleOrderFactory(dbConnection, {
    email: "test@testson.com",
    tax_rate: null,
    fulfillment_status: "fulfilled",
    payment_status: "captured",
    shipping_methods: options.notShipped
      ? [
          {
            price: 0,
            shipping_option: { name: "free", region_id: "test-region" },
          },
        ]
      : [],
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
        fulfilled_quantity: options.notShipped ? 0 : 2,
        shipped_quantity: options.notShipped ? 0 : 2,
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
