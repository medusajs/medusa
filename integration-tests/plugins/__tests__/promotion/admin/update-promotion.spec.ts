import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { PromotionType } from "@medusajs/utils"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import adminSeeder from "../../../../helpers/admin-seeder"

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

describe("POST /admin/promotions", () => {
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
      .post(
        `/admin/promotions/does-not-exist`,
        {
          type: PromotionType.STANDARD,
        },
        adminHeaders
      )
      .catch((e) => e)

    expect(response.status).toEqual(404)
    expect(response.data.message).toEqual(
      `Promotion with id "does-not-exist" not found`
    )
  })

  it("should update a promotion successfully", async () => {
    const createdPromotion = await promotionModuleService.create({
      code: "TEST",
      type: PromotionType.STANDARD,
      is_automatic: true,
      application_method: {
        target_type: "items",
        type: "fixed",
        allocation: "each",
        value: "100",
        max_quantity: 100,
      },
    })

    const api = useApi() as any
    const response = await api.post(
      `/admin/promotions/${createdPromotion.id}`,
      {
        code: "TEST_TWO",
        application_method: {
          value: "200",
        },
      },
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.promotion).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        code: "TEST_TWO",
        application_method: expect.objectContaining({
          value: 200,
        }),
      })
    )
  })
})
