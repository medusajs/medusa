import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICustomerModuleService } from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import adminSeeder from "../../../../helpers/admin-seeder"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

describe("GET /admin/customers", () => {
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

  it("should get all customers and its count", async () => {
    await customerModuleService.create([
      {
        first_name: "Test",
        last_name: "Test",
        email: "test@me.com",
      },
    ])

    const api = useApi() as any
    const response = await api.get(`/admin/customers`, adminHeaders)

    expect(response.status).toEqual(200)
    expect(response.data.count).toEqual(1)
    expect(response.data.customers).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        first_name: "Test",
        last_name: "Test",
        email: "test@me.com",
      }),
    ])
  })

  it("should filter customers by last name", async () => {
    await customerModuleService.create([
      {
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@me.com",
      },
      {
        first_name: "John",
        last_name: "Doe",
        email: "john@me.com",
      },
      {
        first_name: "LeBron",
        last_name: "James",
        email: "lebron@me.com",
      },
      {
        first_name: "John",
        last_name: "Silver",
        email: "johns@me.com",
      },
    ])

    const api = useApi() as any
    const response = await api.get(
      `/admin/customers?last_name=Doe`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.count).toEqual(2)
    expect(response.data.customers).toContainEqual(
      expect.objectContaining({
        id: expect.any(String),
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@me.com",
      })
    )
    expect(response.data.customers).toContainEqual(
      expect.objectContaining({
        id: expect.any(String),
        first_name: "John",
        last_name: "Doe",
        email: "john@me.com",
      })
    )
  })
})
