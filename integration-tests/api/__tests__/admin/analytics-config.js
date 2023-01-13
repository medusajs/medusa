const path = require("path")
const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")
const {
  simpleAnalyticsConfigFactory,
} = require("../../factories/simple-analytics-config-factory")
const adminSeeder = require("../../helpers/admin-seeder")

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

jest.setTimeout(30000)
describe("[MEDUSA_FF_ANALYTICS] /admin/analytics-config", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_ANALYTICS: true },
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/analytics-config", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should retrieve config for logged in user if it exists", async () => {
      // Create config
      await simpleAnalyticsConfigFactory(dbConnection)

      const api = useApi()
      const response = await api.get(`/admin/analytics-configs`, adminReqConfig)

      expect(response.data).toMatchSnapshot({
        analytics_config: {
          id: expect.any(String),
          user_id: "admin_user",
          opt_out: false,
          anonymize: false,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      })
    })

    it("should return 404 if no config exists", async () => {
      const api = useApi()

      const err = await api
        .get(`/admin/analytics-configs`, adminReqConfig)
        .catch((err) => err)

      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
      expect(err.response.data.message).toEqual(
        "No analytics config found for user with id: admin_user"
      )
    })
  })

  describe("POST /admin/analytics-config", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should create a new config for logged in user", async () => {
      const api = useApi()
      const response = await api
        .post(
          `/admin/analytics-configs`,
          {
            opt_out: true,
            anonymize: true,
          },
          adminReqConfig
        )
        .catch((e) => console.log(e))

      expect(response.data).toMatchSnapshot({
        analytics_config: {
          id: expect.any(String),
          user_id: "admin_user",
          opt_out: true,
          anonymize: true,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      })
    })
  })

  describe("POST /admin/analytics-config/update", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should update the config of the logged in user", async () => {
      // Create config
      await simpleAnalyticsConfigFactory(dbConnection)

      const api = useApi()
      const response = await api.post(
        `/admin/analytics-configs/update`,
        {
          opt_out: true,
        },
        adminReqConfig
      )

      expect(response.data).toMatchSnapshot({
        analytics_config: {
          id: expect.any(String),
          user_id: "admin_user",
          opt_out: true,
          anonymize: false,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      })
    })

    it("should create a config for the user is no config exists", async () => {
      const api = useApi()
      const res = await api.post(
        `/admin/analytics-configs/update`,
        {
          opt_out: true,
        },
        adminReqConfig
      )

      expect(res.data).toMatchSnapshot({
        analytics_config: {
          id: expect.any(String),
          user_id: "admin_user",
          opt_out: true,
          anonymize: false,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      })
    })
  })

  describe("DELETE /admin/analytics-config", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should delete the config of the logged in user", async () => {
      // Create config
      await simpleAnalyticsConfigFactory(dbConnection)

      const api = useApi()
      const response = await api.delete(
        `/admin/analytics-configs`,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        user_id: "admin_user",
        object: "analytics_config",
        deleted: true,
      })
    })
  })
})
