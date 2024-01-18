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

  it("should throw an error if required params are not passed", async () => {
    const api = useApi() as any
    const { response } = await api
      .post(
        `/admin/promotions`,
        {
          type: PromotionType.STANDARD,
        },
        adminHeaders
      )
      .catch((e) => e)

    expect(response.status).toEqual(400)
    expect(response.data.message).toEqual(
      "code must be a string, code should not be empty, application_method should not be empty"
    )
  })

  it("should create a promotion successfully", async () => {
    const api = useApi() as any
    const response = await api.post(
      `/admin/promotions`,
      {
        code: "TEST",
        type: PromotionType.STANDARD,
        is_automatic: true,
        campaign: {
          name: "test",
          campaign_identifier: "test-1",
        },
        application_method: {
          target_type: "items",
          type: "fixed",
          allocation: "each",
          value: "100",
          max_quantity: 100,
        },
        rules: [
          {
            attribute: "test.test",
            operator: "eq",
            values: ["test1", "test2"],
          },
        ],
      },
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.promotion).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        code: "TEST",
        type: "standard",
        is_automatic: true,
        campaign: expect.objectContaining({
          name: "test",
          campaign_identifier: "test-1",
        }),
        application_method: expect.objectContaining({
          value: 100,
          max_quantity: 100,
          type: "fixed",
          target_type: "items",
          allocation: "each",
        }),
        rules: [
          expect.objectContaining({
            operator: "eq",
            attribute: "test.test",
            values: expect.arrayContaining([
              expect.objectContaining({ value: "test1" }),
              expect.objectContaining({ value: "test2" }),
            ]),
          }),
        ],
      })
    )
  })
})
