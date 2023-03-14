const path = require("path")

const { bootstrapApp } = require("../../../../helpers/bootstrap-app")
const { initDb, useDb } = require("../../../../helpers/use-db")
const { setPort, useApi } = require("../../../../helpers/use-api")

const {
  ProductVariantInventoryService,
  ProductVariantService,
} = require("@medusajs/medusa")

const adminSeeder = require("../../../helpers/admin-seeder")

jest.setTimeout(30000)

const { simpleProductFactory } = require("../../../factories")

describe("Create Variant", () => {
  let appContainer
  let dbConnection
  let express

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
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
    jest.clearAllMocks()
    const db = useDb()
    return await db.teardown()
  })

  describe("Inventory Items", () => {
    it("When creating a new product variant it should create an Inventory Item", async () => {
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
          material: "material",
          origin_country: "UK",
          hs_code: "hs001",
          mid_code: "mids",
          weight: 300,
          length: 100,
          height: 200,
          width: 150,
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
      const inventory =
        await variantInventoryService.listInventoryItemsByVariant(variantId)

      expect(inventory).toHaveLength(1)
      expect(inventory).toEqual([
        expect.objectContaining({
          origin_country: "UK",
          hs_code: "hs001",
          mid_code: "mids",
          weight: 300,
          length: 100,
          height: 200,
          width: 150,
        }),
      ])
    })

    it("When creating a new variant fails, it should revert all the transaction", async () => {
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

      jest
        .spyOn(ProductVariantInventoryService.prototype, "attachInventoryItem")
        .mockImplementation(() => {
          throw new Error("Failure while attaching inventory item")
        })

      const prodVariantDeleteMock = jest.spyOn(
        ProductVariantService.prototype,
        "delete"
      )

      const error = await api
        .post(
          `/admin/products/test-product/variants`,
          {
            title: "Test Variant w. inventory",
            sku: "MY_SKU",
            material: "material",
            origin_country: "UK",
            hs_code: "hs001",
            mid_code: "mids",
            weight: 300,
            length: 100,
            height: 200,
            width: 150,
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
        .catch((e) => e)

      expect(error.response.status).toEqual(400)
      expect(error.response.data.message).toEqual(
        "Failure while attaching inventory item"
      )

      expect(prodVariantDeleteMock).toHaveBeenCalledTimes(1)
    })
  })
})
