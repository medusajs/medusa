const jwt = require("jsonwebtoken")
const path = require("path")
const { Address, Customer, Order, Region } = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const { simpleOrderFactory } = require("../../factories")

jest.setTimeout(30000)

describe("/store/customers", () => {
  let medusaProcess
  let dbConnection

  const doAfterEach = async () => {
    const db = useDb()
    await db.teardown()
  }

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

  describe("POST /store/customers/confirm-claim", () => {
    let orderId
    beforeEach(async () => {
      const manager = dbConnection.manager
      await manager.insert(Customer, {
        id: "test_customer",
        first_name: "John",
        last_name: "Deere",
        email: "john@deere.com",
        password_hash:
          "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
        has_account: true,
      })

      await manager.insert(Customer, {
        id: "test_customer-1",
        first_name: "John",
        last_name: "Deere",
        email: "john@deere.com",
      })

      const order = await simpleOrderFactory(dbConnection, {
        customer: {
          id: "test_customer-1",
        },
      })
      orderId = order.id
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("Successfully confirms a claim ", async () => {
      const api = useApi()

      const token = jwt.sign(
        {
          claimingCustomerId: "test_customer",
          orders: [orderId],
        },
        "test"
      )

      const authResponse = await api.post("/store/auth", {
        email: "john@deere.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const authHeader = {
        headers: {
          Cookie: authCookie,
        },
      }

      const ordersRes1 = await api.get(`/store/customers/me/orders`, authHeader)

      expect(ordersRes1.data.orders.length).toEqual(0)

      const response = await api.post("/store/orders/customer/confirm", {
        token,
      })
      expect(response.status).toBe(200)

      const ordersRes2 = await api.get(`/store/customers/me/orders`, authHeader)

      expect(ordersRes2.data.orders.length).toEqual(1)
    })
  })

  describe("POST /store/customers", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await manager.insert(Customer, {
        id: "test_customer",
        first_name: "John",
        last_name: "Deere",
        email: "john@deere.com",
        has_account: true,
      })
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("creates a customer", async () => {
      const api = useApi()

      const response = await api.post("/store/customers", {
        first_name: "James",
        last_name: "Bond",
        email: "james@bond.com",
        password: "test",
      })

      expect(response.status).toEqual(200)
      expect(response.data.customer).not.toHaveProperty("password_hash")
    })

    it("normalizes email", async () => {
      const api = useApi()

      const response = await api.post("/store/customers", {
        first_name: "James",
        last_name: "Bond",
        email: "James@Bond.com",
        password: "test",
      })

      expect(response.status).toEqual(200)
      expect(response.data.customer).not.toHaveProperty("password_hash")
      expect(response.data.customer.email).toEqual("james@bond.com")
    })

    it("responds 422 on duplicate", async () => {
      const api = useApi()

      const response = await api
        .post("/store/customers", {
          first_name: "James",
          last_name: "Bond",
          email: "john@deere.com",
          password: "test",
        })
        .catch((err) => err.response)

      expect(response.status).toEqual(422)
    })
  })

  describe("GET /store/customers/me/orders", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await manager.query(`ALTER SEQUENCE order_display_id_seq RESTART WITH 1`)

      await manager.insert(Address, {
        id: "addr_test",
        first_name: "String",
        last_name: "Stringson",
        address_1: "String st",
        city: "Stringville",
        postal_code: "1236",
        province: "ca",
        country_code: "us",
      })

      await manager.insert(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      })

      await manager.insert(Customer, {
        id: "test_customer",
        first_name: "John",
        last_name: "Deere",
        email: "john@deere.com",
        password_hash:
          "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
        has_account: true,
      })

      await manager.insert(Customer, {
        id: "test_customer1",
        first_name: "John",
        last_name: "Deere",
        email: "joh1n@deere.com",
        password_hash:
          "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
        has_account: true,
      })

      await manager.insert(Order, {
        id: "order_test_completed",
        email: "test1@email.com",
        display_id: 1,
        customer_id: "test_customer",
        region_id: "region",
        status: "completed",
        tax_rate: 0,
        currency_code: "usd",
      })

      await manager.insert(Order, {
        id: "order_test_completed1",
        email: "test1@email.com",
        display_id: 2,
        customer_id: "test_customer1",
        region_id: "region",
        status: "completed",
        tax_rate: 0,
        currency_code: "usd",
      })

      await manager.insert(Order, {
        id: "order_test_canceled",
        email: "test1@email.com",
        display_id: 3,
        customer_id: "test_customer",
        region_id: "region",
        status: "canceled",
        tax_rate: 0,
        currency_code: "usd",
      })
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("looks up completed orders", async () => {
      const api = useApi()

      const authResponse = await api.post("/store/auth", {
        email: "john@deere.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const response = await api
        .get("/store/customers/me/orders?status[]=completed", {
          headers: {
            Cookie: authCookie,
          },
        })
        .catch((err) => {
          return err.response
        })
      expect(response.status).toEqual(200)
      expect(response.data.orders[0].display_id).toEqual(1)
      expect(response.data.orders[0].email).toEqual("test1@email.com")
      expect(response.data.orders.length).toEqual(1)
    })

    it("looks up cancelled and completed orders", async () => {
      const api = useApi()

      const authResponse = await api.post("/store/auth", {
        email: "john@deere.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const response = await api
        .get(
          "/store/customers/me/orders?status[]=completed&status[]=canceled",
          {
            headers: {
              Cookie: authCookie,
            },
          }
        )
        .catch((err) => {
          return console.log(err.response.data.message)
        })

      expect(response.status).toEqual(200)
      expect(response.data.orders).toEqual([
        expect.objectContaining({
          display_id: 3,
          status: "canceled",
        }),
        expect.objectContaining({
          display_id: 1,
          status: "completed",
        }),
      ])
      expect(response.data.orders.length).toEqual(2)
    })
  })

  describe("POST /store/customers/me", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await manager.insert(Address, {
        id: "addr_test",
        first_name: "String",
        last_name: "Stringson",
        address_1: "String st",
        city: "Stringville",
        postal_code: "1236",
        province: "ca",
        country_code: "us",
      })

      await manager.insert(Customer, {
        id: "test_customer",
        first_name: "John",
        last_name: "Deere",
        email: "john@deere.com",
        password_hash:
          "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
        has_account: true,
      })
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("updates a customer", async () => {
      const api = useApi()

      const authResponse = await api.post("/store/auth", {
        email: "john@deere.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const response = await api
        .post(
          `/store/customers/me`,
          {
            password: "test",
            metadata: { key: "value" },
          },
          {
            headers: {
              Cookie: authCookie,
            },
          }
        )
        .catch((e) => console.log("err", e))

      expect(response.status).toEqual(200)
      expect(response.data.customer).not.toHaveProperty("password_hash")
      expect(response.data.customer).toEqual(
        expect.objectContaining({
          metadata: { key: "value" },
        })
      )
    })

    it("updates customer billing address", async () => {
      const api = useApi()

      const authResponse = await api.post("/store/auth", {
        email: "john@deere.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const response = await api.post(
        `/store/customers/me`,
        {
          billing_address: {
            first_name: "test",
            last_name: "testson",
            address_1: "Test st",
            city: "Testion",
            postal_code: "1235",
            province: "ca",
            country_code: "us",
          },
        },
        {
          headers: {
            Cookie: authCookie,
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.customer).not.toHaveProperty("password_hash")
      expect(response.data.customer.billing_address).toEqual(
        expect.objectContaining({
          first_name: "test",
          last_name: "testson",
          address_1: "Test st",
          city: "Testion",
          postal_code: "1235",
          province: "ca",
          country_code: "us",
        })
      )
    })

    it("updates customer billing address with string", async () => {
      const api = useApi()

      const authResponse = await api.post("/store/auth", {
        email: "john@deere.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const response = await api.post(
        `/store/customers/me`,
        {
          billing_address: "addr_test",
        },
        {
          headers: {
            Cookie: authCookie,
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.customer).not.toHaveProperty("password_hash")
      expect(response.data.customer.billing_address).toEqual(
        expect.objectContaining({
          first_name: "String",
          last_name: "Stringson",
          address_1: "String st",
          city: "Stringville",
          postal_code: "1236",
          province: "ca",
          country_code: "us",
        })
      )
    })

    it("unsets customer billing address", async () => {
      const api = useApi()

      const authResponse = await api.post("/store/auth", {
        email: "john@deere.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const check = await api.post(
        `/store/customers/me`,
        {
          billing_address: "addr_test",
        },
        {
          headers: {
            Cookie: authCookie,
          },
        }
      )

      expect(check.status).toEqual(200)
      expect(check.data.customer.billing_address_id).toEqual("addr_test")

      const response = await api.post(
        `/store/customers/me`,
        {
          billing_address: null,
        },
        {
          headers: {
            Cookie: authCookie,
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.customer.billing_address_id).toEqual(null)
    })
  })

  describe("POST /store/customers/password-token", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await manager.insert(Customer, {
        id: "test_customer",
        first_name: "John",
        last_name: "Deere",
        email: "john@deere.com",
        password_hash:
          "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
        has_account: true,
      })
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("creates token", async () => {
      const api = useApi()

      const response = await api.post(`/store/customers/password-token`, {
        email: "john@deere.com",
      })

      expect(response.status).toEqual(204)
    })

    it("Returns 204 for non-existent customer", async () => {
      const api = useApi()

      const response = await api.post(`/store/customers/password-token`, {
        email: "non-existent@test.com",
      })

      expect(response.status).toEqual(204)
    })
  })

  describe("POST /store/customers/password-reset", () => {
    afterEach(async () => {
      await doAfterEach()
    })

    it("Returns 204 for non-existent customer", async () => {
      const api = useApi()

      const response = await api
        .post(`/store/customers/password-reset`, {
          email: "non-existent@test.com",
          token: "token",
          password: "password",
        })
        .catch((error) => {
          return error
        })
      expect(response.response.status).toEqual(401)
      expect(response.response.data).toEqual({
        type: "unauthorized",
        message: "Invalid or expired password reset token",
      })
    })
  })
})
