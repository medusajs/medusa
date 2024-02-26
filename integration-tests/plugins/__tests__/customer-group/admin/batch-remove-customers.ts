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

describe("DELETE /admin/customer-groups/:id/customers/remove", () => {
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

  it("should batch delete customers from a group", async () => {
    const api = useApi() as any

    const group = await customerModuleService.createCustomerGroup({
      name: "VIP",
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
      {
        first_name: "Test3",
        last_name: "Test3",
      },
    ])

    await customerModuleService.addCustomerToGroup(
      customers.map((c) => ({ customer_id: c.id, customer_group_id: group.id }))
    )

    const response = await api.post(
      `/admin/customer-groups/${group.id}/customers/remove`,
      {
        customer_ids: customers.map((c) => ({ id: c.id })),
      },
      adminHeaders
    )

    expect(response.status).toEqual(200)

    const updatedGroup = await customerModuleService.retrieveCustomerGroup(
      group.id,
      {
        relations: ["customers"],
      }
    )
    expect(updatedGroup.customers?.length).toEqual(0)
  })
})
