import { initDb, useDb } from "../../../../environment-helpers/use-db"

import { IPromotionModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
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

describe("DELETE /admin/campaigns/:id", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let promotionModuleService: IPromotionModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    promotionModuleService = appContainer.resolve(
      ModuleRegistrationName.PROMOTION
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

  it("should delete campaign successfully", async () => {
    const [createdCampaign] = await promotionModuleService.createCampaigns([
      {
        name: "test",
        campaign_identifier: "test",
        starts_at: new Date("01/01/2024"),
        ends_at: new Date("01/01/2025"),
      },
    ])

    const api = useApi() as any
    const deleteRes = await api.delete(
      `/admin/campaigns/${createdCampaign.id}`,
      adminHeaders
    )

    expect(deleteRes.status).toEqual(200)

    const campaigns = await promotionModuleService.listCampaigns({
      id: [createdCampaign.id],
    })

    expect(campaigns.length).toEqual(0)
  })
})
