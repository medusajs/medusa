import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { useApi } from "../../../environment-helpers/use-api"
import { AxiosInstance } from "axios"
import adminSeeder from "../../../helpers/admin-seeder"

const path = require("path")

const {
  startBootstrapApp,
} = require("../../../environment-helpers/bootstrap-app")
const { initDb, useDb } = require("../../../environment-helpers/use-db")
const { getContainer } = require("../../../environment-helpers/use-container")
const { useExpressServer } = require("../../../environment-helpers/use-api")

const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

jest.setTimeout(50000)

describe("List stock locations", () => {
  let shutdownServer
  let appContainer
  let dbConnection
  let addressId
  let scId

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
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
    const db = useDb()
    return await db.teardown()
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)

    const stockLocationModule = appContainer.resolve(
      ModuleRegistrationName.STOCK_LOCATION
    )

    const salesChannelService = appContainer.resolve("salesChannelService")
    const salesChannelLocationService = appContainer.resolve(
      "salesChannelLocationService"
    )
    const { id: sc_id } = await salesChannelService.create({ name: "test" })
    scId = sc_id

    const [{ address_id }, { id }] = await Promise.all([
      stockLocationModule.create({
        name: "Copenhagen",
        address: {
          address_1: "test street 1",
          country_code: "DK",
        },
      }),
      stockLocationModule.create({
        name: "Berlin",
      }),
      stockLocationModule.create({
        name: "Paris",
      }),
    ])

    await salesChannelLocationService.associateLocation(sc_id, id)

    addressId = address_id
  })

  describe("GET /stock-location", () => {
    it("should list all stock locations", async () => {
      const api = useApi()! as AxiosInstance

      const result = await api.get("/admin/stock-locations", adminHeaders)

      expect(result.status).toEqual(200)
      expect(result.data.stock_locations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Copenhagen",
          }),
          expect.objectContaining({
            name: "Berlin",
          }),
          expect.objectContaining({
            name: "Paris",
          }),
        ])
      )
    })

    it("should list stock locations filtered by q parameter", async () => {
      const api = useApi()! as AxiosInstance

      const result = await api.get(
        "/admin/stock-locations?q=open",
        adminHeaders
      )

      expect(result.status).toEqual(200)
      expect(result.data.count).toEqual(1)
      expect(result.data.stock_locations).toEqual([
        expect.objectContaining({
          name: "Copenhagen",
        }),
      ])
    })

    it("should list stock locations filtered by addresses", async () => {
      const api = useApi()! as AxiosInstance

      const result = await api.get(
        `/admin/stock-locations?address_id=${addressId}`,
        adminHeaders
      )

      expect(result.status).toEqual(200)
      expect(result.data.count).toEqual(1)
      expect(result.data.stock_locations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Copenhagen",
          }),
        ])
      )
    })

    it("should list stock locations filtered by sales channel Id", async () => {
      const api = useApi()! as AxiosInstance

      const result = await api.get(
        `/admin/stock-locations?sales_channel_id=${scId}`,
        adminHeaders
      )

      expect(result.status).toEqual(200)
      expect(result.data.count).toEqual(1)
      expect(result.data.stock_locations).toEqual([
        expect.objectContaining({
          name: "Berlin",
        }),
      ])
    })

    it("should list stock locations in requested order", async () => {
      const api = useApi()! as AxiosInstance

      const nameOrderLocations = [
        expect.objectContaining({
          name: "Berlin",
        }),
        expect.objectContaining({
          name: "Copenhagen",
        }),
        expect.objectContaining({
          name: "Paris",
        }),
      ]

      let result = await api.get(
        "/admin/stock-locations?order=name",
        adminHeaders
      )
      expect(result.status).toEqual(200)
      expect(result.data.stock_locations).toEqual(nameOrderLocations)

      result = await api.get("/admin/stock-locations?order=-name", adminHeaders)
      expect(result.status).toEqual(200)
      expect(result.data.stock_locations).toEqual(nameOrderLocations.reverse())
    })
  })
})
