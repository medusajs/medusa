const path = require("path")

const { bootstrapApp } = require("../../../helpers/bootstrap-app")
const { initDb, useDb } = require("../../../helpers/use-db")
const { setPort, useApi } = require("../../../helpers/use-api")

const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("Sales channels", () => {
  let appContainer
  let dbConnection
  let express

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
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

  describe("Stock Locations", () => {
    it("When deleting a stock location, removes all associated sales channels with it", async () => {
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

      const saleChannel = await salesChannelService.create({
        name: "channel test",
      })

      const otherChannel = await salesChannelService.create({
        name: "yet another channel",
      })

      await salesChannelLocationService.associateLocation(
        saleChannel.id,
        loc.id
      )
      await salesChannelLocationService.associateLocation(
        otherChannel.id,
        loc.id
      )

      expect(
        await salesChannelLocationService.listLocationIds(saleChannel.id)
      ).toHaveLength(1)

      expect(
        await salesChannelLocationService.listLocationIds(otherChannel.id)
      ).toHaveLength(1)

      await api.delete(`/admin/stock-locations/${loc.id}`, {
        headers: { Authorization: "Bearer test_token" },
      })

      expect(
        await salesChannelLocationService.listLocationIds(saleChannel.id)
      ).toHaveLength(0)

      expect(
        await salesChannelLocationService.listLocationIds(otherChannel.id)
      ).toHaveLength(0)
    })
  })
})
