const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const { Customer } = require("@medusajs/medusa")

jest.setTimeout(30000)

describe("/store/auth", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  it("creates store session correctly", async () => {
    const api = useApi()

    await api
      .post("/store/customers", {
        email: "test@testesen.dk",
        password: "secret_password",
        first_name: "test",
        last_name: "testesen",
      })
      .catch((err) => {
        console.log(err)
      })

    const response = await api
      .post("/store/auth", {
        email: "test@testesen.dk",
        password: "secret_password",
      })
      .catch((err) => {
        console.log(err)
      })

    expect(response.status).toEqual(200)
    expect(response.data.customer.password_hash).toEqual(undefined)
    expect(response.data.customer).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        first_name: "test",
        last_name: "testesen",
        phone: null,
        email: "test@testesen.dk",
        shipping_addresses: expect.arrayContaining([]),
      })
    )
  })

  describe("Store session management", () => {
    beforeEach(async () => {
      await dbConnection.manager.insert(Customer, {
        id: "test_customer",
        first_name: "oli",
        last_name: "test",
        email: "oli@test.dk",
        password_hash:
          "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
        has_account: true,
      })

      await dbConnection.manager.insert(Customer, {
        id: "test_customer_no_account",
        first_name: "oli",
        last_name: "test",
        email: "oli+1@test.dk",
        has_account: false,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("successfully gets session", async () => {
      const api = useApi()

      const authResponse = await api.post("/store/auth", {
        email: "oli@test.dk",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const me = await api.get("/store/auth", {
        headers: {
          Cookie: authCookie,
        },
      })

      expect(me.status).toEqual(200)
    })

    it("throws 401 on customer without account", async () => {
      expect.assertions(1)

      const api = useApi()

      try {
        const authResponse = await api.post("/store/auth", {
          email: "oli+1@test.dk",
          password: "test",
        })

        const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

        await api.get("/store/auth", {
          headers: {
            Cookie: authCookie,
          },
        })
      } catch (err) {
        expect(err.response.status).toEqual(401)
      }
    })
  })
})
