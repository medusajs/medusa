const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const {
  simpleProductTaxRateFactory,
  simpleShippingTaxRateFactory,
  simpleProductTypeTaxRateFactory,
  simpleShippingOptionFactory,
  simpleCartFactory,
  simpleRegionFactory,
  simpleProductFactory,
} = require("../../factories")

jest.setTimeout(30000)

describe("Automatic Cart Taxes", () => {
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

  test("correct calculation w. default tax rate", async () => {
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
    expect(response.data.cart.tax_total).toEqual(12)
    expect(response.data.cart.total).toEqual(112)
  })

  test("correct calculation w. default tax rate w. shipping", async () => {
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
        },
        shipping_methods: [
          {
            shipping_option: {
              name: "random",
              region_id: "test-region",
            },
            price: 100,
          },
        ],
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
    expect(response.data.cart.tax_total).toEqual(24)
    expect(response.data.cart.total).toEqual(224)
  })

  test("correct calculation w. same type + prod tax rate", async () => {
    const product = await simpleProductFactory(
      dbConnection,
      {
        type: "Pants",
        variants: [
          {
            id: "test-variant",
          },
        ],
      },
      100
    )

    const region = await simpleRegionFactory(dbConnection, {
      name: "Test region",
      tax_rate: 12,
    })

    const prodRate = await simpleProductTaxRateFactory(dbConnection, {
      product_id: product.id,
      rate: {
        region_id: region.id,
        rate: 10,
      },
    })

    await simpleProductTypeTaxRateFactory(dbConnection, {
      product_type_id: product.type_id,
      rate: prodRate.rate_id,
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
        ],
      },
      100
    )

    const api = useApi()

    const response = await api.get(`/store/carts/${cart.id}`)
    expect(response.status).toEqual(200)
    expect(response.data.cart.tax_total).toEqual(10)
    expect(response.data.cart.total).toEqual(110)
  })

  test("correct calculation w. type + prod tax rate", async () => {
    const product = await simpleProductFactory(
      dbConnection,
      {
        type: "Pants",
        variants: [
          {
            id: "test-variant",
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
      product_id: product.id,
      rate: {
        region_id: region.id,
        rate: 10,
      },
    })

    await simpleProductTypeTaxRateFactory(dbConnection, {
      product_type_id: product.type_id,
      rate: {
        region_id: region.id,
        rate: 25,
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
        ],
      },
      100
    )

    const api = useApi()

    const response = await api.get(`/store/carts/${cart.id}`)
    expect(response.status).toEqual(200)
    expect(response.data.cart.tax_total).toEqual(35)
    expect(response.data.cart.total).toEqual(135)
  })

  test("correct calculation w. tax rate override type", async () => {
    const product = await simpleProductFactory(
      dbConnection,
      {
        type: "Pants",
        variants: [
          {
            id: "test-variant",
          },
        ],
      },
      100
    )

    const region = await simpleRegionFactory(dbConnection, {
      name: "Test region",
      tax_rate: 12,
    })

    await simpleProductTypeTaxRateFactory(dbConnection, {
      product_type_id: product.type_id,
      rate: {
        region_id: region.id,
        rate: 25,
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
        ],
      },
      100
    )

    const api = useApi()

    const response = await api.get(`/store/carts/${cart.id}`)
    expect(response.status).toEqual(200)
    expect(response.data.cart.tax_total).toEqual(25)
    expect(response.data.cart.total).toEqual(125)
  })

  test("correct calculation w. tax rate override", async () => {
    const product = await simpleProductFactory(
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

    const region = await simpleRegionFactory(dbConnection, {
      name: "Test region",
      tax_rate: 12,
    })

    await simpleProductTaxRateFactory(dbConnection, {
      product_id: product.id,
      rate: {
        region_id: region.id,
        rate: 25,
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
        ],
      },
      100
    )

    const api = useApi()

    const response = await api.get(`/store/carts/${cart.id}`)
    expect(response.status).toEqual(200)
    expect(response.data.cart.tax_total).toEqual(25)
    expect(response.data.cart.total).toEqual(125)
  })

  test("correct calculation w. tax rate override w. shipping", async () => {
    await simpleProductFactory(
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

    const region = await simpleRegionFactory(dbConnection, {
      name: "Test region",
      tax_rate: 12,
    })

    const option = await simpleShippingOptionFactory(dbConnection, {
      name: "random",
      region_id: region.id,
    })

    await simpleShippingTaxRateFactory(dbConnection, {
      shipping_option_id: option.id,
      rate: {
        region_id: region.id,
        rate: 25,
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
        ],
        shipping_methods: [
          {
            shipping_option: option.id,
            price: 100,
          },
        ],
      },
      100
    )

    const api = useApi()

    const response = await api.get(`/store/carts/${cart.id}`)
    expect(response.status).toEqual(200)
    expect(response.data.cart.tax_total).toEqual(37)
    expect(response.data.cart.total).toEqual(237)
  })

  test("correct calculation w. multiple tax rate overrides", async () => {
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

    const response = await api.get(`/store/carts/${cart.id}`)

    expect(response.status).toEqual(200)
    expect(response.data.cart.tax_total).toEqual(35)
    expect(response.data.cart.total).toEqual(185)
  })
})
