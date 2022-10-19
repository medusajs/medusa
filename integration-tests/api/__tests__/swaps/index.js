const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")

const {
  simpleOrderFactory,
  simpleShippingOptionFactory,
  simpleProductFactory,
} = require("../../factories")

jest.setTimeout(30000)

describe("Swaps", () => {
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

  test("creates a swap", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/swaps`,
      {
        additional_items: [
          {
            variant_id: "variant-2",
            quantity: 1,
          },
        ],
        return_items: [
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

    expect(response.status).toEqual(200)

    const cartId = response.data.order.swaps[0].cart_id

    /*
     * The return line item should use its tax_lines; the new line doesn't have
     * a tax line and uses the default region tax of 12.5
     *
     * Return line: 1000 * 1.2 = -1200
     * New line: 1000 * 1.125 = 1125
     * -
     * Difference should be -75
     */
    const cartRes = await api.get(`/store/carts/${cartId}`)
    expect(cartRes.status).toEqual(200)
    expect(cartRes.data.cart.subtotal).toEqual(0)
    expect(cartRes.data.cart.total).toEqual(-75)
    expect(cartRes.data.cart.tax_total).toEqual(-75)
  })

  test("creates a swap w. shipping", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const returnOption = await simpleShippingOptionFactory(dbConnection, {
      name: "Return method",
      region_id: "test-region",
      is_return: true,
      price: 100,
    })

    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/swaps`,
      {
        additional_items: [
          {
            variant_id: "variant-2",
            quantity: 1,
          },
        ],
        return_shipping: {
          option_id: returnOption.id,
        },
        return_items: [
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

    expect(response.status).toEqual(200)

    const cartId = response.data.order.swaps[0].cart_id

    /*
     * The return line item should use its tax_lines; the new line doesn't have
     * a tax line and uses the default region tax of 12.5
     *
     * Return line: 1000 * 1.2 = -1200
     * New line: 1000 * 1.125 = 1125
     * Shipping line: 100 * 1.125 = 112.5 ~ 113
     * -
     * Difference should be 38
     */
    const cartRes = await api.get(`/store/carts/${cartId}`)
    expect(cartRes.status).toEqual(200)
    expect(cartRes.data.cart.subtotal).toEqual(100)
    expect(cartRes.data.cart.tax_total).toEqual(-62)
    expect(cartRes.data.cart.total).toEqual(38)
  })

  test("retrieves a swap w. shipping", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const returnOption = await simpleShippingOptionFactory(dbConnection, {
      name: "Return method",
      region_id: "test-region",
      is_return: true,
      price: 100,
    })

    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/swaps`,
      {
        additional_items: [
          {
            variant_id: "variant-2",
            quantity: 1,
          },
        ],
        return_shipping: {
          option_id: returnOption.id,
        },
        return_items: [
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

    expect(response.status).toEqual(200)

    const swapRes = await api.get(
      `/admin/swaps/${response.data.order.swaps[0].id}`,
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )
    expect(swapRes.status).toEqual(200)
    expect(swapRes.data.swap.cart.subtotal).toEqual(100)
    expect(swapRes.data.swap.cart.tax_total).toEqual(-62)
    expect(swapRes.data.swap.cart.total).toEqual(38)
  })

  test("creates a swap from storefront", async () => {
    const order = await createReturnableOrder(dbConnection)
    const api = useApi()

    const response = await api.post(`/store/swaps`, {
      order_id: order.id,
      additional_items: [
        {
          variant_id: "variant-2",
          quantity: 1,
        },
      ],
      return_items: [
        {
          item_id: "test-item",
          quantity: 1,
        },
      ],
    })

    expect(response.status).toEqual(200)

    const cartId = response.data.swap.cart_id

    /*
     * The return line item should use its tax_lines; the new line doesn't have
     * a tax line and uses the default region tax of 12.5
     *
     * Return line: 1000 * 1.2 = -1200
     * New line: 1000 * 1.125 = 1125
     * -
     * Difference should be -75
     */
    const cartRes = await api.get(`/store/carts/${cartId}`)
    expect(cartRes.status).toEqual(200)
    expect(cartRes.data.cart.subtotal).toEqual(0)
    expect(cartRes.data.cart.total).toEqual(-75)
    expect(cartRes.data.cart.tax_total).toEqual(-75)
  })

  test("completes a swap", async () => {
    await adminSeeder(dbConnection)

    const order = await createReturnableOrder(dbConnection)
    const shippingOut = await simpleShippingOptionFactory(dbConnection, {
      region_id: "test-region",
      price: 500,
    })
    const returnOption = await simpleShippingOptionFactory(dbConnection, {
      name: "Return method",
      region_id: "test-region",
      is_return: true,
      price: 100,
    })

    const api = useApi()

    const response = await api.post(
      `/admin/orders/${order.id}/swaps`,
      {
        additional_items: [
          {
            variant_id: "variant-2",
            quantity: 1,
          },
        ],
        return_shipping: {
          option_id: returnOption.id,
        },
        return_items: [
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

    expect(response.status).toEqual(200)

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
    const completion = await api.post(`/store/carts/${cartId}/complete`)

    expect(completion.status).toEqual(200)
    expect(completion.data.type).toEqual("swap")
  })
})

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
}
