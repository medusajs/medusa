const path = require("path")
const { IdMap } = require("medusa-test-utils")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")
const {
  simplePublishableApiKeyFactory,
} = require("../../factories/simple-publishable-api-key-factory")

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("[MEDUSA_FF_PUBLISHABLE_API_KEYS]", () => {
  let medusaProcess
  let dbConnection
  const adminUserId = "admin_user"

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_PUBLISHABLE_API_KEYS: true },
      verbose: true,
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/publishable-api-keys/:id", () => {
    const pubKeyId = IdMap.getId("pubkey-get-id")
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
        created_by: adminUserId,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("retrieve a publishable key by id ", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/publishable-api-keys/${pubKeyId}`,
        adminHeaders
      )

      expect(response.status).toBe(200)

      expect(response.data.publishable_api_key).toMatchObject({
        id: pubKeyId,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        created_by: adminUserId,
        revoked_by: null,
        revoked_at: null,
      })
    })
  })

  describe("GET /admin/publishable-api-keys/", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("list publishable keys", async () => {
      const api = useApi()

      const response = await api
        .get(
          `/admin/publishable-api-keys`,
          adminHeaders
        )(response.data.publishable_api_key)
        .toHaveLength(2)
    })
  })
})
