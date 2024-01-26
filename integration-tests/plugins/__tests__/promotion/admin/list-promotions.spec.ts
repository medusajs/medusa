import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { PromotionType } from "@medusajs/utils"
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

describe("GET /admin/promotions", () => {
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

  it("should get all promotions and its count", async () => {
    await promotionModuleService.create([
      {
        code: "TEST",
        type: PromotionType.STANDARD,
        application_method: {
          type: "fixed",
          target_type: "order",
          value: "100",
        },
      },
    ])

    const api = useApi() as any
    const response = await api.get(`/admin/promotions`, adminHeaders)

    expect(response.status).toEqual(200)
    expect(response.data.count).toEqual(1)
    expect(response.data.promotions).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        code: "TEST",
        campaign: null,
        is_automatic: false,
        type: "standard",
        created_at: expect.any(String),
        updated_at: expect.any(String),
        deleted_at: null,
        application_method: expect.objectContaining({
          id: expect.any(String),
          value: 100,
          type: "fixed",
          target_type: "order",
          allocation: null,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
        }),
      }),
    ])
  })

  it("should get all promotions and its count filtered", async () => {
    const [createdPromotion] = await promotionModuleService.create([
      {
        code: "TEST",
        type: PromotionType.STANDARD,
        application_method: {
          type: "fixed",
          target_type: "order",
          value: "100",
        },
      },
    ])

    const api = useApi() as any
    const response = await api.get(
      `/admin/promotions?fields=code,created_at,application_method.id`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.count).toEqual(1)
    expect(response.data.promotions).toEqual([
      {
        id: expect.any(String),
        code: "TEST",
        created_at: expect.any(String),
        application_method: {
          id: expect.any(String),
          promotion: expect.any(Object),
        },
      },
    ])
  })
})
