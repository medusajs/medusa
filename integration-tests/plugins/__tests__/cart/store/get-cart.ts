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

describe("GET /store/:id", () => {
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

  it("should get cart", async () => {
    const cart = await cartModuleService.create({
      currency_code: "usd",
      items: [
        {
          unit_price: 1000,
          quantity: 1,
          title: "Test item",
        },
      ],
    })

    const api = useApi() as any
    const response = await api.get(`/store/carts/${cart.id}`)

    expect(response.status).toEqual(200)
    expect(response.data.cart).toEqual(
      expect.objectContaining({
        id: cart.id,
        currency_code: "usd",
        items: expect.arrayContaining([
          expect.objectContaining({
            unit_price: 1000,
            quantity: 1,
            title: "Test item",
          }),
        ]),
      })
    )
  })
})
