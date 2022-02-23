const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")

const {
  simpleProductFactory,
  simpleShippingOptionFactory,
  simpleRegionFactory,
  simpleTaxRateFactory,
} = require("../../factories")

jest.setTimeout(30000)

describe("/admin/tax-rates", () => {
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
      medusaProcess = await setupServer({ cwd, verbose: true })
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

  test("list tax rates", async () => {
    await adminSeeder(dbConnection)
    await createTaxRates(dbConnection, 20, 2, 200)

    const api = useApi()

    const response = await api.get("/admin/tax-rates", {
      headers: {
        authorization: "Bearer test_token",
      },
    })

    expect(response.status).toEqual(200)
    expect(response.data.count).toEqual(20)
  })

  test("list tax rates w. query", async () => {
    await adminSeeder(dbConnection)
    await createTaxRates(dbConnection, 20, 2, 200)

    const api = useApi()

    const response = await api.get(
      `/admin/tax-rates?fields[]=rate&fields[]=product_count&fields[]=id&expand[]=products&rate[gt]=80`,
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)
    expect(response.data.tax_rates.some((tr) => tr.rate <= 80)).toEqual(false)
  })

  test("list tax rates w. region query", async () => {
    await adminSeeder(dbConnection)
    const { regions } = await createTaxRates(dbConnection, 20, 2, 200)

    const api = useApi()

    const response = await api.get(
      `/admin/tax-rates?region_id[]=${regions[0].id}&region_id[]=${regions[1].id}`,
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)
    expect(
      response.data.tax_rates.some(
        (tr) => tr.region_id !== regions[0].id && tr.region_id !== regions[1].id
      )
    ).toEqual(false)
  })

  test("get tax rates", async () => {
    await adminSeeder(dbConnection)
    const { tax_rates } = await createTaxRates(dbConnection, 20, 2, 200)

    const api = useApi()

    const response = await api.get(`/admin/tax-rates/${tax_rates[0].id}`, {
      headers: {
        authorization: "Bearer test_token",
      },
    })

    expect(response.status).toEqual(200)
    expect(response.data.tax_rate).toMatchSnapshot({
      id: expect.stringMatching(/^txr_*/),
      region_id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  })

  test("get tax rates w. fields", async () => {
    await adminSeeder(dbConnection)
    const { tax_rates } = await createTaxRates(dbConnection, 20, 2, 200)

    const api = useApi()

    const response = await api.get(
      `/admin/tax-rates/${tax_rates[0].id}?fields[]=id&fields[]=region_id`,
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)
    expect(response.data.tax_rate).toMatchSnapshot({
      id: expect.stringMatching(/^txr_*/),
      region_id: expect.any(String),
    })
  })

  test("assigns tax rate to product type", async () => {
    await adminSeeder(dbConnection)
    const { tax_rates } = await createTaxRates(dbConnection, 1, 1, 200)
    const [rate] = tax_rates

    const product = await simpleProductFactory(dbConnection, {
      type: "pants",
    })

    const api = useApi()

    const response = await api.post(
      `/admin/tax-rates/${rate.id}/product-types/batch?fields[]=id&fields[]=region_id&fields[]=product_type_count&expand[]=product_types`,
      {
        product_types: [product.type_id],
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)
    expect(response.data.tax_rate.product_type_count).toEqual(1)
    expect(response.data.tax_rate.product_types[0].id).toEqual(product.type_id)
  })

  test("assigns tax rate to multiple product type", async () => {
    await adminSeeder(dbConnection)
    const { tax_rates } = await createTaxRates(dbConnection, 1, 1, 200)
    const [rate] = tax_rates

    const products = await Promise.all(
      [0, 1, 2, 3].map((i) =>
        simpleProductFactory(dbConnection, {
          type: `pants-${i}`,
        })
      )
    )

    const api = useApi()

    const response = await api.post(
      `/admin/tax-rates/${rate.id}/product-types/batch?fields[]=id&fields[]=region_id&fields[]=product_type_count&expand[]=product_types`,
      {
        product_types: products.map((product) => product.type_id),
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)
    expect(response.data.tax_rate.product_type_count).toEqual(4)
    expect(response.data.tax_rate.product_types[0].id).toEqual(
      products[0].type_id
    )
    expect(response.data.tax_rate.product_types[1].id).toEqual(
      products[1].type_id
    )
    expect(response.data.tax_rate.product_types[2].id).toEqual(
      products[2].type_id
    )
    expect(response.data.tax_rate.product_types[3].id).toEqual(
      products[3].type_id
    )
  })

  test.only("fails with 404 on unknown rate", async () => {
    await adminSeeder(dbConnection)
    const { tax_rates } = await createTaxRates(dbConnection, 1, 1, 200)
    const [rate] = tax_rates

    await Promise.all(
      [0, 1, 2, 3].map(() => simpleProductFactory(dbConnection))
    )

    const api = useApi()

    const response = await api
      .post(
        `/admin/tax-rates/${rate.id}/products/batch?fields[]=id&fields[]=product_count&expand[]=products`,
        {
          products: ["unknown_product_id"],
        },
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )
      .catch((err) => err.response)

    expect(response.status).toEqual(404)
    expect(response.data.message).toEqual(
      "Product with id: unknown_product_id was not found"
    )
  })

  test("fails with 404 on unknown prod", async () => {
    await adminSeeder(dbConnection)
    await createTaxRates(dbConnection, 1, 1, 200)
    const products = await Promise.all(
      [0, 1, 2, 3].map(() => simpleProductFactory(dbConnection))
    )

    const api = useApi()

    const response = await api
      .post(
        `/admin/tax-rates/unknown_rate/products/batch?fields[]=id&fields[]=product_count&expand[]=products`,
        {
          products: products.map((product) => product.id),
        },
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )
      .catch((err) => err.response)

    expect(response.status).toEqual(404)
    expect(response.data.message).toEqual(
      "TaxRate with unknown_rate was not found"
    )
  })

  test("fails to assign rate to shipping option with different reg", async () => {
    await adminSeeder(dbConnection)
    const { tax_rates, regions } = await createTaxRates(dbConnection, 1, 1, 200)
    const [reg] = regions
    const [rate] = tax_rates

    const difReg = await simpleRegionFactory(dbConnection)
    const option = await simpleShippingOptionFactory(dbConnection, {
      name: "Test option",
      region_id: difReg,
    })

    const api = useApi()

    const response = await api
      .post(
        `/admin/tax-rates/${rate.id}/shipping-options/batch?fields[]=id&fields[]=shipping_option_count&expand[]=shipping_options`,
        {
          shipping_options: [option.id],
        },
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )
      .catch((err) => err.response)

    expect(response.status).toEqual(400)
    expect(response.data.message).toEqual(
      `Shipping Option and Tax Rate must belong to the same Region to be associated. Shipping Option with id: ${option.id} belongs to Region with id: ${option.region_id} and Tax Rate with id: ${rate.id} belongs to Region with id: ${rate.region_id}`
    )
  })

  test("assigns tax rate to shipping option", async () => {
    await adminSeeder(dbConnection)
    const { tax_rates, regions } = await createTaxRates(dbConnection, 1, 1, 200)
    const [reg] = regions
    const [rate] = tax_rates

    const options = await Promise.all(
      [0, 1, 2, 3].map((i) =>
        simpleShippingOptionFactory(dbConnection, {
          name: i,
          region_id: reg.id,
        })
      )
    )

    const api = useApi()

    const response = await api.post(
      `/admin/tax-rates/${rate.id}/shipping-options/batch?fields[]=id&fields[]=shipping_option_count&expand[]=shipping_options`,
      {
        shipping_options: options.map((o) => o.id),
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)
    expect(response.data.tax_rate.shipping_option_count).toEqual(4)
    expect(response.data.tax_rate.shipping_options[0].id).toEqual(options[0].id)
    expect(response.data.tax_rate.shipping_options[1].id).toEqual(options[1].id)
    expect(response.data.tax_rate.shipping_options[2].id).toEqual(options[2].id)
    expect(response.data.tax_rate.shipping_options[3].id).toEqual(options[3].id)
  })

  test("assigns tax rate to products", async () => {
    await adminSeeder(dbConnection)
    const { tax_rates } = await createTaxRates(dbConnection, 1, 1, 200)
    const [rate] = tax_rates

    const products = await Promise.all(
      [0, 1, 2, 3].map(() => simpleProductFactory(dbConnection))
    )

    const api = useApi()

    const response = await api.post(
      `/admin/tax-rates/${rate.id}/products/batch?fields[]=id&fields[]=product_count&expand[]=products`,
      {
        products: products.map((product) => product.id),
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)
    expect(response.data.tax_rate.product_count).toEqual(4)
    expect(response.data.tax_rate.products[0].id).toEqual(products[0].id)
    expect(response.data.tax_rate.products[1].id).toEqual(products[1].id)
    expect(response.data.tax_rate.products[2].id).toEqual(products[2].id)
    expect(response.data.tax_rate.products[3].id).toEqual(products[3].id)
  })

  test("creates a tax rate", async () => {
    await adminSeeder(dbConnection)

    const api = useApi()
    await simpleRegionFactory(dbConnection, {
      id: "test-region",
    })

    const response = await api.post(
      `/admin/tax-rates`,
      {
        name: "special",
        code: "tricks",
        region_id: "test-region",
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)
    expect(response.data.tax_rate).toMatchSnapshot({
      id: expect.stringMatching(/^txr_*/),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  })

  test("creates a tax rate and assigns products", async () => {
    await adminSeeder(dbConnection)

    const products = await Promise.all(
      [0, 1, 2, 3].map(() => simpleProductFactory(dbConnection))
    )

    await simpleRegionFactory(dbConnection, {
      id: "test-region",
    })

    const api = useApi()
    const response = await api.post(
      `/admin/tax-rates?fields[]=product_count&expand[]=products`,
      {
        name: "special",
        code: "tricks",
        region_id: "test-region",
        products: products.map((p) => p.id),
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)
    expect(response.data.tax_rate.product_count).toEqual(4)
  })

  test("updates a tax rate", async () => {
    await adminSeeder(dbConnection)

    await simpleRegionFactory(dbConnection, { id: "test-region" })

    const rate = await simpleTaxRateFactory(dbConnection, {
      name: "test",
      code: "something",
      rate: 10,
      region_id: "test-region",
    })

    const api = useApi()
    const response = await api.post(
      `/admin/tax-rates/${rate.id}`,
      {
        name: "special",
        code: "something new",
      },
      {
        headers: {
          authorization: "Bearer test_token",
        },
      }
    )

    expect(response.status).toEqual(200)
    expect(response.data.tax_rate).toMatchSnapshot({
      id: expect.stringMatching(/^txr_*/),
      code: "special",
      code: "something new",
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  })

  test("deletes a tax rate", async () => {
    await adminSeeder(dbConnection)

    await simpleRegionFactory(dbConnection, { id: "test-region" })

    const rate = await simpleTaxRateFactory(dbConnection, {
      name: "test",
      code: "something",
      rate: 10,
      region_id: "test-region",
    })

    const api = useApi()
    const response = await api.delete(`/admin/tax-rates/${rate.id}`, {
      headers: {
        authorization: "Bearer test_token",
      },
    })

    expect(response.status).toEqual(200)
    expect(response.data).toMatchSnapshot({
      id: expect.stringMatching(/^txr_*/),
    })
  })
})

const createTaxRates = async (dbConnection, num, numRegions, seed) => {
  const regions = []
  for (let i = 0; i < numRegions; i++) {
    const reg = await simpleRegionFactory(dbConnection, {}, seed + i)
    regions.push(reg)
  }

  const tax_rates = []
  for (let x = 0; x < num; x++) {
    const { id } = regions[Math.floor(Math.random() * regions.length)]
    const rate = await simpleTaxRateFactory(
      dbConnection,
      {
        region_id: id,
      },
      seed + x
    )

    tax_rates.push(rate)
  }

  return { regions, tax_rates }
}
