const path = require("path")
const { ProductVariantInventoryService } = require("@medusajs/medusa")

const {
  bootstrapApp,
} = require("../../../../environment-helpers/bootstrap-app")
const { initDb, useDb } = require("../../../../environment-helpers/use-db")
const { setPort, useApi } = require("../../../../environment-helpers/use-api")

const adminSeeder = require("../../../../helpers/admin-seeder")

jest.setTimeout(30000)

const {
  simpleProductFactory,
  simpleOrderFactory,
} = require("../../../../factories")
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

describe("Inventory Items endpoints", () => {
  let appContainer
  let dbConnection
  let express

  let variantId
  let inventoryItems
  let locationId
  let location2Id
  let location3Id

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })

    const { container, app, port } = await bootstrapApp({ cwd, verbose: true })
    appContainer = container

    setPort(port)
    express = app.listen(port, (err) => {
      process.send(port)
    })
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)
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
    it("should create inventory item without variant id", async () => {
      // Set feature flag
      const flagRouter = appContainer.resolve("featureFlagRouter")
      flagRouter.setFlag("many_to_many_inventory", true)

      const api = useApi()

      await api.post(
        `/admin/inventory-items`,
        {
          sku: "TABLE_LEG",
          description: "Table Leg",
        },
        adminHeaders
      )

      /** @type {ProductVariantInventoryService} */
      const productVariantInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )

      const inventoryService = appContainer.resolve("inventoryService")
      const inventoryItems = await inventoryService.list()

      expect(inventoryItems.length).toEqual(1)

      const variants = await productVariantInventoryService.listByItem([
        inventoryItems[0].id,
      ])
      expect(variants.length).toEqual(0)

      flagRouter.setFlag("many_to_many_inventory", false)
    })

    it("should associate inventory item with variant id", async () => {
      // Set feature flag
      const flagRouter = appContainer.resolve("featureFlagRouter")
      flagRouter.setFlag("many_to_many_inventory", true)

      const api = useApi()

      const product = await simpleProductFactory(dbConnection)
      const response = await api.post(
        `/admin/inventory-items`,
        {
          sku: "TABLE_LEG",
          description: "Table Leg",
        },
        adminHeaders
      )

      const variantId = product.variants[0].id
      const inventoryItemId = response.data.inventory_item.id

      await api.post(
        `/admin/inventory-items/${inventoryItemId}/variants`,
        {
          variant_id: variantId,
        },
        adminHeaders
      )

      // Expect the inventory item to be associated with the variants

      /** @type {ProductVariantInventoryService} */
      const productVariantInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )

      const variants = await productVariantInventoryService.listByItem([
        inventoryItemId,
      ])

      expect(variants.length).toEqual(1)
      expect(variants[0].variant_id).toEqual(variantId)
      expect(variants[0].required_quantity).toEqual(1)

      flagRouter.setFlag("many_to_many_inventory", false)
    })

    it("should associate inventory item with variant id", async () => {
      // Set feature flag
      const flagRouter = appContainer.resolve("featureFlagRouter")
      flagRouter.setFlag("many_to_many_inventory", true)

      const api = useApi()

      const product = await simpleProductFactory(dbConnection)
      const response = await api.post(
        `/admin/inventory-items`,
        {
          sku: "TABLE_LEG",
          description: "Table Leg",
        },
        adminHeaders
      )

      const variantId = product.variants[0].id
      const inventoryItemId = response.data.inventory_item.id

      await api.post(
        `/admin/inventory-items/${inventoryItemId}/variants`,
        {
          variant_id: variantId,
          required_quantity: 3,
        },
        adminHeaders
      )

      // Expect the inventory item to be associated with the variants

      /** @type {ProductVariantInventoryService} */
      const productVariantInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )

      const variants = await productVariantInventoryService.listByItem([
        inventoryItemId,
      ])

      expect(variants.length).toEqual(1)
      expect(variants[0].variant_id).toEqual(variantId)
      expect(variants[0].required_quantity).toEqual(3)

      flagRouter.setFlag("many_to_many_inventory", false)
    })

    it("should associate inventory item with 2 variants and detach 1", async () => {
      // Set feature flag
      const flagRouter = appContainer.resolve("featureFlagRouter")
      flagRouter.setFlag("many_to_many_inventory", true)

      const api = useApi()

      const product = await simpleProductFactory(dbConnection, {
        variants: [{ id: "variant_one" }, { id: "variant_two" }],
      })
      const response = await api.post(
        `/admin/inventory-items`,
        {
          sku: "TABLE_LEG",
          description: "Table Leg",
        },
        adminHeaders
      )

      const firstVariantId = product.variants[0].id
      const secondVariantId = product.variants[1].id
      const inventoryItemId = response.data.inventory_item.id

      await api.post(
        `/admin/inventory-items/${inventoryItemId}/variants`,
        {
          variant_id: firstVariantId,
          required_quantity: 3,
        },
        adminHeaders
      )

      await api.post(
        `/admin/inventory-items/${inventoryItemId}/variants`,
        {
          variant_id: secondVariantId,
          required_quantity: 2,
        },
        adminHeaders
      )

      // Expect inventory items and variants to be associated

      /** @type {ProductVariantInventoryService} */
      const productVariantInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )

      const variants = await productVariantInventoryService.listByItem([
        inventoryItemId,
      ])

      expect(variants.length).toEqual(2)
      expect(variants[0].variant_id).toEqual(firstVariantId)
      expect(variants[0].required_quantity).toEqual(3)
      expect(variants[1].variant_id).toEqual(secondVariantId)
      expect(variants[1].required_quantity).toEqual(2)

      // Detach the first variant

      await api.delete(
        `/admin/inventory-items/${inventoryItemId}/variants/${firstVariantId}`,
        adminHeaders
      )

      // Expect only the second variant to be associated

      const variantsAfterDetach =
        await productVariantInventoryService.listByItem([inventoryItemId])

      expect(variantsAfterDetach.length).toEqual(1)
      expect(variantsAfterDetach[0].variant_id).toEqual(secondVariantId)
      expect(variantsAfterDetach[0].required_quantity).toEqual(2)

      flagRouter.setFlag("many_to_many_inventory", false)
    })
  })
})
