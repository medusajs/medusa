import { IAuthModuleService, IUserModuleService } from "@medusajs/types"
import { initDb, useDb } from "../../../environment-helpers/use-db"

import { AxiosInstance } from "axios"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
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

describe("GET /admin/invites/:id", () => {
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

  it("should fail to create an auth user with an invalid invite token", async () => {
    const api = useApi()! as AxiosInstance

    const authResponse = await api
      .post(
        `/auth/admin/emailpass`,
        {
          email: "potential_member@test.com",
          password: "supersecret",
        },
        {
          headers: {
            authorization: `Bearer ${"non-existing-token"}`,
          },
        }
      )
      .catch((e) => e)

    expect(authResponse.response.status).toEqual(401)
    expect(authResponse.response.data.message).toEqual("Unauthorized")
  })

  it("should fail to accept an invite with an invalid invite token", async () => {
    const invite = await userModuleService.createInvites({
      email: "potential_member@test.com",
    })

    const api = useApi()! as AxiosInstance

    const authResponse = await api.post(
      `/auth/admin/emailpass`,
      {
        email: "potential_member@test.com",
        password: "supersecret",
      },
      {
        headers: {
          authorization: `Bearer ${invite.token}`,
        },
      }
    )

    expect(authResponse.status).toEqual(200)
    const token = authResponse.data.token

    const acceptResponse = await api
      .post(
        `/admin/invites/accept?token=${"non-existing-token"}`,
        {
          first_name: "John",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((e) => e)

    expect(acceptResponse.response.status).toEqual(401)
    expect(acceptResponse.response.data.message).toEqual("Unauthorized")
  })

  it("should accept an invite", async () => {
    const invite = await userModuleService.createInvites({
      email: "potential_member@test.com",
    })

    const api = useApi()! as AxiosInstance

    const authResponse = await api.post(
      `/auth/admin/emailpass`,
      {
        email: "potential_member@test.com",
        password: "supersecret",
      },
      {
        headers: {
          authorization: `Bearer ${invite.token}`,
        },
      }
    )

    expect(authResponse.status).toEqual(200)
    const token = authResponse.data.token

    const acceptResponse = await api.post(
      `/admin/invites/accept?token=${invite.token}`,
      {
        first_name: "John",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    expect(acceptResponse.status).toEqual(200)
    expect(acceptResponse.data.user).toEqual(
      expect.objectContaining({
        email: "potential_member@test.com",
        first_name: "John",
      })
    )
  })
})
