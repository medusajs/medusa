import { initDb, useDb } from "../../../../environment-helpers/use-db"

import { CampaignBudgetType } from "@medusajs/utils"
import { IPromotionModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createAdminUser } from "../../../helpers/create-admin-user"
import { getContainer } from "../../../../environment-helpers/use-container"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"

jest.setTimeout(50000)

export const campaignsData = [
  {
    id: "campaign-id-1",
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
  },
  {
    id: "campaign-id-2",
    name: "campaign 2",
    description: "test description",
    currency: "USD",
    campaign_identifier: "test-2",
    starts_at: new Date("01/01/2023"),
    ends_at: new Date("01/01/2024"),
    budget: {
      type: CampaignBudgetType.USAGE,
      limit: 1000,
      used: 0,
    },
  },
]

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
    await promotionModuleService.createCampaigns(campaignsData)
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should get all campaigns and its count", async () => {
    const api = useApi() as any
    const response = await api.get(`/admin/campaigns`, adminHeaders)

    expect(response.status).toEqual(200)
    expect(response.data.count).toEqual(2)
    expect(response.data.campaigns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
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
            used: 0,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          },
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
        }),
        expect.objectContaining({
          id: expect.any(String),
          name: "campaign 2",
          description: "test description",
          currency: "USD",
          campaign_identifier: "test-2",
          starts_at: expect.any(String),
          ends_at: expect.any(String),
          budget: {
            id: expect.any(String),
            campaign: expect.any(Object),
            type: "usage",
            limit: 1000,
            used: 0,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          },
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
        }),
      ])
    )
  })

  it("should get all campaigns and its count filtered", async () => {
    const api = useApi() as any
    const response = await api.get(
      `/admin/campaigns?fields=name,created_at,budget.id`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.count).toEqual(2)
    expect(response.data.campaigns).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          name: "campaign 1",
          created_at: expect.any(String),
          budget: {
            id: expect.any(String),
            campaign: expect.any(Object),
          },
        },
        {
          id: expect.any(String),
          name: "campaign 2",
          created_at: expect.any(String),
          budget: {
            id: expect.any(String),
            campaign: expect.any(Object),
          },
        },
      ])
    )
  })
})
