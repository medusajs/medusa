import { initDb, useDb } from "../../../../environment-helpers/use-db"

import { ICustomerModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import adminSeeder from "../../../../helpers/admin-seeder"
import { createAdminUser } from "../../../helpers/create-admin-user"
import { getContainer } from "../../../../environment-helpers/use-container"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

describe("GET /admin/customers/:id/addresses", () => {
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
    await createAdminUser(dbConnection, adminHeaders)
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should get all customer addresses and its count", async () => {
    const [customer] = await customerModuleService.create([
      {
        first_name: "Test",
        last_name: "Test",
        email: "test@me.com",
        addresses: [
          {
            first_name: "Test",
            last_name: "Test",
            address_1: "Test street 1",
          },
          {
            first_name: "Test",
            last_name: "Test",
            address_1: "Test street 2",
          },
          {
            first_name: "Test",
            last_name: "Test",
            address_1: "Test street 3",
          },
        ],
      },
      {
        first_name: "Test Test",
        last_name: "Test Test",
        addresses: [
          {
            first_name: "Test TEST",
            last_name: "Test TEST",
            address_1: "NOT street 1",
          },
        ],
      },
    ])

    const api = useApi() as any
    const response = await api.get(
      `/admin/customers/${customer.id}/addresses`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.count).toEqual(3)
    expect(response.data.addresses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          customer_id: customer.id,
          address_1: "Test street 1",
        }),
        expect.objectContaining({
          id: expect.any(String),
          customer_id: customer.id,
          address_1: "Test street 2",
        }),
        expect.objectContaining({
          id: expect.any(String),
          customer_id: customer.id,
          address_1: "Test street 3",
        }),
      ])
    )
  })
})
