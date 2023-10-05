const path = require("path")

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
    // UNSET FEATURE FLAG
    const flagRouter = appContainer.resolve("featureFlagRouter")

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

      const inventoryService = appContainer.resolve("inventoryService")
      const inventoryItems = await inventoryService.list()
      console.log(inventoryItems)

      expect(inventoryItems.length).toEqual(1)
    })
  })
})
