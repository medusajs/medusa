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

const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

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
    describe("CORE", () => {
      it("When listing a sales channel, it brings all associated locations with it", async () => {
        await adminSeeder(dbConnection)

        const stockLocationService = appContainer.resolve(
          "stockLocationService"
        )
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

        expect(
          await salesChannelLocationService.listLocationIds(sc.id)
        ).toHaveLength(2)

        const [channels] = await salesChannelService.listAndCount(
          {},
          {
            relations: ["locations"],
          }
        )
        const createdSC = channels.find((c) => c.id === sc.id)

        expect(channels).toHaveLength(2)
        expect(createdSC.locations).toHaveLength(2)
        expect(createdSC).toEqual(
          expect.objectContaining({
            id: sc.id,
            name: "channel test",
            locations: expect.arrayContaining([
              expect.objectContaining({
                sales_channel_id: sc.id,
                location_id: loc.id,
              }),
              expect.objectContaining({
                sales_channel_id: sc.id,
                location_id: loc2.id,
              }),
            ]),
          })
        )
      })
    })

    describe("API", () => {
      it("Filters stock locations based on sales channel ids", async () => {
        const api = useApi()

        await adminSeeder(dbConnection)

        const stockLocationService = appContainer.resolve(
          "stockLocationService"
        )
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

        const sc = await salesChannelService.create({ name: "Default Channel" })
        const sc2 = await salesChannelService.create({ name: "Physical store" })

        await salesChannelLocationService.associateLocation(sc.id, loc.id)
        await salesChannelLocationService.associateLocation(sc.id, loc2.id)
        await salesChannelLocationService.associateLocation(sc2.id, loc2.id)

        const defaultSalesChannelFilterRes = await api.get(
          `/admin/stock-locations?sales_channel_id=${sc.id}`,
          adminHeaders
        )

        expect(defaultSalesChannelFilterRes.data.stock_locations).toHaveLength(
          2
        )
        expect(defaultSalesChannelFilterRes.data.stock_locations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: "warehouse" }),
            expect.objectContaining({ name: "other place" }),
          ])
        )

        const physicalStoreSalesChannelFilterRes = await api.get(
          `/admin/stock-locations?sales_channel_id=${sc2.id}`,
          adminHeaders
        )
        expect(
          physicalStoreSalesChannelFilterRes.data.stock_locations
        ).toHaveLength(1)

        expect(physicalStoreSalesChannelFilterRes.data.stock_locations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: "other place" }),
          ])
        )
      })
    })
  })
})
