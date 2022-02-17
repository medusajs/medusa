const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { useDb, initDb } = require("../../../helpers/use-db")

const customerSeeder = require("../../helpers/customer-seeder")
const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/customer-groups", () => {
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

  describe("POST /admin/customer-groups", () => {
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

    it("creates customer group", async () => {
      const api = useApi()

      const payload = {
        name: "test group",
      }

      const response = await api.post("/admin/customer-groups", payload, {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      expect(response.status).toEqual(200)
      expect(response.data.customerGroup).toEqual(
        expect.objectContaining({
          name: "test group",
        })
      )
    })

    // it("fails to create a duplicate customer group", async () => {
    //   const api = useApi()

    //   const payload = {
    //     name: "vip-customer1s",
    //   }

    //   const response = await api
    //     .post("/admin/customer-groups", payload, {
    //       headers: {
    //         Authorization: "Bearer test_token",
    //       },
    //     })
    //     .catch((err) => console.log(err.response.data.message))

    //   expect(response.status).toEqual(200)
    //   expect(response.data.customerGroup).toEqual(
    //     expect.objectContaining({
    //       name: "test group",
    //     })
    //   )
    // })
  })

  describe("POST /admin/customer-groups/{id}/batch", () => {
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

    it("adds multiple customers to a group", async () => {
      const api = useApi()

      const payload = {
        customerIds: [{ id: "test-customer-1" }, { id: "test-customer-2" }],
      }

      const batchAddResponse = await api
        .post("/admin/customer-groups/test-group-0/batch", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => console.log(err))

      expect(batchAddResponse.status).toEqual(200)
      expect(batchAddResponse.data.customerGroup).toEqual(
        expect.objectContaining({
          name: "vip-customers",
        })
      )

      const getCustomerResponse = await api
        .get("/admin/customers?expand=groups", {
          headers: { Authorization: "Bearer test_token" },
        })
        .catch((err) => console.log(err))

      expect(getCustomerResponse.data.customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-customer-1",
            groups: [
              expect.objectContaining({
                name: "vip-customers",
                id: "test-group-0",
              }),
            ],
          }),
          expect.objectContaining({
            id: "test-customer-2",
            groups: [
              expect.objectContaining({
                name: "vip-customers",
                id: "test-group-0",
              }),
            ],
          }),
        ])
      )
    })

    it("adds customers to a group idempotently", async () => {
      const api = useApi()

      // add customer-1 to the customer group
      const payload_1 = {
        customerIds: [{ id: "test-customer-1" }],
      }

      await api.post("/admin/customer-groups/test-group-0/batch", payload_1, {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      // re-add customer-1 to the customer group along with new addintion: customer-2
      const payload_2 = {
        customerIds: [
          { id: "test-customer-1" },
          { id: "test-customer-27" },
          { id: "test-customer-2" },
        ],
      }

      await api.post("/admin/customer-groups/test-group-0/batch", payload_2, {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      // check that customer-1 is only added once and that customer-2 is added correctly
      const getCustomerResponse = await api.get(
        "/admin/customers?expand=groups",
        {
          headers: { Authorization: "Bearer test_token" },
        }
      )

      expect(getCustomerResponse.data.customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-customer-1",
            groups: [
              expect.objectContaining({
                name: "vip-customers",
                id: "test-group-0",
              }),
            ],
          }),
          expect.objectContaining({
            id: "test-customer-2",
            groups: [
              expect.objectContaining({
                name: "vip-customers",
                id: "test-group-0",
              }),
            ],
          }),
        ])
      )
    })
  })
})
