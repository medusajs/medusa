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

describe("DELETE /admin/customers/:id/addresses/:address_id", () => {
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

  it("should update a customer address", async () => {
    const customer = await customerModuleService.create({
      first_name: "John",
      last_name: "Doe",
    })

    const address = await customerModuleService.addAddresses({
      customer_id: customer.id,
      first_name: "John",
      last_name: "Doe",
      address_1: "Test street 1",
    })

    const api = useApi() as any
    const response = await api.delete(
      `/admin/customers/${customer.id}/addresses/${address.id}`,
      adminHeaders
    )

    expect(response.status).toEqual(200)

    const updatedCustomer = await customerModuleService.retrieve(customer.id, {
      relations: ["addresses"],
    })

    expect(updatedCustomer.addresses?.length).toEqual(0)
  })
})
