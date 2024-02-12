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

describe("GET /admin/customer-groups/:id/customers", () => {
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

  it("should get all customer groups and its count", async () => {
    const group = await customerModuleService.createCustomerGroup({
      name: "Test",
    })

    const customers = await customerModuleService.create([
      {
        first_name: "Test",
        last_name: "Test",
      },
      {
        first_name: "Test2",
        last_name: "Test2",
      },
    ])

    // add to group

    await customerModuleService.addCustomerToGroup(
      customers.map((c) => ({ customer_id: c.id, customer_group_id: group.id }))
    )

    const api = useApi() as any

    const response = await api.get(
      `/admin/customer-groups/${group.id}/customers`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.count).toEqual(2)
    expect(response.data.customers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: customers[0].id,
        }),
        expect.objectContaining({
          id: customers[1].id,
        }),
      ])
    )
  })
})
