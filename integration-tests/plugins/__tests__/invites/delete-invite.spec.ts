import { initDb, useDb } from "../../../environment-helpers/use-db"

import { IUserModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { getContainer } from "../../../environment-helpers/use-container"
import path from "path"
import { startBootstrapApp } from "../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../environment-helpers/use-api"
import adminSeeder from "../../../helpers/admin-seeder"
import { AxiosInstance } from "axios"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

describe("DELETE /admin/users/:id", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let userModuleService: IUserModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    userModuleService = appContainer.resolve(ModuleRegistrationName.USER)
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should delete a single invite", async () => {
    const invite = await userModuleService.createInvites({
      email: "potential_member@test.com",
      token: "test",
      expires_at: new Date(),
    })

    const api = useApi()! as AxiosInstance

    const response = await api.delete(
      `/admin/invites/${invite.id}`,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data).toEqual({
      id: invite.id,
      object: "invite",
      deleted: true,
    })

    const { response: deletedResponse } = await api
      .get(`/admin/invites/${invite.id}`, adminHeaders)
      .catch((e) => e)

    expect(deletedResponse.status).toEqual(404)
    expect(deletedResponse.data.type).toEqual("not_found")
  })
})
