import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IAuthModuleService, ICustomerModuleService } from "@medusajs/types"
import path from "path"
import Scrypt from "scrypt-kdf"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import adminSeeder from "../../../../helpers/admin-seeder"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

describe("POST /auth/emailpass", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let customerModuleService: ICustomerModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    customerModuleService = appContainer.resolve(
      ModuleRegistrationName.CUSTOMER
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

  const password = "supersecret"
  const email = "test@test.com"

  it("should return a token on successful login", async () => {
    const passwordHash = (
      await Scrypt.kdf(password, { logN: 15, r: 8, p: 1 })
    ).toString("base64")
    const authService: IAuthModuleService = appContainer.resolve(
      ModuleRegistrationName.AUTH
    )

    await authService.create({
      provider: "emailpass",
      entity_id: email,
      scope: "admin",
      provider_metadata: {
        password: passwordHash,
      },
    })

    const api = useApi() as any
    const response = await api
      .post(`/auth/admin/emailpass`, {
        email: email,
        password: password,
      })
      .catch((e) => e)

    expect(response.status).toEqual(200)
    expect(response.data).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    )
  })

  it("should throw an error upon incorrect password", async () => {
    const passwordHash = (
      await Scrypt.kdf(password, { logN: 15, r: 8, p: 1 })
    ).toString("base64")
    const authService: IAuthModuleService = appContainer.resolve(
      ModuleRegistrationName.AUTH
    )

    await authService.create({
      provider: "emailpass",
      entity_id: email,
      scope: "admin",
      provider_metadata: {
        password: passwordHash,
      },
    })

    const api = useApi() as any
    const error = await api
      .post(`/auth/admin/emailpass`, {
        email: email,
        password: "incorrect-password",
      })
      .catch((e) => e)

    expect(error.response.status).toEqual(401)
    expect(error.response.data).toEqual({
      type: "unauthorized",
      message: "Invalid email or password",
    })
  })

  it("should throw an error upon logging in with a non existing auth user", async () => {
    const passwordHash = (
      await Scrypt.kdf(password, { logN: 15, r: 8, p: 1 })
    ).toString("base64")

    const api = useApi() as any
    const error = await api
      .post(`/auth/admin/emailpass`, {
        email: "should-not-exist",
        password: "should-not-exist",
      })
      .catch((e) => e)

    // TODO: This is creating a user with a scope of admin. The client consuming the auth service
    // should reject this if its not being created by an admin user
    expect(error.response.status).toEqual(401)
    expect(error.response.data).toEqual({
      type: "unauthorized",
      message: "Invalid email or password",
    })
  })
})
