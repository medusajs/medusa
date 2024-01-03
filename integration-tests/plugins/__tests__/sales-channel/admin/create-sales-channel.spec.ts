import path from "path"

import { ISalesChannelModuleService } from "@medusajs/types"

import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"

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

describe("POST /admin/sales-channels", () => {
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

  it("should create a sales channel", async () => {
    const api = useApi() as any
    const data = {
      name: "test sc",
      description: "desc",
    }

    const result = await api.post(`admin/sales-channels`, data, adminHeaders)

    let channels = await salesChannelModuleService.list()

    expect(result.status).toEqual(200)

    expect(channels).toEqual(
      expect.objectContaining({
        name: "test sc",
        description: "desc",
        is_disabled: false,
      })
    )
  })
})
