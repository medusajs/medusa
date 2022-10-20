const path = require("path")

const { bootstrapApp } = require("../../../helpers/bootstrap-app")
const { initAndMigrate, useDb } = require("../../../helpers/use-db")
const { setPort, useApi } = require("../../../helpers/use-api")

const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

const { simpleProductFactory } = require("../../factories")

describe("inventory", () => {
  let appContainer
  let dbConnection
  let express

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initAndMigrate({ cwd })
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
    // medusaProcess.kill()
  })

  afterEach(async () => {
    return await doAfterEach()
  })

  test("order canceled data", async () => {
    await adminSeeder(dbConnection)

    const api = useApi()

    await simpleProductFactory(
      dbConnection,
      {
        id: "test-product",
        variants: [{ id: "test-variant" }],
      },
      100
    )

    const response = await api.post(
      `/admin/products/test-product/variants`,
      {
        title: "Test Variant w. inventory",
        sku: "MY_SKU",
        manage_inventory: true,
        options: [
          {
            option_id: "test-product-option",
            value: "SS",
          },
        ],
        prices: [{ currency_code: "usd", amount: 2300 }],
      },
      { headers: { Authorization: "Bearer test_token" } }
    )

    expect(response.status).toEqual(200)

    const variantId = response.data.product.variants.find(
      (v) => v.id !== "test-variant"
    ).id

    const variantInventoryService = appContainer.resolve(
      "productVariantInventoryService"
    )
    const inventory = await variantInventoryService.listInventoryItemsByVariant(
      variantId
    )

    expect(inventory).toHaveLength(1)
  })
})
