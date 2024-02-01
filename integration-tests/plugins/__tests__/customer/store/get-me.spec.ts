import { IAuthModuleService, ICustomerModuleService } from "@medusajs/types"
import { initDb, useDb } from "../../../../environment-helpers/use-db"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import adminSeeder from "../../../../helpers/admin-seeder"
import { getContainer } from "../../../../environment-helpers/use-container"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

describe("GET /store/customers", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let customerModuleService: ICustomerModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    customerModuleService = appContainer.resolve(
      ModuleRegistrationName.CUSTOMER
    )
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

  it("should retrieve auth user's customer", async () => {
    const customer = await customerModuleService.create({
      first_name: "John",
      last_name: "Doe",
      email: "john@me.com",
    })

    const authService: IAuthModuleService = appContainer.resolve(
      ModuleRegistrationName.AUTH
    )
    const authUser = await authService.createAuthUser({
      entity_id: "store_user",
      provider_id: "test",
      app_metadata: { customer_id: customer.id },
    })

    const jwt = await authService.generateJwtToken(authUser.id, "store")

    const api = useApi() as any
    const response = await api.get(`/store/customers/me`, {
      headers: { authorization: `Bearer ${jwt}` },
    })

    expect(response.status).toEqual(200)
    expect(response.data.customer).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        first_name: "John",
        last_name: "Doe",
        email: "john@me.com",
      })
    )
  })
})
