const path = require("path")
const { Region, DiscountRule, Discount } = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/discounts", () => {
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

  describe("GET /admin/discounts", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      try {
        await adminSeeder(dbConnection)
        await manager.insert(DiscountRule, {
          id: "test-discount-rule",
          description: "Test discount rule",
          type: "percentage",
          value: 10,
          allocation: "total",
        })
        await manager.insert(Discount, {
          id: "test-discount",
          code: "TESTING",
          rule_id: "test-discount-rule",
          is_dynamic: false,
          is_disabled: false,
        })
        await manager.insert(Discount, {
          id: "messi-discount",
          code: "BARCA100",
          rule_id: "test-discount-rule",
          is_dynamic: false,
          is_disabled: false,
        })
      } catch (err) {
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should list discounts that match a specific query in a case insensitive manner", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/discounts?q=barca", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.discounts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "messi-discount",
            code: "BARCA100",
          }),
        ])
      )
    })
  })

  describe("POST /admin/discounts", () => {
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

    it("creates a discount and updates it", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/admin/discounts",
          {
            code: "HELLOWORLD",
            rule: {
              description: "test",
              type: "percentage",
              value: 10,
              allocation: "total",
            },
            usage_limit: 10,
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
      expect(response.data.discount).toEqual(
        expect.objectContaining({
          code: "HELLOWORLD",
          usage_limit: 10,
        })
      )

      const updated = await api
        .post(
          `/admin/discounts/${response.data.discount.id}`,
          {
            usage_limit: 20,
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

      expect(updated.status).toEqual(200)
      expect(updated.data.discount).toEqual(
        expect.objectContaining({
          code: "HELLOWORLD",
          usage_limit: 20,
        })
      )
    })
  })

  describe("testing for soft-deletion + uniqueness on discount codes", () => {
    let manager
    beforeEach(async () => {
      manager = dbConnection.manager
      try {
        await adminSeeder(dbConnection)
        await manager.insert(DiscountRule, {
          id: "test-discount-rule",
          description: "Test discount rule",
          type: "percentage",
          value: 10,
          allocation: "total",
        })
        await manager.insert(Discount, {
          id: "test-discount",
          code: "TESTING",
          rule_id: "test-discount-rule",
          is_dynamic: false,
          is_disabled: false,
        })
      } catch (err) {
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("successfully creates discount with soft-deleted discount code", async () => {
      const api = useApi()

      // First we soft-delete the discount
      await api
        .delete("/admin/discounts/test-discount", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      // Lets try to create a discount with same code as deleted one
      const response = await api
        .post(
          "/admin/discounts",
          {
            code: "TESTING",
            rule: {
              description: "test",
              type: "percentage",
              value: 10,
              allocation: "total",
            },
            usage_limit: 10,
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
      expect(response.data.discount).toEqual(
        expect.objectContaining({
          code: "TESTING",
          usage_limit: 10,
        })
      )
    })

    it("should fails when creating a discount with already existing code", async () => {
      const api = useApi()

      // Lets try to create a discount with same code as deleted one
      try {
        await api.post(
          "/admin/discounts",
          {
            code: "TESTING",
            rule: {
              description: "test",
              type: "percentage",
              value: 10,
              allocation: "total",
            },
            usage_limit: 10,
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
      } catch (error) {
        expect(error.response.data.message).toMatch(
          /duplicate key value violates unique constraint/i
        )
      }
    })
  })

  describe("POST /admin/discounts/:discount_id/dynamic-codes", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      try {
        await adminSeeder(dbConnection)
        await manager.insert(DiscountRule, {
          id: "test-discount-rule",
          description: "Dynamic rule",
          type: "percentage",
          value: 10,
          allocation: "total",
        })
        await manager.insert(Discount, {
          id: "test-discount",
          code: "DYNAMIC",
          is_dynamic: true,
          is_disabled: false,
          rule_id: "test-discount-rule",
        })
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a dynamic discount", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/admin/discounts/test-discount/dynamic-codes",
          {
            code: "HELLOWORLD",
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
    })
  })
})
