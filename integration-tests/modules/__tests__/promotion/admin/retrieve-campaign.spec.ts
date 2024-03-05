import { initDb, useDb } from "../../../../environment-helpers/use-db"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { CampaignBudgetType } from "@medusajs/utils"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { createAdminUser } from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

export const campaignData = {
  name: "campaign 1",
  description: "test description",
  currency: "USD",
  campaign_identifier: "test-1",
  starts_at: new Date("01/01/2023"),
  ends_at: new Date("01/01/2024"),
  budget: {
    type: CampaignBudgetType.SPEND,
    limit: 1000,
    used: 0,
  },
}

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

describe("GET /admin/campaigns", () => {
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

  let campaigns

  beforeEach(async () => {})

  it("should throw an error if id does not exist", async () => {
    const api = useApi() as any
    const { response } = await api
      .get(`/admin/campaigns/does-not-exist`, adminHeaders)
      .catch((e) => e)

    expect(response.status).toEqual(404)
    expect(response.data.message).toEqual(
      "Campaign with id: does-not-exist was not found"
    )
  })

  it("should get the requested campaign", async () => {
    const createdCampaign = await promotionModuleService.createCampaigns(
      campaignData
    )

    const api = useApi() as any
    const response = await api.get(
      `/admin/campaigns/${createdCampaign.id}`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.campaign).toEqual({
      id: expect.any(String),
      name: "campaign 1",
      description: "test description",
      currency: "USD",
      campaign_identifier: "test-1",
      starts_at: expect.any(String),
      ends_at: expect.any(String),
      budget: {
        id: expect.any(String),
        campaign: expect.any(Object),
        type: "spend",
        limit: 1000,
        raw_limit: {
          precision: 20,
          value: "1000",
        },
        raw_used: {
          precision: 20,
          value: "0",
        },
        used: 0,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        deleted_at: null,
      },
      created_at: expect.any(String),
      updated_at: expect.any(String),
      deleted_at: null,
    })
  })

  it("should get the requested campaign with filtered fields and relations", async () => {
    const createdCampaign = await promotionModuleService.createCampaigns(
      campaignData
    )

    const api = useApi() as any
    const response = await api.get(
      `/admin/campaigns/${createdCampaign.id}?fields=name&expand=`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.campaign).toEqual({
      id: expect.any(String),
      name: "campaign 1",
    })
  })
})
