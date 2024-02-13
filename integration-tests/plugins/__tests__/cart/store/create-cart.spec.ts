import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService, IRegionModuleService } from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import adminSeeder from "../../../../helpers/admin-seeder"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

describe("POST /store/carts", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let cartModuleService: ICartModuleService
  let regionModuleService: IRegionModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
    regionModuleService = appContainer.resolve(ModuleRegistrationName.REGION)
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should create a cart", async () => {
    const region = await regionModuleService.create({
      name: "US",
      currency_code: "usd",
    })

    const api = useApi() as any
    const response = await api.post(`/store/carts`, {
      email: "tony@stark.com",
      currency_code: "usd",
      region_id: region.id,
    })

    expect(response.status).toEqual(200)
    expect(response.data.cart).toEqual(
      expect.objectContaining({
        id: response.data.cart.id,
        currency_code: "usd",
        email: "tony@stark.com",
      })
    )
  })

  it("should use any region", async () => {
    await regionModuleService.create({
      name: "US",
      currency_code: "usd",
    })

    const api = useApi() as any
    const response = await api.post(`/store/carts`, {
      email: "tony@stark.com",
      currency_code: "usd",
    })
    
    expect(response.status).toEqual(200)
    expect(response.data.cart).toEqual(
      expect.objectContaining({
        id: response.data.cart.id,
        currency_code: "usd",
        email: "tony@stark.com",
      })
    )
  })

  it("should throw when no regions exist", async () => {
    const api = useApi() as any

    await expect(
      api.post(`/store/carts`, {
        email: "tony@stark.com",
        currency_code: "usd",
      })
    ).rejects.toThrow()
  })
})
