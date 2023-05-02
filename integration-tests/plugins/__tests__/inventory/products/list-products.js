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
const { simpleSalesChannelFactory } = require("../../../../api/factories")

const adminHeaders = { headers: { Authorization: "Bearer test_token" } }

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

  describe("list-products", () => {
    const productId = "test-product"
    const variantId = "test-variant"
    let sc2
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      const stockLocationService = appContainer.resolve("stockLocationService")
      const productVariantInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )
      const inventoryService = appContainer.resolve("inventoryService")
      const salesChannelLocationService = appContainer.resolve(
        "salesChannelLocationService"
      )

      await simpleProductFactory(
        dbConnection,
        {
          id: productId,
          status: "published",
          variants: [{ id: variantId }],
        },
        100
      )

      const sc1 = await simpleSalesChannelFactory(dbConnection, {})
      sc2 = await simpleSalesChannelFactory(dbConnection, {})
      const sc3 = await simpleSalesChannelFactory(dbConnection, {})

      const sl1 = await stockLocationService.create({ name: "sl1" })
      const sl2 = await stockLocationService.create({ name: "sl2" })

      await salesChannelLocationService.associateLocation(sc1.id, sl1.id)
      await salesChannelLocationService.associateLocation(sc2.id, sl1.id)
      await salesChannelLocationService.associateLocation(sc2.id, sl2.id)

      const invItem = await inventoryService.createInventoryItem({
        sku: "test-sku",
      })
      await productVariantInventoryService.attachInventoryItem(
        variantId,
        invItem.id
      )

      await inventoryService.createInventoryLevel({
        inventory_item_id: invItem.id,
        location_id: sl1.id,
        stocked_quantity: 3,
      })

      await inventoryService.createInventoryLevel({
        inventory_item_id: invItem.id,
        location_id: sl2.id,
        stocked_quantity: 1,
      })
    })

    it("lists location availability correctly", async () => {
      const api = useApi()

      const res = await api.get(`/admin/products`, adminHeaders)

      expect(res.status).toEqual(200)
      expect(res.data.products).toEqual([
        expect.objectContaining({
          id: productId,
          variants: [
            expect.objectContaining({
              inventory_quantity: 4,
            }),
          ],
        }),
      ])
    })

    describe("/store/products", () => {
      beforeEach(async () => {
        const inventoryService = appContainer.resolve("inventoryService")
        const productVariantInventoryService = appContainer.resolve(
          "productVariantInventoryService"
        )

        await simpleProductFactory(
          dbConnection,
          {
            id: `${productId}-1`,
            status: "published",
            variants: [
              {
                id: `${variantId}-1`,
                manage_inventory: false,
              },
            ],
          },
          101
        )
        await simpleProductFactory(
          dbConnection,
          {
            id: `${productId}-2`,
            status: "published",
            variants: [{ id: `${variantId}-2`, manage_inventory: true }],
          },
          102
        )
        await simpleProductFactory(
          dbConnection,
          {
            id: `${productId}-3`,
            status: "published",
            variants: [
              {
                id: `${variantId}-3`,
                manage_inventory: true,
                allow_backorder: true,
              },
            ],
          },
          103
        )
        const invItem = await inventoryService.createInventoryItem({
          sku: "test-sku-1",
        })
        await productVariantInventoryService.attachInventoryItem(
          `${variantId}-3`,
          invItem.id
        )
        await simpleProductFactory(
          dbConnection,
          {
            id: `${productId}-4`,
            status: "published",
            variants: [
              {
                id: `${variantId}-4`,
                manage_inventory: true,
                allow_backorder: false,
              },
            ],
          },
          104
        )
        const invItem1 = await inventoryService.createInventoryItem({
          sku: "test-sku-2",
        })
        await productVariantInventoryService.attachInventoryItem(
          `${variantId}-4`,
          invItem1.id
        )
      })

      it("lists location availability correctly for store", async () => {
        const api = useApi()

        const res = await api.get(`/store/products`)

        expect(res.status).toEqual(200)
        expect(res.data.products).toEqual([
          expect.objectContaining({
            id: `${productId}-4`,
            variants: [
              expect.objectContaining({
                purchasable: false,
              }),
            ],
          }),
          expect.objectContaining({
            id: `${productId}-3`,
            variants: [
              expect.objectContaining({
                purchasable: false,
              }),
            ],
          }),
          expect.objectContaining({
            id: `${productId}-2`,
            variants: [
              expect.objectContaining({
                purchasable: true,
              }),
            ],
          }),
          expect.objectContaining({
            id: `${productId}-1`,
            variants: [
              expect.objectContaining({
                inventory_quantity: 10,
                purchasable: true,
              }),
            ],
          }),
          expect.objectContaining({
            id: productId,
            variants: [
              expect.objectContaining({
                purchasable: false,
              }),
            ],
          }),
        ])
      })

      it("lists location availability correctly for store with sales channel id", async () => {
        const api = useApi()

        const productService = appContainer.resolve("productService")

        const ids = [
          `${productId}`,
          `${productId}-1`,
          `${productId}-2`,
          `${productId}-3`,
          `${productId}-4`,
        ]

        for (const id of ids) {
          await productService.update(id, {
            sales_channels: [{ id: sc2.id }],
          })
        }

        const res = await api.get(
          `/store/products?sales_channel_id[]=${sc2.id}`
        )

        expect(res.status).toEqual(200)
        expect(res.data.products).toEqual([
          expect.objectContaining({
            id: `${productId}-4`,
            variants: [
              expect.objectContaining({
                purchasable: false,
              }),
            ],
          }),
          expect.objectContaining({
            id: `${productId}-3`,
            variants: [
              expect.objectContaining({
                purchasable: true,
              }),
            ],
          }),
          expect.objectContaining({
            id: `${productId}-2`,
            variants: [
              expect.objectContaining({
                purchasable: true,
              }),
            ],
          }),
          expect.objectContaining({
            id: `${productId}-1`,
            variants: [
              expect.objectContaining({
                inventory_quantity: 10,
                purchasable: true,
              }),
            ],
          }),
          expect.objectContaining({
            id: productId,
            variants: [
              expect.objectContaining({
                purchasable: true,
                inventory_quantity: 4,
              }),
            ],
          }),
        ])
      })
    })
  })
})
