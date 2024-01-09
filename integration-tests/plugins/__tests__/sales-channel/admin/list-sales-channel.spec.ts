import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"

import { ISalesChannelModuleService } from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import adminSeeder from "../../../../helpers/admin-seeder"

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_MEDUSA_V2: true,
}

describe("GET /admin/sales-channels", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let salesChannelModuleService: ISalesChannelModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    salesChannelModuleService = appContainer.resolve(
      "salesChannelModuleService"
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

  it("should list sales channels", async () => {
    await salesChannelModuleService.create([
      { name: "test channel", description: "desc", is_disabled: false },
      { name: "test channel 2", description: "desc 2", is_disabled: true },
    ])

    const api = useApi() as any

    const response = await api.get(`/admin/sales-channels/`, adminHeaders)

    expect(response.status).toEqual(200)
    expect(response.data.sales_channels).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
          name: "test channel",
          description: "desc",
          is_disabled: false,
        }),
        expect.objectContaining({
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
          name: "test channel 2",
          description: "desc 2",
          is_disabled: true,
        }),
      ])
    )
  })
})
