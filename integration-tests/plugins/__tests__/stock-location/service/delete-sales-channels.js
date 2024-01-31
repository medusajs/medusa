const path = require("path")

const {
  startBootstrapApp,
} = require("../../../../environment-helpers/bootstrap-app")
const { initDb, useDb } = require("../../../../environment-helpers/use-db")
const {
  useApi,
  useExpressServer,
} = require("../../../../environment-helpers/use-api")

const adminSeeder = require("../../../../helpers/admin-seeder")
const {
  getContainer,
} = require("../../../../environment-helpers/use-container")

jest.setTimeout(30000)

describe("Sales channels", () => {
  let appContainer
  let dbConnection
  let shutdownServer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })
    shutdownServer = await startBootstrapApp({ cwd })
    appContainer = getContainer()
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    const db = useDb()
    return await db.teardown()
  })

  describe("Stock Locations", () => {
    it("When deleting a sales channel, removes all associated locations with it", async () => {
      await adminSeeder(dbConnection)
      const api = useApi()

      const stockLocationService = appContainer.resolve("stockLocationService")
      const salesChannelService = appContainer.resolve("salesChannelService")
      const salesChannelLocationService = appContainer.resolve(
        "salesChannelLocationService"
      )

      const loc = await stockLocationService.create({
        name: "warehouse",
      })
      const loc2 = await stockLocationService.create({
        name: "other place",
      })

      const sc = await salesChannelService.create({ name: "channel test" })

      await salesChannelLocationService.associateLocation(sc.id, loc.id)
      await salesChannelLocationService.associateLocation(sc.id, loc2.id)

      expect(await salesChannelService.retrieve(sc.id)).toEqual(
        expect.objectContaining({
          id: sc.id,
          name: "channel test",
        })
      )

      expect(
        await salesChannelLocationService.listLocationIds(sc.id)
      ).toHaveLength(2)

      await api.delete(`/admin/sales-channels/${sc.id}`, {
        headers: { "x-medusa-access-token": "test_token" },
      })

      await expect(salesChannelService.retrieve(sc.id)).rejects.toThrowError()

      await expect(
        salesChannelLocationService.listLocationIds(sc.id)
      ).rejects.toThrowError()
    })
  })
})
