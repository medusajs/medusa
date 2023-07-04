const path = require("path")

const setupServer = require("../../../../helpers/setup-server")
const { useApi } = require("../../../../helpers/use-api")
const { initDb, useDb } = require("../../../../helpers/use-db")

const {
  simpleOrderFactory,
  simpleRegionFactory,
  simpleCartFactory,
  simpleProductFactory,
  simpleProductTaxRateFactory,
} = require("../../../factories")

jest.setTimeout(30000)

describe("Order Taxes", () => {
  let medusaProcess
  let dbConnection

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
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
    expect(response.data.order.tax_total).toEqual(300)
    expect(response.data.order.total).toEqual(2300)
  })

  test("completing cart with failure doesn't duplicate", async () => {
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
        email: "test@testson.com",
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

    await api.post(`/store/carts/${cart.id}`, {
      email: "test@testson.com",
    })

    const failedComplete = await api
      .post(`/store/carts/${cart.id}/complete`)
      .catch((err) => err.response)

    expect(failedComplete.status).toEqual(400)
    expect(failedComplete.data.message).toEqual(
      "You cannot complete a cart without a payment session."
    )

    await api.post(`/store/carts/${cart.id}/payment-sessions`)
    const response = await api.post(`/store/carts/${cart.id}/complete`)

    expect(response.status).toEqual(200)

    expect(response.data.type).toEqual("order")
    expect(response.data.data.tax_total).toEqual(35)
    expect(response.data.data.total).toEqual(185)

    expect(
      response.data.data.items.flatMap((li) => li.tax_lines).length
    ).toEqual(2)

    expect(response.data.data.items[0].tax_lines).toHaveLength(1)
    expect(response.data.data.items[0].tax_lines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rate: 25,
        }),
      ])
    )
    expect(response.data.data.items[1].tax_lines).toHaveLength(1)
    expect(response.data.data.items[1].tax_lines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rate: 20,
        }),
      ])
    )
  })

  test("completing cart creates tax lines", async () => {
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
        email: "test@testson.com",
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

    await api.post(`/store/carts/${cart.id}`, {
      email: "test@testson.com",
    })
    await api.post(`/store/carts/${cart.id}/payment-sessions`)
    const response = await api.post(`/store/carts/${cart.id}/complete`)

    expect(response.status).toEqual(200)

    expect(response.data.type).toEqual("order")
    expect(response.data.data.tax_total).toEqual(35)
    expect(response.data.data.total).toEqual(185)

    expect(response.data.data.items[0].tax_lines).toHaveLength(1)
    expect(response.data.data.items[0].tax_lines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rate: 25,
        }),
      ])
    )
    expect(response.data.data.items[1].tax_lines).toHaveLength(1)
    expect(response.data.data.items[1].tax_lines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rate: 20,
        }),
      ])
    )
  })
})
