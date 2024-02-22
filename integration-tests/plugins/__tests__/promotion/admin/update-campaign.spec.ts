import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
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

describe("POST /admin/campaigns/:id", () => {
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
    await adminSeeder(dbConnection)
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should throw an error if id does not exist", async () => {
    const api = useApi() as any
    const { response } = await api
      .post(`/admin/campaigns/does-not-exist`, {}, adminHeaders)
      .catch((e) => e)

    expect(response.status).toEqual(404)
    expect(response.data.message).toEqual(
      `Campaign with id "does-not-exist" not found`
    )
  })

  it("should update a campaign successfully", async () => {
    const createdPromotion = await promotionModuleService.create({
      code: "TEST",
      type: "standard",
    })

    const createdPromotion2 = await promotionModuleService.create({
      code: "TEST_2",
      type: "standard",
    })

    const createdCampaign = await promotionModuleService.createCampaigns({
      name: "test",
      campaign_identifier: "test",
      starts_at: new Date("01/01/2024").toISOString(),
      ends_at: new Date("01/01/2029").toISOString(),
      promotions: [{ id: createdPromotion.id }],
      budget: {
        limit: 1000,
        type: "usage",
        used: 10,
      },
    })

    const api = useApi() as any
    const response = await api.post(
      `/admin/campaigns/${createdCampaign.id}`,
      {
        name: "test-2",
        campaign_identifier: "test-2",
        budget: {
          limit: 2000,
        },
        promotions: [{ id: createdPromotion2.id }],
      },
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.campaign).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "test-2",
        campaign_identifier: "test-2",
        budget: expect.objectContaining({
          limit: 2000,
          type: "usage",
          used: 10,
        }),
        promotions: [
          expect.objectContaining({
            id: createdPromotion2.id,
          }),
        ],
      })
    )
  })
})
