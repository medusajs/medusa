const path = require("path")

const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")
const { simpleSalesChannelFactory } = require("../../factories")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

jest.setTimeout(30000)

describe("sales channels", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_SALES_CHANNELS: true },
      verbose: false,
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/sales-channels/:id", () => {
    let salesChannel

    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        salesChannel = await simpleSalesChannelFactory(dbConnection, {
          name: "test name",
          description: "test description",
        })
      } catch (e) {
        console.error(e)
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should retrieve the requested sales channel", async () => {
      const api = useApi()
      const response = await api.get(
        `/admin/sales-channels/${salesChannel.id}`,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.sales_channel).toBeTruthy()
      expect(response.data.sales_channel).toMatchSnapshot({
        id: expect.any(String),
        name: salesChannel.name,
        description: salesChannel.description,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("POST /admin/sales-channels/:id", () => {
    let sc

    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        sc = await simpleSalesChannelFactory(dbConnection, {
          name: "test name",
          description: "test description",
        })
      } catch (err) {
        console.log(err)
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("updates sales channel properties", async () => {
      const api = useApi()

      const payload = {
        name: "updated name",
        description: "updated description",
        is_disabled: true,
      }

      const response = await api.post(
        `/admin/sales-channels/${sc.id}`,
        payload,
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.sales_channel).toMatchSnapshot({
        id: expect.any(String),
        name: payload.name,
        description: payload.description,
        is_disabled: payload.is_disabled,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })


  describe("POST /admin/sales-channels", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
      } catch (e) {
        console.error(e)
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("successfully creates a sales channel", async () => {
      const api = useApi()

      const newSalesChannel = {
        name: "sales channel name",
        description: "sales channel description",
      }

      const response = await api
        .post("/admin/sales-channels", newSalesChannel, adminReqConfig)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.sales_channel).toBeTruthy()

      expect(response.data).toMatchSnapshot({
        sales_channel: expect.objectContaining({
          name: newSalesChannel.name,
          description: newSalesChannel.description,
          is_disabled: false,
        }),
      })
    })
  })

  describe("GET /admin/sales-channels/:id", () => {})
  describe("POST /admin/sales-channels/:id", () => {})
  describe("DELETE /admin/sales-channels/:id", () => {})
})
