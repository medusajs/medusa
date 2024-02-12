import { initDb, useDb } from "../../../../environment-helpers/use-db"

import { ICustomerModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createAuthenticatedCustomer } from "../../../helpers/create-authenticated-customer"
import { getContainer } from "../../../../environment-helpers/use-container"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"

const env = { MEDUSA_FF_MEDUSA_V2: true }

jest.setTimeout(100000)

describe("GET /store/customers/me/addresses", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let customerModuleService: ICustomerModuleService

  beforeAll(async () => {
    try {
      const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
      dbConnection = await initDb({ cwd, env } as any)
      shutdownServer = await startBootstrapApp({ cwd, env })
      appContainer = getContainer()
      customerModuleService = appContainer.resolve(
        ModuleRegistrationName.CUSTOMER
      )
    } catch (error) {
      console.error(error)
    }
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should get all customer addresses and its count", async () => {
    const { customer, jwt } = await createAuthenticatedCustomer(appContainer)

    await customerModuleService.addAddresses([
      {
        first_name: "Test",
        last_name: "Test",
        address_1: "Test street 1",
        customer_id: customer.id,
      },
      {
        first_name: "Test",
        last_name: "Test",
        address_1: "Test street 2",
        customer_id: customer.id,
      },
      {
        first_name: "Test",
        last_name: "Test",
        address_1: "Test street 3",
        customer_id: customer.id,
      },
    ])

    await customerModuleService.create({
      first_name: "Test Test",
      last_name: "Test Test",
      addresses: [
        {
          first_name: "Test TEST",
          last_name: "Test TEST",
          address_1: "NOT street 1",
        },
      ],
    })

    const api = useApi() as any
    const response = await api.get(`/store/customers/me/addresses`, {
      headers: { authorization: `Bearer ${jwt}` },
    })

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
