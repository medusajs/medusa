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

describe("POST /admin/customers/:id/addresses", () => {
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

  it("should create a customer address", async () => {
    // Create a customer
    const customer = await customerModuleService.create({
      first_name: "John",
      last_name: "Doe",
    })

    const api = useApi() as any
    const response = await api.post(
      `/admin/customers/${customer.id}/addresses`,
      {
        first_name: "John",
        last_name: "Doe",
        address_1: "Test street 1",
      },
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.address).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        first_name: "John",
        last_name: "Doe",
        address_1: "Test street 1",
      })
    )

    const customerWithAddresses = await customerModuleService.retrieve(
      customer.id,
      { relations: ["addresses"] }
    )

    expect(customerWithAddresses.addresses?.length).toEqual(1)
  })

  it("sets new shipping address as default and unsets the old one", async () => {
    const customer = await customerModuleService.create({
      first_name: "John",
      last_name: "Doe",
      addresses: [
        {
          first_name: "John",
          last_name: "Doe",
          address_1: "Test street 1",
          is_default_shipping: true,
        },
      ],
    })

    const api = useApi() as any
    const response = await api.post(
      `/admin/customers/${customer.id}/addresses`,
      {
        first_name: "John",
        last_name: "Doe",
        address_1: "Test street 2",
        is_default_shipping: true,
      },
      adminHeaders
    )

    expect(response.status).toEqual(200)

    const [address] = await customerModuleService.listAddresses({
      customer_id: customer.id,
      is_default_shipping: true,
    })

    expect(address.address_1).toEqual("Test street 2")
  })

  it("sets new billing address as default and unsets the old one", async () => {
    const customer = await customerModuleService.create({
      first_name: "John",
      last_name: "Doe",
      addresses: [
        {
          first_name: "John",
          last_name: "Doe",
          address_1: "Test street 1",
          is_default_billing: true,
        },
      ],
    })

    const api = useApi() as any
    const response = await api.post(
      `/admin/customers/${customer.id}/addresses`,
      {
        first_name: "John",
        last_name: "Doe",
        address_1: "Test street 2",
        is_default_billing: true,
      },
      adminHeaders
    )

    expect(response.status).toEqual(200)

    const [address] = await customerModuleService.listAddresses({
      customer_id: customer.id,
      is_default_billing: true,
    })

    expect(address.address_1).toEqual("Test street 2")
  })
})
