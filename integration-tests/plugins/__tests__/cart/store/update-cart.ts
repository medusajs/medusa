import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService } from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import adminSeeder from "../../../../helpers/admin-seeder"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

describe("POST /store/carts/:id", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let cartModuleService: ICartModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
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
    const api = useApi() as any

    const cart = await cartModuleService.create({
      currency_code: "usd",
    })

    const response = await api.post(`/store/carts/${cart.id}`, {
      email: "tony@stark.com",
    })

    expect(response.status).toEqual(200)
    expect(response.data.cart).toEqual(
      expect.objectContaining({
        id: cart.id,
        currency_code: "usd",
        email: "tony@stark.com",
      })
    )
  })
})
