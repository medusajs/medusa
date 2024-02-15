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

describe("GET /admin/users/:id", () => {
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

  it("should retrieve a single user", async () => {
    const user = await userModuleService.create({
      email: "member@test.com",
    })

    const api = useApi()! as AxiosInstance

    const response = await api.get(`/admin/users/${user.id}`, adminHeaders)

    expect(response.status).toEqual(200)
    expect(response.data.user).toEqual(
      expect.objectContaining({ email: "member@test.com" })
    )
  })
})
