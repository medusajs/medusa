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

describe("DELETE /admin/promotions/:id", () => {
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

  it("should delete promotion successfully", async () => {
    const createdPromotion = await promotionModuleService.create({
      code: "TEST",
      type: "standard",
      application_method: {
        type: "fixed",
        target_type: "order",
        value: "100",
      },
    })

    const api = useApi() as any
    const deleteRes = await api.delete(
      `/admin/promotions/${createdPromotion.id}`,
      adminHeaders
    )

    expect(deleteRes.status).toEqual(200)

    const promotions = await promotionModuleService.list({
      id: [createdPromotion.id],
    })

    expect(promotions.length).toEqual(0)
  })
})
