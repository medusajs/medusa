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
        headers: { Authorization: "Bearer test_token" },
      })

      await expect(salesChannelService.retrieve(sc.id)).rejects.toThrowError()

      await expect(
        salesChannelLocationService.listLocationIds(sc.id)
      ).rejects.toThrowError()
    })
  })
})
