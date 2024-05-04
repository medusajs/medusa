const path = require("path")

const { bootstrapApp } = require("../../../../helpers/bootstrap-app")
const { initDb, useDb } = require("../../../../helpers/use-db")
const { setPort, useApi } = require("../../../../helpers/use-api")

const adminSeeder = require("../../../helpers/admin-seeder")
const cartSeeder = require("../../../helpers/cart-seeder")
const { simpleProductFactory } = require("../../../../api/factories")
const { simpleSalesChannelFactory } = require("../../../../api/factories")
const { ModuleRegistrationName } = require("@medusajs/modules-sdk")

jest.setTimeout(30000)

const adminHeaders = { headers: { Authorization: "Bearer test_token" } }

describe.skip("Locking Module", () => {
  let express
  let appContainer
  let dbConnection

  let variantId
  let inventoryItemId
  let locationId
  const salesChannelId = "sales-channel-test"

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

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

  describe("Check inventory and reserve items", () => {
    beforeEach(async () => {
      await simpleSalesChannelFactory(dbConnection, {
        id: salesChannelId,
        is_default: true,
      })

      await adminSeeder(dbConnection)
      await cartSeeder(dbConnection, { sales_channel_id: salesChannelId })

      await simpleProductFactory(
        dbConnection,
        {
          id: "product123",
          sales_channels: [{ id: salesChannelId }],
          variants: [],
        },
        100
      )

      const api = useApi()

      // Add payment provider
      await api.post(
        `/admin/regions/test-region/payment-providers`,
        {
          provider_id: "test-pay",
        },
        adminHeaders
      )

      const prodVarInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )

      const response = await api.post(
        `/admin/products/product123/variants`,
        {
          title: "Test Variant w. inventory",
          sku: "MY_SKU123",
          options: [
            {
              option_id: "product123-option",
              value: "SS",
            },
          ],
          manage_inventory: true,
          prices: [{ currency_code: "usd", amount: 2300 }],
        },
        adminHeaders
      )

      const variant = response.data.product.variants[0]

      variantId = variant.id

      const inventoryItems =
        await prodVarInventoryService.listInventoryItemsByVariant(variantId)

      inventoryItemId = inventoryItems[0].id

      // Add Stock location
      const stockRes = await api.post(
        `/admin/stock-locations`,
        {
          name: "Fake Warehouse",
        },
        adminHeaders
      )
      locationId = stockRes.data.stock_location.id

      // Add stock level
      await api.post(
        `/admin/inventory-items/${inventoryItemId}/location-levels`,
        {
          location_id: locationId,
          stocked_quantity: 5,
        },
        adminHeaders
      )

      // Associate Stock Location with sales channel
      await api.post(
        `/admin/sales-channels/sales-channel-test/stock-locations`,
        {
          location_id: locationId,
        },
        adminHeaders
      )
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("Concurrent calls to confirm and reserve stock leads to over selling", async () => {
      const inventoryService = appContainer.resolve("inventoryService")
      const prodVarInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )

      const confirmAndReserve = async (quantity) => {
        const inventoryConfirmed =
          await prodVarInventoryService.confirmInventory(variantId, quantity, {
            salesChannelId,
          })

        if (inventoryConfirmed) {
          await prodVarInventoryService.reserveQuantity(variantId, quantity, {
            lineItemId: "line_item_123",
            salesChannelId,
          })
        }
      }

      const quantities = [2, 3, 4, 1, 3, 2, 1] // 16
      await Promise.all(
        quantities.map(async (quantity) => {
          await confirmAndReserve(quantity)
        })
      )

      const stockLevel = await inventoryService.retrieveInventoryLevel(
        inventoryItemId,
        locationId
      )

      expect(stockLevel.stocked_quantity).toEqual(5)
      expect(stockLevel.reserved_quantity).toBeGreaterThan(
        stockLevel.stocked_quantity
      )
    })

    it("Concurrent calls using locking to confirm and reserve stock won't reserve more the available quantity", async () => {
      const lockingService = appContainer.resolve(
        ModuleRegistrationName.LOCKING
      )
      const inventoryService = appContainer.resolve(
        ModuleRegistrationName.INVENTORY
      )
      const prodVarInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )

      const confirmAndReserve = async (quantity) => {
        await lockingService.execute(
          `variantReserve:${variantId}`,
          async () => {
            const inventoryConfirmed =
              await prodVarInventoryService.confirmInventory(
                variantId,
                quantity,
                {
                  salesChannelId,
                }
              )

            if (inventoryConfirmed) {
              await prodVarInventoryService.reserveQuantity(
                variantId,
                quantity,
                {
                  lineItemId: "line_item_123",
                  salesChannelId,
                }
              )
            }
          }
        )
      }

      const quantities = [2, 3, 4, 1, 3, 2, 1] // 16
      await Promise.all(
        quantities.map(async (quantity) => {
          await confirmAndReserve(quantity)
        })
      )

      const stockLevel = await inventoryService.retrieveInventoryLevel(
        inventoryItemId,
        locationId
      )

      expect(stockLevel.stocked_quantity).toEqual(5)
      expect(stockLevel.reserved_quantity).toEqual(stockLevel.stocked_quantity)
    })
  })
})
