import { initDb, useDb } from "../../../../environment-helpers/use-db"

import { IPromotionModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { PromotionType } from "@medusajs/utils"
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
    await createAdminUser(dbConnection, adminHeaders)
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should throw an error if id does not exist", async () => {
    const api = useApi() as any
    const { response } = await api
      .get(`/admin/promotions/does-not-exist`, adminHeaders)
      .catch((e) => e)

    expect(response.status).toEqual(404)
    expect(response.data.message).toEqual(
      "Promotion with id: does-not-exist was not found"
    )
  })

  it("should get the requested promotion", async () => {
    const createdPromotion = await promotionModuleService.create({
      code: "TEST",
      type: PromotionType.STANDARD,
      application_method: {
        type: "fixed",
        target_type: "order",
        value: "100",
      },
    })

    const api = useApi() as any
    const response = await api.get(
      `/admin/promotions/${createdPromotion.id}`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.promotion).toEqual(
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
          promotion: expect.any(Object),
          value: 100,
          type: "fixed",
          target_type: "order",
          max_quantity: 0,
          allocation: null,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
        }),
      })
    )
  })

  it("should get the requested promotion with filtered fields and relations", async () => {
    const createdPromotion = await promotionModuleService.create({
      code: "TEST",
      type: PromotionType.STANDARD,
      application_method: {
        type: "fixed",
        target_type: "order",
        value: "100",
      },
    })

    const api = useApi() as any
    const response = await api.get(
      `/admin/promotions/${createdPromotion.id}?fields=id,code&expand=`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.promotion).toEqual({
      id: expect.any(String),
      code: "TEST",
    })
  })
})
