const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { useDb, initDb } = require("../../../helpers/use-db")

const customerSeeder = require("../../helpers/customer-seeder")
const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/customers", () => {
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

  describe("GET /admin/customers", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await customerSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists customers and query count", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/customers", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(4)
      expect(response.data.customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-customer-1",
          }),
          expect.objectContaining({
            id: "test-customer-2",
          }),
          expect.objectContaining({
            id: "test-customer-3",
          }),
          expect.objectContaining({
            id: "test-customer-has_account",
          }),
        ])
      )
    })

    it("lists customers with specific query", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/customers?q=est2@", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-customer-2",
            email: "test2@email.com",
          }),
        ])
      )
    })

    it("lists customers with expand query", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/customers?q=test1@email.com&expand=shipping_addresses", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-customer-1",
            shipping_addresses: expect.arrayContaining([
              expect.objectContaining({
                id: "test-address",
                first_name: "Lebron",
                last_name: "James",
              }),
            ]),
          }),
        ])
      )
    })
  })

  describe("POST /admin/customers", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Correctly creates customer", async () => {
      const api = useApi()
      const response = await api
        .post(
          "/admin/customers",
          {
            first_name: "newf",
            last_name: "newl",
            email: "new@email.com",
            password: "newpassword",
            metadata: { foo: "bar" },
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(201)
      expect(response.data.customer).toEqual(
        expect.objectContaining({
          first_name: "newf",
          last_name: "newl",
          email: "new@email.com",
          metadata: { foo: "bar" },
        })
      )
    })
  })

  describe("POST /admin/customers/:id", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await customerSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Correctly updates customer", async () => {
      const api = useApi()
      const response = await api
        .post(
          "/admin/customers/test-customer-3",
          {
            first_name: "newf",
            last_name: "newl",
            email: "new@email.com",
            metadata: { foo: "bar" },
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.customer).toEqual(
        expect.objectContaining({
          first_name: "newf",
          last_name: "newl",
          email: "new@email.com",
          metadata: { foo: "bar" },
        })
      )
    })
  })

  describe("GET /admin/customers/:id", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await customerSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("fetches a customer", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/customers/test-customer-1", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.customer).toMatchSnapshot({
        id: expect.any(String),
        shipping_addresses: [
          {
            id: "test-address",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })

    it("fetches a customer with expand query", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/customers/test-customer-1?expand=billing_address", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.customer).toMatchSnapshot({
        id: "test-customer-1",
        billing_address: {
          id: "test-address",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })
})
