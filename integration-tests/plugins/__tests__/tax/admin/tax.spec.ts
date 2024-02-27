import path from "path"
import { ITaxModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

import { createAdminUser } from "../../../helpers/create-admin-user"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { getContainer } from "../../../../environment-helpers/use-container"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

describe("Taxes - Admin", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let service: ITaxModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    try {
      shutdownServer = await startBootstrapApp({ cwd, env })
    } catch (error) {
      console.log(error)
    }
    appContainer = getContainer()
    service = appContainer.resolve(ModuleRegistrationName.TAX)
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

  it("can retrieve a tax rate", async () => {
    await createAdminUser(dbConnection, adminHeaders)
    const region = await service.createTaxRegions({
      country_code: "us",
    })
    const rate = await service.create({
      tax_region_id: region.id,
      code: "test",
      rate: 2.5,
      name: "Test Rate",
    })

    const api = useApi() as any
    const response = await api.get(`/admin/tax-rates/${rate.id}`, adminHeaders)

    expect(response.status).toEqual(200)
    expect(response.data).toEqual({
      tax_rate: {
        id: rate.id,
        code: "test",
        rate: 2.5,
        name: "Test Rate",
        metadata: null,
        tax_region_id: region.id,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        deleted_at: null,
        created_by: null,
      },
    })
  })
})
