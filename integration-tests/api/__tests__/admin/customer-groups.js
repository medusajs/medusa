const path = require("path")

const { IdMap } = require("medusa-test-utils")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { useDb, initDb } = require("../../../helpers/use-db")

const customerSeeder = require("../../helpers/customer-seeder")
const adminSeeder = require("../../helpers/admin-seeder")
const {
  DiscountRuleType,
  AllocationType,
  DiscountConditionType,
  DiscountConditionOperator,
} = require("@medusajs/medusa")
const { simpleDiscountFactory } = require("../../factories")

jest.setTimeout(30000)

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

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
      await adminSeeder(dbConnection)
      await customerSeeder(dbConnection)
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

      const response = await api.post(
        "/admin/customer-groups",
        payload,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.customer_group).toEqual(
        expect.objectContaining({
          name: "test group",
        })
      )
    })

    it("Fails to create duplciate customer group", async () => {
      expect.assertions(3)
      const api = useApi()

      const payload = {
        name: "vip-customers",
      }

      await api
        .post("/admin/customer-groups", payload, adminReqConfig)
        .catch((err) => {
          expect(err.response.status).toEqual(422)
          expect(err.response.data.type).toEqual("duplicate_error")
          expect(err.response.data.message).toEqual(
            "Key (name)=(vip-customers) already exists."
          )
        })
    })
  })

  describe("DELETE /admin/customer-groups", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await customerSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("removes customer group from get endpoint", async () => {
      expect.assertions(3)

      const api = useApi()

      const id = "customer-group-1"

      const deleteResponse = await api.delete(
        `/admin/customer-groups/${id}`,
        adminReqConfig
      )

      expect(deleteResponse.data).toEqual({
        id: id,
        object: "customer_group",
        deleted: true,
      })

      await api
        .get(`/admin/customer-groups/${id}`, adminReqConfig)
        .catch((error) => {
          expect(error.response.data.type).toEqual("not_found")
          expect(error.response.data.message).toEqual(
            `CustomerGroup with id ${id} was not found`
          )
        })
    })

    it("removes customer group from customer upon deletion", async () => {
      expect.assertions(3)

      const api = useApi()

      const id = "test-group-delete"

      const customerRes_preDeletion = await api.get(
        `/admin/customers/test-customer-delete-cg?expand=groups`,
        adminReqConfig
      )

      expect(customerRes_preDeletion.data.customer).toEqual(
        expect.objectContaining({
          groups: [
            expect.objectContaining({
              id: "test-group-delete",
              name: "test-group-delete",
            }),
          ],
        })
      )

      const deleteResponse = await api
        .delete(`/admin/customer-groups/${id}`, adminReqConfig)
        .catch((err) => console.log(err))

      expect(deleteResponse.data).toEqual({
        id: id,
        object: "customer_group",
        deleted: true,
      })

      const customerRes = await api.get(
        `/admin/customers/test-customer-delete-cg?expand=groups`,
        adminReqConfig
      )

      expect(customerRes.data.customer).toEqual(
        expect.objectContaining({
          groups: [],
        })
      )
    })
  })

  describe("GET /admin/customer-groups/{id}/customers", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await customerSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists customers in group and count", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/customer-groups/test-group-5/customers", adminReqConfig)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(3)
      expect(response.data.customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-customer-5",
          }),
          expect.objectContaining({
            id: "test-customer-6",
          }),
          expect.objectContaining({
            id: "test-customer-7",
          }),
        ])
      )
    })
  })

  describe("POST /admin/customer-groups/{id}/customers/batch", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await customerSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("adds multiple customers to a group", async () => {
      const api = useApi()

      const payload = {
        customer_ids: [{ id: "test-customer-1" }, { id: "test-customer-2" }],
      }

      const batchAddResponse = await api.post(
        "/admin/customer-groups/customer-group-1/customers/batch",
        payload,
        adminReqConfig
      )

      expect(batchAddResponse.status).toEqual(200)
      expect(batchAddResponse.data.customer_group).toEqual(
        expect.objectContaining({
          name: "vip-customers",
        })
      )

      const getCustomerResponse = await api.get(
        "/admin/customers?expand=groups",
        adminReqConfig
      )

      expect(getCustomerResponse.data.customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-customer-1",
            groups: [
              expect.objectContaining({
                name: "vip-customers",
                id: "customer-group-1",
              }),
            ],
          }),
          expect.objectContaining({
            id: "test-customer-2",
            groups: [
              expect.objectContaining({
                name: "vip-customers",
                id: "customer-group-1",
              }),
            ],
          }),
        ])
      )
    })

    it("presents a descriptive error when presented with a non-existing group", async () => {
      expect.assertions(2)

      const api = useApi()

      const payload = {
        customer_ids: [{ id: "test-customer-1" }, { id: "test-customer-2" }],
      }

      await api
        .post(
          "/admin/customer-groups/non-existing-customer-group-1/customers/batch",
          payload,
          adminReqConfig
        )
        .catch((err) => {
          expect(err.response.data.type).toEqual("not_found")
          expect(err.response.data.message).toEqual(
            "CustomerGroup with id non-existing-customer-group-1 was not found"
          )
        })
    })

    it("adds customers to a group idempotently", async () => {
      expect.assertions(3)

      const api = useApi()

      // add customer-1 to the customer group
      const payload_1 = {
        customer_ids: [{ id: "test-customer-1" }],
      }

      await api
        .post(
          "/admin/customer-groups/customer-group-1/customers/batch",
          payload_1,
          adminReqConfig
        )
        .catch((err) => console.log(err))

      // re-adding customer-1 to the customer group along with new addintion:
      // customer-2 and some non-existing customers should cause the request to fail
      const payload_2 = {
        customer_ids: [
          { id: "test-customer-1" },
          { id: "test-customer-27" },
          { id: "test-customer-28" },
          { id: "test-customer-2" },
        ],
      }

      await api
        .post(
          "/admin/customer-groups/customer-group-1/customers/batch",
          payload_2,
          adminReqConfig
        )
        .catch((err) => {
          expect(err.response.data.type).toEqual("not_found")
          expect(err.response.data.message).toEqual(
            'The following customer ids do not exist: "test-customer-27, test-customer-28"'
          )
        })

      // check that customer-1 is only added once and that customer-2 is added correctly
      const getCustomerResponse = await api.get(
        "/admin/customers?expand=groups",
        adminReqConfig
      )

      expect(getCustomerResponse.data.customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-customer-1",
            groups: [
              expect.objectContaining({
                name: "vip-customers",
                id: "customer-group-1",
              }),
            ],
          }),
          expect.objectContaining({
            id: "test-customer-2",
            groups: [],
          }),
        ])
      )
    })
  })

  describe("POST /admin/customer-groups/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await customerSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("updates group name & metadata", async () => {
      const api = useApi()

      const id = "customer-group-2"

      const body = {
        name: "vip-customers-v2",
        metadata: {
          metaKey1: `metaValue1`,
        },
      }

      const response = await api.post(
        `/admin/customer-groups/${id}`,
        body,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.customer_group).toEqual(
        expect.objectContaining({
          id: "customer-group-2",
          name: "vip-customers-v2",
          metadata: {
            data1: "value1",
            metaKey1: `metaValue1`,
          },
        })
      )
      expect(response.data.customer_group).not.toHaveProperty("customers")
    })

    it("deletes `metadata` nested key", async () => {
      const api = useApi()

      const id = "customer-group-2"
      // already has some metadata initially

      const body = {
        name: "vip-customers-v2",
        metadata: {
          data1: null, // delete
          data2: "val2", // insert
        },
      }

      const response = await api
        .post(
          `/admin/customer-groups/${id}?expand=customers`,
          body,
          adminReqConfig
        )
        .catch(console.log)

      expect(response.status).toEqual(200)
      expect(response.data.customer_group).toEqual(
        expect.objectContaining({
          id: "customer-group-2",
          name: "vip-customers-v2",
          metadata: { data1: null, data2: "val2" },
          customers: [],
        })
      )
    })
  })

  describe("GET /admin/customer-groups", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await customerSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("retreive a list of customer groups", async () => {
      const api = useApi()

      const response = await api
        .get(
          `/admin/customer-groups?limit=5&offset=2&expand=customers&order=created_at`,
          adminReqConfig
        )
        .catch(console.log)

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(7)
      expect(response.data.customer_groups.length).toEqual(5)
      expect(response.data.customer_groups[0]).toEqual(
        expect.objectContaining({ id: "customer-group-3" })
      )
      expect(response.data.customer_groups[0]).toHaveProperty("customers")
    })

    it("retreive a list of customer groups filtered by name using `q` param", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/customer-groups?q=vip-customers`,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.customer_groups).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "customer-group-1" }),
        ])
      )
      expect(response.data.customer_groups[0]).not.toHaveProperty("customers")
    })

    it("lists customers in group filtered by discount condition id and count", async () => {
      const api = useApi()

      const resCustomerGroup = await api.get(
        "/admin/customer-groups",
        adminReqConfig
      )

      const customerGroup1 = resCustomerGroup.data.customer_groups[0]
      const customerGroup2 = resCustomerGroup.data.customer_groups[2]

      const buildDiscountData = (code, conditionId, groups) => {
        return {
          code,
          rule: {
            type: DiscountRuleType.PERCENTAGE,
            value: 10,
            allocation: AllocationType.TOTAL,
            conditions: [
              {
                id: conditionId,
                type: DiscountConditionType.CUSTOMER_GROUPS,
                operator: DiscountConditionOperator.IN,
                customer_groups: groups,
              },
            ],
          },
        }
      }

      const discountConditionId = IdMap.getId(
        "discount-condition-customer-group-1"
      )
      await simpleDiscountFactory(
        dbConnection,
        buildDiscountData("code-1", discountConditionId, [customerGroup1.id])
      )

      const discountConditionId2 = IdMap.getId(
        "discount-condition-customer-group-2"
      )
      await simpleDiscountFactory(
        dbConnection,
        buildDiscountData("code-2", discountConditionId2, [customerGroup2.id])
      )

      let res = await api.get(
        `/admin/customer-groups?discount_condition_id=${discountConditionId}`,
        adminReqConfig
      )

      expect(res.status).toEqual(200)
      expect(res.data.customer_groups).toHaveLength(1)
      expect(res.data.customer_groups).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: customerGroup1.id }),
        ])
      )

      res = await api.get(
        `/admin/customer-groups?discount_condition_id=${discountConditionId2}`,
        adminReqConfig
      )

      expect(res.status).toEqual(200)
      expect(res.data.customer_groups).toHaveLength(1)
      expect(res.data.customer_groups).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: customerGroup2.id }),
        ])
      )

      res = await api.get(`/admin/customer-groups`, adminReqConfig)

      expect(res.status).toEqual(200)
      expect(res.data.customer_groups).toHaveLength(7)
      expect(res.data.customer_groups).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: customerGroup1.id }),
          expect.objectContaining({ id: customerGroup2.id }),
        ])
      )
    })
  })

  describe("GET /admin/customer-groups/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await customerSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("gets customer group", async () => {
      const api = useApi()

      const id = "customer-group-1"

      const response = await api.get(
        `/admin/customer-groups/${id}`,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.customer_group).toEqual(
        expect.objectContaining({
          id: "customer-group-1",
          name: "vip-customers",
        })
      )
      expect(response.data.customer_group).not.toHaveProperty("customers")
    })

    it("gets customer group with `customers` prop", async () => {
      const api = useApi()

      const id = "customer-group-1"

      const response = await api.get(
        `/admin/customer-groups/${id}?expand=customers`,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.customer_group).toEqual(
        expect.objectContaining({
          id: "customer-group-1",
          name: "vip-customers",
        })
      )
      expect(response.data.customer_group.customers).toEqual([])
    })

    it("throws error when a customer group doesn't exist", async () => {
      const api = useApi()

      const id = "test-group-000"

      await api
        .get(`/admin/customer-groups/${id}`, adminReqConfig)
        .catch((err) => {
          expect(err.response.status).toEqual(404)
          expect(err.response.data.type).toEqual("not_found")
          expect(err.response.data.message).toEqual(
            `CustomerGroup with id ${id} was not found`
          )
        })
    })
  })

  describe("DELETE /admin/customer-groups/{id}/batch", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await customerSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("removes multiple customers from a group", async () => {
      const api = useApi()

      const payload = {
        customer_ids: [{ id: "test-customer-5" }, { id: "test-customer-6" }],
      }

      const batchAddResponse = await api
        .delete("/admin/customer-groups/test-group-5/customers/batch", {
          ...adminReqConfig,
          data: payload,
        })
        .catch((err) => console.log(err))

      expect(batchAddResponse.status).toEqual(200)
      expect(batchAddResponse.data).toEqual({
        customer_group: expect.objectContaining({
          id: "test-group-5",
          name: "test-group-5",
        }),
      })

      const getCustomerResponse = await api.get(
        "/admin/customers?expand=groups",
        adminReqConfig
      )

      expect(getCustomerResponse.data.customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-customer-5",
            groups: [],
          }),
          expect.objectContaining({
            id: "test-customer-6",
            groups: [],
          }),
        ])
      )
    })

    it("removes customers from only one group", async () => {
      const api = useApi()

      const payload = {
        customer_ids: [{ id: "test-customer-7" }],
      }

      const batchAddResponse = await api
        .delete("/admin/customer-groups/test-group-5/customers/batch", {
          ...adminReqConfig,
          data: payload,
        })
        .catch((err) => console.log(err))

      expect(batchAddResponse.status).toEqual(200)
      expect(batchAddResponse.data).toEqual({
        customer_group: expect.objectContaining({
          id: "test-group-5",
          name: "test-group-5",
        }),
      })

      const getCustomerResponse = await api.get(
        "/admin/customers/test-customer-7?expand=groups",
        adminReqConfig
      )

      expect(getCustomerResponse.data.customer).toEqual(
        expect.objectContaining({
          id: "test-customer-7",
          groups: [
            expect.objectContaining({
              id: "test-group-6",
              name: "test-group-6",
            }),
          ],
        })
      )
    })

    it("removes only select customers from a group", async () => {
      const api = useApi()

      // re-adding customer-1 to the customer group along with new addintion:
      // customer-2 and some non-existing customers should cause the request to fail
      const payload = {
        customer_ids: [{ id: "test-customer-5" }],
      }

      await api.delete("/admin/customer-groups/test-group-5/customers/batch", {
        ...adminReqConfig,
        data: payload,
      })

      // check that customer-1 is only added once and that customer-2 is added correctly
      const getCustomerResponse = await api
        .get("/admin/customers?expand=groups", adminReqConfig)
        .catch((err) => console.log(err))

      expect(getCustomerResponse.data.customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-customer-5",
            groups: [],
          }),
          expect.objectContaining({
            id: "test-customer-6",
            groups: [
              expect.objectContaining({
                name: "test-group-5",
                id: "test-group-5",
              }),
            ],
          }),
        ])
      )
    })

    it("removes customers from a group idempotently", async () => {
      const api = useApi()

      // re-adding customer-1 to the customer group along with new addintion:
      // customer-2 and some non-existing customers should cause the request to fail
      const payload = {
        customer_ids: [{ id: "test-customer-5" }],
      }

      await api.delete("/admin/customer-groups/test-group-5/customers/batch", {
        ...adminReqConfig,
        data: payload,
      })

      const idempotentRes = await api.delete(
        "/admin/customer-groups/test-group-5/customers/batch",
        {
          ...adminReqConfig,
          data: payload,
        }
      )

      expect(idempotentRes.status).toEqual(200)
      expect(idempotentRes.data).toEqual({
        customer_group: expect.objectContaining({
          id: "test-group-5",
          name: "test-group-5",
        }),
      })
    })
  })
})
