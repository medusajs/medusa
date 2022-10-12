const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { useDb, initDb } = require("../../../helpers/use-db")
const {
  simpleDiscountFactory,
  simpleRegionFactory,
  simpleProductFactory,
  simpleProductTaxRateFactory,
} = require("../../factories")

const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("Cart Totals Calculations", () => {
  let medusaProcess
  let dbConnection

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

  beforeEach(async () => {
    await adminSeeder(dbConnection)
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("sets correct line item totals for a cart with item of price 100 and tax rate 10", async () => {
    const api = useApi()

    const region = await simpleRegionFactory(dbConnection)
    const product = await simpleProductFactory(dbConnection)
    await simpleProductTaxRateFactory(dbConnection, {
      product_id: product.id,
      rate: {
        region_id: region.id,
        rate: 10,
      },
    })

    // create cart
    const { cart } = await api
      .post("/store/carts", {
        region_id: region.id,
      })
      .then((res) => res.data)

    // add product to cart
    const res = await api.post(`/store/carts/${cart.id}/line-items`, {
      variant_id: product.variants[0].id,
      quantity: 1,
    })

    expect(res.data.cart.items[0].unit_price).toEqual(100)
    expect(res.data.cart.items[0].quantity).toEqual(1)
    expect(res.data.cart.items[0].subtotal).toEqual(100)
    expect(res.data.cart.items[0].tax_total).toEqual(10)
    expect(res.data.cart.items[0].total).toEqual(110)
    expect(res.data.cart.items[0].original_total).toEqual(110)
    expect(res.data.cart.items[0].original_tax_total).toEqual(10)
    expect(res.data.cart.items[0].discount_total).toEqual(0)
  })

  it("sets correct line item totals for a cart with item of price 100; tax rate 10; discount 10", async () => {
    const api = useApi()

    const region = await simpleRegionFactory(dbConnection)
    const product = await simpleProductFactory(dbConnection)
    const discount = await simpleDiscountFactory(dbConnection, {
      regions: [region.id],
      type: "percentage",
      value: 10,
    })

    await simpleProductTaxRateFactory(dbConnection, {
      product_id: product.id,
      rate: {
        region_id: region.id,
        rate: 10,
      },
    })

    const { cart } = await api
      .post("/store/carts", {
        region_id: region.id,
      })
      .then((res) => res.data)

    await api.post(`/store/carts/${cart.id}/line-items`, {
      variant_id: product.variants[0].id,
      quantity: 1,
    })

    const res = await api.post(`/store/carts/${cart.id}`, {
      discounts: [
        {
          code: discount.code,
        },
      ],
    })

    expect(res.data.cart.items[0].unit_price).toEqual(100)
    expect(res.data.cart.items[0].quantity).toEqual(1)
    expect(res.data.cart.items[0].subtotal).toEqual(100)
    expect(res.data.cart.items[0].tax_total).toEqual(9)
    expect(res.data.cart.items[0].total).toEqual(99)
    expect(res.data.cart.items[0].original_total).toEqual(110)
    expect(res.data.cart.items[0].original_tax_total).toEqual(10)
    expect(res.data.cart.items[0].discount_total).toEqual(10)
  })

  it("doesn't include taxes in !automatic_taxes regions", async () => {
    const api = useApi()

    const region = await simpleRegionFactory(dbConnection, {
      automatic_taxes: false,
    })
    const product = await simpleProductFactory(dbConnection)
    const discount = await simpleDiscountFactory(dbConnection, {
      regions: [region.id],
      type: "percentage",
      value: 10,
    })

    await simpleProductTaxRateFactory(dbConnection, {
      product_id: product.id,
      rate: {
        region_id: region.id,
        rate: 10,
      },
    })

    const { cart } = await api
      .post("/store/carts", {
        region_id: region.id,
      })
      .then((res) => res.data)

    await api.post(`/store/carts/${cart.id}/line-items`, {
      variant_id: product.variants[0].id,
      quantity: 1,
    })

    const res = await api.post(`/store/carts/${cart.id}`, {
      discounts: [
        {
          code: discount.code,
        },
      ],
    })

    expect(res.data.cart.items[0].unit_price).toEqual(100)
    expect(res.data.cart.items[0].quantity).toEqual(1)
    expect(res.data.cart.items[0].subtotal).toEqual(100)
    expect(res.data.cart.items[0].tax_total).toEqual(0)
    expect(res.data.cart.items[0].total).toEqual(90)
    expect(res.data.cart.items[0].original_total).toEqual(100)
    expect(res.data.cart.items[0].original_tax_total).toEqual(0)
    expect(res.data.cart.items[0].discount_total).toEqual(10)
  })

  it("includes taxes in !automatic_taxes regions when forced", async () => {
    const api = useApi()

    const region = await simpleRegionFactory(dbConnection, {
      automatic_taxes: false,
    })
    const product = await simpleProductFactory(dbConnection)
    const discount = await simpleDiscountFactory(dbConnection, {
      regions: [region.id],
      type: "percentage",
      value: 10,
    })

    await simpleProductTaxRateFactory(dbConnection, {
      product_id: product.id,
      rate: {
        region_id: region.id,
        rate: 10,
      },
    })

    const { cart } = await api
      .post("/store/carts", {
        region_id: region.id,
      })
      .then((res) => res.data)

    await api.post(`/store/carts/${cart.id}/line-items`, {
      variant_id: product.variants[0].id,
      quantity: 1,
    })

    await api.post(`/store/carts/${cart.id}`, {
      discounts: [
        {
          code: discount.code,
        },
      ],
    })

    const res = await api.post(`/store/carts/${cart.id}/taxes`)

    expect(res.data.cart.items[0].unit_price).toEqual(100)
    expect(res.data.cart.items[0].quantity).toEqual(1)
    expect(res.data.cart.items[0].subtotal).toEqual(100)
    expect(res.data.cart.items[0].tax_total).toEqual(9)
    expect(res.data.cart.items[0].total).toEqual(99)
    expect(res.data.cart.items[0].original_total).toEqual(110)
    expect(res.data.cart.items[0].original_tax_total).toEqual(10)
    expect(res.data.cart.items[0].discount_total).toEqual(10)
  })
})
