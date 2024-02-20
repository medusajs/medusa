import { initDb, useDb } from "../../../environment-helpers/use-db"

import { AxiosInstance } from "axios"
import { IUserModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import adminSeeder from "../../../helpers/admin-seeder"
import { createAdminUser } from "../../helpers/create-admin-user"
import { getContainer } from "../../../environment-helpers/use-container"
import path from "path"
import { startBootstrapApp } from "../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../environment-helpers/use-api"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

describe("POST /admin/users", () => {
  let dbConnection
  let shutdownServer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
  })

  beforeEach(async () => {
    await createAdminUser(dbConnection, adminHeaders)
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

  it("create a user", async () => {
    const api = useApi()! as AxiosInstance

    const response = await api.get(`/admin/users/me`, adminHeaders)

    expect(response.status).toEqual(200)
    expect(response.data).toEqual({
      user: expect.objectContaining({ id: "test" }),
    })
  })
})
