const path = require("path")
const {
  DiscountRule,
  Discount,
  Customer,
  CustomerGroup,
} = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")
const discountSeeder = require("../../helpers/discount-seeder")
const { simpleProductFactory } = require("../../factories")
const {
  simpleDiscountFactory,
} = require("../../factories/simple-discount-factory")

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

  describe("GET /admin/discounts/:id", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await adminSeeder(dbConnection)

      await manager.insert(DiscountRule, {
        id: "test-discount-rule-fixed",
        description: "Test discount rule",
        type: "fixed",
        value: 10,
        allocation: "total",
      })

      const prod = await simpleProductFactory(dbConnection, { type: "pants" })

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount",
        code: "TEST",
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
          conditions: [
            {
              type: "products",
              operator: "in",
              products: [prod.id],
            },
            {
              type: "product_types",
              operator: "not_in",
              product_types: [prod.type_id],
            },
          ],
        },
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should retrieve discount with customer conditions created with factory", async () => {
      const api = useApi()

      const group = await dbConnection.manager.insert(CustomerGroup, {
        id: "customer-group-1",
        name: "vip-customers",
      })

      await dbConnection.manager.insert(Customer, {
        id: "cus_1234",
        email: "oli@email.com",
        groups: [group],
      })

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount",
        code: "TEST",
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
          conditions: [
            {
              type: "customer_groups",
              operator: "in",
              customer_groups: ["customer-group-1"],
            },
          ],
        },
      })

      const response = await api
        .get(
          "/admin/discounts/test-discount?expand=rule,rule.conditions,rule.conditions.customer_groups",
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      const disc = response.data.discount
      expect(response.status).toEqual(200)
      expect(disc).toEqual(
        expect.objectContaining({
          id: "test-discount",
          code: "TEST",
        })
      )
      expect(disc.rule.conditions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "customer_groups",
            operator: "in",
            discount_rule_id: disc.rule.id,
          }),
        ])
      )
    })

    it("should retrieve discount and only select the id field and retrieve the relation parent_discount", async () => {
      const api = useApi()

      const group = await dbConnection.manager.insert(CustomerGroup, {
        id: "customer-group-1",
        name: "vip-customers",
      })

      await dbConnection.manager.insert(Customer, {
        id: "cus_1234",
        email: "oli@email.com",
        groups: [group],
      })

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount",
        code: "TEST",
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
          conditions: [
            {
              type: "customer_groups",
              operator: "in",
              customer_groups: ["customer-group-1"],
            },
          ],
        },
      })

      const response = await api
        .get(
          "/admin/discounts/test-discount?fields=id&expand=parent_discount",
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      const disc = response.data.discount
      expect(response.status).toEqual(200)
      expect(disc).toEqual({
        id: "test-discount",
        parent_discount: null,
      })
    })

    it("should retrieve discount with product conditions created with factory", async () => {
      const api = useApi()

      const response = await api
        .get(
          "/admin/discounts/test-discount?expand=rule,rule.conditions,rule.conditions.products,rule.conditions.product_types",
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      const disc = response.data.discount
      expect(response.status).toEqual(200)
      expect(disc).toEqual(
        expect.objectContaining({
          id: "test-discount",
          code: "TEST",
        })
      )
      expect(disc.rule.conditions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "products",
            operator: "in",
            discount_rule_id: disc.rule.id,
          }),
          expect.objectContaining({
            type: "product_types",
            operator: "not_in",
            discount_rule_id: disc.rule.id,
          }),
        ])
      )
    })
  })

  describe("GET /admin/discounts", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await adminSeeder(dbConnection)
      await manager.insert(DiscountRule, {
        id: "test-discount-rule",
        description: "Test discount rule",
        type: "percentage",
        value: 10,
        allocation: "total",
      })
      await manager.insert(DiscountRule, {
        id: "test-discount-rule-fixed",
        description: "Test discount rule",
        type: "fixed",
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
      await manager.insert(Discount, {
        id: "dynamic-discount",
        code: "Dyn100",
        rule_id: "test-discount-rule",
        is_dynamic: true,
        is_disabled: false,
      })
      await manager.insert(Discount, {
        id: "disabled-discount",
        code: "Dis100",
        rule_id: "test-discount-rule",
        is_dynamic: false,
        is_disabled: true,
      })
      await manager.insert(Discount, {
        id: "fixed-discount",
        code: "fixed100",
        rule_id: "test-discount-rule-fixed",
        is_dynamic: false,
        is_disabled: false,
      })
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

    it("lists fixed discounts", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/discounts?rule[type]=fixed", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.discounts).toEqual([
        expect.objectContaining({
          id: "fixed-discount",
          code: "fixed100",
        }),
      ])
    })

    it("fails when listing invalid discount types", async () => {
      expect.assertions(3)
      const api = useApi()

      await api
        .get("/admin/discounts?rule[type]=blah", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.type).toEqual("invalid_data")
          expect(err.response.data.message).toEqual(
            "type must be a valid enum value"
          )
        })
    })

    it("lists percentage discounts ", async () => {
      const api = useApi()

      const notExpected = expect.objectContaining({
        rule: expect.objectContaining({ type: "fixed" }),
      })

      const response = await api
        .get("/admin/discounts?rule[type]=percentage", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)
      expect(response.data.discounts).toEqual(
        expect.not.arrayContaining([notExpected])
      )
    })

    it("lists dynamic discounts ", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/discounts?is_dynamic=true", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.discounts).toEqual([
        expect.objectContaining({
          id: "dynamic-discount",
          code: "Dyn100",
        }),
      ])
    })

    it("lists disabled discounts ", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/discounts?is_disabled=true", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.discounts).toEqual([
        expect.objectContaining({
          id: "disabled-discount",
          code: "Dis100",
        }),
      ])
    })
  })

  describe("POST /admin/discounts", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await discountSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a discount with a rule", async () => {
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
    })

    it("creates a discount with conditions", async () => {
      const api = useApi()

      const product = await simpleProductFactory(dbConnection, {
        type: "pants",
        tags: ["ss22"],
      })

      const anotherProduct = await simpleProductFactory(dbConnection, {
        type: "blouses",
        tags: ["ss23"],
      })

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
              conditions: [
                {
                  products: [product.id],
                  operator: "in",
                },
                {
                  products: [anotherProduct.id],
                  operator: "not_in",
                },
                {
                  product_types: [product.type_id],
                  operator: "not_in",
                },
                {
                  product_types: [anotherProduct.type_id],
                  operator: "in",
                },
                {
                  product_tags: [product.tags[0].id],
                  operator: "not_in",
                },
                {
                  product_tags: [anotherProduct.tags[0].id],
                  operator: "in",
                },
              ],
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
      expect(response.data.discount.rule.conditions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "products",
            operator: "in",
          }),
          expect.objectContaining({
            type: "products",
            operator: "not_in",
          }),
          expect.objectContaining({
            type: "product_types",
            operator: "not_in",
          }),
          expect.objectContaining({
            type: "product_types",
            operator: "in",
          }),
          expect.objectContaining({
            type: "product_tags",
            operator: "not_in",
          }),
          expect.objectContaining({
            type: "product_tags",
            operator: "in",
          }),
        ])
      )
    })

    it("creates a discount with conditions and updates said conditions", async () => {
      const api = useApi()

      const product = await simpleProductFactory(dbConnection, {
        type: "pants",
      })

      const anotherProduct = await simpleProductFactory(dbConnection, {
        type: "pants",
      })

      const response = await api
        .post(
          "/admin/discounts?expand=rule,rule.conditions",
          {
            code: "HELLOWORLD",
            rule: {
              description: "test",
              type: "percentage",
              value: 10,
              allocation: "total",
              conditions: [
                {
                  products: [product.id],
                  operator: "in",
                },
                {
                  product_types: [product.type_id],
                  operator: "not_in",
                },
              ],
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
      expect(response.data.discount.rule.conditions).toEqual([
        expect.objectContaining({
          type: "products",
          operator: "in",
        }),
        expect.objectContaining({
          type: "product_types",
          operator: "not_in",
        }),
      ])

      const createdRule = response.data.discount.rule
      const condsToUpdate = createdRule.conditions[0]

      const updated = await api
        .post(
          `/admin/discounts/${response.data.discount.id}?expand=rule,rule.conditions,rule.conditions.products`,
          {
            rule: {
              id: createdRule.id,
              value: createdRule.value,
              allocation: createdRule.allocation,
              conditions: [
                {
                  id: condsToUpdate.id,
                  operator: "not_in",
                  products: [product.id, anotherProduct.id],
                },
              ],
            },
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
      expect(updated.data.discount.rule.conditions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "products",
            operator: "not_in",
            products: expect.arrayContaining([
              expect.objectContaining({
                id: product.id,
              }),
              expect.objectContaining({
                id: anotherProduct.id,
              }),
            ]),
          }),
          expect.objectContaining({
            type: "product_types",
            operator: "not_in",
          }),
        ])
      )
    })

    it("fails to add condition on rule with existing comb. of type and operator", async () => {
      const api = useApi()

      const product = await simpleProductFactory(dbConnection, {
        type: "pants",
      })

      const anotherProduct = await simpleProductFactory(dbConnection, {
        type: "pants",
      })

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
              conditions: [
                {
                  products: [product.id],
                  operator: "in",
                },
              ],
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

      const createdRule = response.data.discount.rule

      await expect(
        api
          .post(
            `/admin/discounts/${response.data.discount.id}?expand=rule,rule.conditions,rule.conditions.products`,
            {
              rule: {
                id: createdRule.id,
                value: createdRule.value,
                conditions: [
                  {
                    products: [anotherProduct.id],
                    operator: "in",
                  },
                ],
              },
            },
            {
              headers: {
                Authorization: "Bearer test_token",
              },
            }
          )
          .catch((err) => err.response.data)
      ).resolves.toMatchSnapshot()
    })

    it("fails if multiple types of resources are provided on create", async () => {
      const api = useApi()

      const product = await simpleProductFactory(dbConnection, {
        type: "pants",
      })

      try {
        await api.post(
          "/admin/discounts",
          {
            code: "HELLOWORLD",
            rule: {
              description: "test",
              type: "percentage",
              value: 10,
              allocation: "total",
              conditions: [
                {
                  products: [product.id],
                  product_types: [product.type_id],
                  operator: "in",
                },
              ],
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
        expect(error.response.data.type).toEqual("invalid_data")
        expect(error.response.data.message).toEqual(
          "Only one of products, product_types is allowed, Only one of product_types, products is allowed"
        )
      }
    })

    it("fails if multiple types of resources are provided on update", async () => {
      const api = useApi()

      const product = await simpleProductFactory(dbConnection, {
        type: "pants",
      })

      const anotherProduct = await simpleProductFactory(dbConnection, {
        type: "pants",
      })

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
              conditions: [
                {
                  products: [product.id],
                  operator: "in",
                },
              ],
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

      const createdRule = response.data.discount.rule

      await expect(
        api
          .post(
            `/admin/discounts/${response.data.discount.id}?expand=rule,rule.conditions,rule.conditions.products`,
            {
              rule: {
                id: createdRule.id,
                value: createdRule.value,
                allocation: createdRule.allocation,
                conditions: [
                  {
                    products: [anotherProduct.id],
                    product_types: [product.type_id],
                    operator: "in",
                  },
                ],
              },
            },
            {
              headers: {
                Authorization: "Bearer test_token",
              },
            }
          )
          .catch((err) => err.response.data)
      ).resolves.toMatchSnapshot()
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

    it("creates a discount and fails to update it because attempting type update", async () => {
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

      await api
        .post(
          `/admin/discounts/${response.data.discount.id}`,
          {
            usage_limit: 20,
            rule: {
              id: response.data.discount.rule.id,
              type: "free_shipping",
            },
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.message).toEqual(
            "property type should not exist"
          )
        })
    })

    it("creates a discount and fails to update it because attempting is_dynamic update", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/admin/discounts",
          {
            code: "HELLOWORLD",
            is_dynamic: true,
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
          is_dynamic: true,
        })
      )

      await api
        .post(
          `/admin/discounts/${response.data.discount.id}`,
          {
            usage_limit: 20,
            is_dynamic: false,
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.message).toEqual(
            "property is_dynamic should not exist"
          )
        })
    })

    it("automatically sets the code to an uppercase string on update", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/admin/discounts",
          {
            code: "HELLOworld",
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
            code: "HELLOWORLD_test",
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
          code: "HELLOWORLD_TEST",
          usage_limit: 20,
        })
      )
    })

    it("creates a dynamic discount and updates it", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/admin/discounts",
          {
            code: "HELLOWORLD_DYNAMIC",
            is_dynamic: true,
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
          code: "HELLOWORLD_DYNAMIC",
          usage_limit: 10,
          is_dynamic: true,
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
          code: "HELLOWORLD_DYNAMIC",
          usage_limit: 20,
          is_dynamic: true,
        })
      )
    })

    it("fails to create a fixed discount with multiple regions", async () => {
      expect.assertions(2)
      const api = useApi()

      await api
        .post(
          "/admin/discounts",
          {
            code: "HELLOWORLD",
            is_dynamic: true,
            rule: {
              description: "test",
              type: "fixed",
              value: 10,
              allocation: "total",
            },
            usage_limit: 10,
            regions: ["test-region", "test-region-2"],
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.message).toEqual(
            `Fixed discounts can have one region`
          )
        })
    })

    it("fails to update a fixed discount with multiple regions", async () => {
      expect.assertions(2)
      const api = useApi()

      const response = await api
        .post(
          "/admin/discounts",
          {
            code: "HELLOWORLD",
            rule: {
              description: "test",
              type: "fixed",
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

      await api
        .post(
          `/admin/discounts/${response.data.discount.id}`,
          {
            regions: ["test-region", "test-region-2"],
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )

        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.message).toEqual(
            `Fixed discounts can have one region`
          )
        })
    })

    it("fails to add a region to a fixed discount with an existing region", async () => {
      expect.assertions(2)
      const api = useApi()

      const response = await api
        .post(
          "/admin/discounts",
          {
            code: "HELLOWORLD",
            rule: {
              description: "test",
              type: "fixed",
              value: 10,
              allocation: "total",
            },
            usage_limit: 10,
            regions: ["test-region"],
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

      await api
        .post(
          `/admin/discounts/${response.data.discount.id}/regions/test-region-2`,
          {},
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )

        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.message).toEqual(
            `Fixed discounts can have one region`
          )
        })
    })

    it("creates a discount with start and end dates", async () => {
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
            starts_at: new Date("09/15/2021 11:50"),
            ends_at: new Date("09/15/2021 17:50"),
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
          starts_at: expect.any(String),
          ends_at: expect.any(String),
        })
      )

      expect(new Date(response.data.discount.starts_at)).toEqual(
        new Date("09/15/2021 11:50")
      )

      expect(new Date(response.data.discount.ends_at)).toEqual(
        new Date("09/15/2021 17:50")
      )

      const updated = await api
        .post(
          `/admin/discounts/${response.data.discount.id}`,
          {
            usage_limit: 20,
            starts_at: new Date("09/14/2021 11:50"),
            ends_at: new Date("09/17/2021 17:50"),
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
          starts_at: expect.any(String),
          ends_at: expect.any(String),
        })
      )

      expect(new Date(updated.data.discount.starts_at)).toEqual(
        new Date("09/14/2021 11:50")
      )

      expect(new Date(updated.data.discount.ends_at)).toEqual(
        new Date("09/17/2021 17:50")
      )
    })

    it("fails to update end date to a date before start date", async () => {
      expect.assertions(6)

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
            starts_at: new Date("09/15/2021 11:50"),
            ends_at: new Date("09/15/2021 17:50"),
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
          starts_at: expect.any(String),
          ends_at: expect.any(String),
        })
      )

      expect(new Date(response.data.discount.starts_at)).toEqual(
        new Date("09/15/2021 11:50")
      )

      expect(new Date(response.data.discount.ends_at)).toEqual(
        new Date("09/15/2021 17:50")
      )

      await api
        .post(
          `/admin/discounts/${response.data.discount.id}`,
          {
            usage_limit: 20,
            ends_at: new Date("09/11/2021 17:50"),
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.message).toEqual(
            `"ends_at" must be greater than "starts_at"`
          )
        })
    })

    it("fails to create discount with end date before start date", async () => {
      expect.assertions(2)
      const api = useApi()

      await api
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
            starts_at: new Date("09/15/2021 11:50"),
            ends_at: new Date("09/14/2021 17:50"),
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data).toEqual(
            expect.objectContaining({
              message: `"ends_at" must be greater than "starts_at"`,
            })
          )
        })
    })
  })

  describe("testing for soft-deletion + uniqueness on discount codes", () => {
    let manager
    beforeEach(async () => {
      manager = dbConnection.manager
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
        expect(error.response.data.message).toEqual(
          "Discount with code TESTING already exists."
        )
      }
    })
  })

  describe("POST /admin/discounts/:discount_id/dynamic-codes", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager

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
        valid_duration: "P2Y",
      })
      await manager.insert(DiscountRule, {
        id: "test-discount-rule1",
        description: "Dynamic rule",
        type: "percentage",
        value: 10,
        allocation: "total",
      })
      await manager.insert(Discount, {
        id: "test-discount1",
        code: "DYNAMICCode",
        is_dynamic: true,
        is_disabled: false,
        rule_id: "test-discount-rule1",
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a dynamic discount with ends_at", async () => {
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
      expect(response.data.discount).toEqual(
        expect.objectContaining({
          code: "HELLOWORLD",
          ends_at: expect.any(String),
        })
      )
    })

    it("creates a dynamic discount without ends_at", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/admin/discounts/test-discount1/dynamic-codes",
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
      expect(response.data.discount).toEqual(
        expect.objectContaining({
          code: "HELLOWORLD",
          ends_at: null,
        })
      )
    })
  })

  describe("DELETE /admin/discounts/:id/conditions/:condition_id", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await adminSeeder(dbConnection)

      await manager.insert(DiscountRule, {
        id: "test-discount-rule-fixed",
        description: "Test discount rule",
        type: "fixed",
        value: 10,
        allocation: "total",
      })

      const prod = await simpleProductFactory(dbConnection, { type: "pants" })

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount",
        code: "TEST",
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
          conditions: [
            {
              type: "products",
              operator: "in",
              products: [prod.id],
            },
          ],
        },
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should delete condition", async () => {
      const api = useApi()

      const group = await dbConnection.manager.insert(CustomerGroup, {
        id: "customer-group-1",
        name: "vip-customers",
      })

      await dbConnection.manager.insert(Customer, {
        id: "cus_1234",
        email: "oli@email.com",
        groups: [group],
      })

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount",
        code: "TEST",
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
          conditions: [
            {
              id: "test-condition",
              type: "customer_groups",
              operator: "in",
              customer_groups: ["customer-group-1"],
            },
          ],
        },
      })

      const response = await api
        .delete("/admin/discounts/test-discount/conditions/test-condition", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const disc = response.data

      expect(response.status).toEqual(200)
      expect(disc).toEqual(
        expect.objectContaining({
          id: "test-condition",
          deleted: true,
          object: "discount-condition",
        })
      )
    })

    it("should not fail if condition does not exist", async () => {
      const api = useApi()

      const response = await api
        .delete("/admin/discounts/test-discount/conditions/test-condition", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const disc = response.data

      expect(response.status).toEqual(200)
      expect(disc).toEqual(
        expect.objectContaining({
          id: "test-condition",
          deleted: true,
          object: "discount-condition",
        })
      )
    })

    it("should fail if discount does not exist", async () => {
      const api = useApi()

      try {
        await api.delete(
          "/admin/discounts/not-exist/conditions/test-condition",
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
      } catch (error) {
        expect(error.message).toMatchSnapshot(
          "Discount with id not-exist was not found"
        )
      }
    })
  })

  describe("POST /admin/discounts/:id/conditions", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await adminSeeder(dbConnection)

      await manager.insert(DiscountRule, {
        id: "test-discount-rule-fixed",
        description: "Test discount rule",
        type: "fixed",
        value: 10,
        allocation: "total",
      })

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount",
        code: "TEST",
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
        },
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should create a condition", async () => {
      const api = useApi()

      const prod = await simpleProductFactory(dbConnection, { type: "pants" })

      const response = await api
        .post(
          "/admin/discounts/test-discount/conditions",
          {
            operator: "in",
            products: [prod.id],
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

      const disc = response.data.discount

      expect(response.status).toEqual(200)
      expect(disc).toMatchSnapshot({
        id: "test-discount",
        code: "TEST",
        created_at: expect.any(String),
        updated_at: expect.any(String),
        rule_id: expect.any(String),
        starts_at: expect.any(String),
        rule: {
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          conditions: [
            {
              id: expect.any(String),
              discount_rule_id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
        },
      })
    })

    it("fails if more than one condition type is provided", async () => {
      const api = useApi()

      const prod = await simpleProductFactory(dbConnection, { type: "pants" })

      const group = await dbConnection.manager.insert(CustomerGroup, {
        id: "customer-group-1",
        name: "vip-customers",
      })

      await dbConnection.manager.insert(Customer, {
        id: "cus_1234",
        email: "oli@email.com",
        groups: [group],
      })

      try {
        await api.post(
          "/admin/discounts/test-discount/conditions",
          {
            operator: "in",
            products: [prod.id],
            customer_groups: ["customer-group-1"],
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
      } catch (error) {
        expect(error.message).toMatchSnapshot(
          "Only one of products, customer_groups is allowed, Only one of customer_groups, products is allowed"
        )
      }
    })

    it("throws if discount does not exist", async () => {
      expect.assertions(1)

      const api = useApi()

      const prod2 = await simpleProductFactory(dbConnection, { type: "pants" })

      try {
        await api.post(
          "/admin/discounts/does-not-exist/conditions/test-condition",
          {
            products: [prod2.id],
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
      } catch (error) {
        expect(error.message).toMatchSnapshot(
          "Discount with id does-not-exist was not found"
        )
      }
    })
  })

  describe("POST /admin/discounts/:id/conditions/:condition_id", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await adminSeeder(dbConnection)

      await manager.insert(DiscountRule, {
        id: "test-discount-rule-fixed",
        description: "Test discount rule",
        type: "fixed",
        value: 10,
        allocation: "total",
      })

      const prod = await simpleProductFactory(dbConnection, { type: "pants" })

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount",
        code: "TEST",
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
          conditions: [
            {
              id: "test-condition",
              type: "products",
              operator: "in",
              products: [prod.id],
            },
          ],
        },
      })

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount-2",
        code: "TEST2",
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
        },
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should update a condition", async () => {
      const api = useApi()

      const prod2 = await simpleProductFactory(dbConnection, {
        id: "test-product",
        type: "pants",
      })

      const discount = await api
        .get("/admin/discounts/test-discount", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const cond = discount.data.discount.rule.conditions[0]

      const response = await api
        .post(
          `/admin/discounts/test-discount/conditions/${cond.id}?expand=rule,rule.conditions,rule.conditions.products`,
          {
            products: [prod2.id],
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

      const disc = response.data.discount

      expect(response.status).toEqual(200)
      expect(disc).toMatchSnapshot({
        id: "test-discount",
        code: "TEST",
        created_at: expect.any(String),
        updated_at: expect.any(String),
        rule_id: expect.any(String),
        starts_at: expect.any(String),
        rule: {
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          conditions: [
            {
              id: expect.any(String),
              discount_rule_id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              products: [
                {
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  profile_id: expect.any(String),
                  type_id: expect.any(String),
                  id: "test-product",
                },
              ],
            },
          ],
        },
      })
    })

    it("throws if condition does not exist", async () => {
      const api = useApi()

      const prod2 = await simpleProductFactory(dbConnection, { type: "pants" })

      try {
        await api.post(
          "/admin/discounts/test-discount/conditions/does-not-exist",
          {
            products: [prod2.id],
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
      } catch (error) {
        expect(error.message).toMatchSnapshot(
          "DiscountCondition with id does-not-exist was not found for Discount test-discount"
        )
      }
    })

    it("throws if discount does not exist", async () => {
      expect.assertions(1)

      const api = useApi()

      const prod2 = await simpleProductFactory(dbConnection, { type: "pants" })

      try {
        await api.post(
          "/admin/discounts/does-not-exist/conditions/test-condition",
          {
            products: [prod2.id],
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
      } catch (error) {
        expect(error.message).toMatchSnapshot(
          "Discount with id does-not-exist was not found"
        )
      }
    })

    it("throws if condition does not belong to discount", async () => {
      const api = useApi()

      const prod2 = await simpleProductFactory(dbConnection, { type: "pants" })

      try {
        await api.post(
          "/admin/discounts/test-discount-2/conditions/test-condition",
          {
            products: [prod2.id],
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
      } catch (error) {
        expect(error.message).toMatchSnapshot(
          "DiscountCondition with id test-condition was not found for Discount test-discount-2"
        )
      }
    })
  })

  describe("GET /admin/discounts/:id/conditions/:condition_id", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
      } catch (err) {
        console.log(err)
      }

      const prod = await simpleProductFactory(dbConnection, {
        type: "pants",
        id: "test-product",
      })

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount",
        code: "TEST",
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
          conditions: [
            {
              id: "test-condition",
              type: "products",
              operator: "in",
              products: [prod.id],
            },
          ],
        },
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should get condition", async () => {
      const api = useApi()

      const discountCondition = await api
        .get("/admin/discounts/test-discount/conditions/test-condition", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const cond = discountCondition.data.discount_condition

      expect(discountCondition.status).toEqual(200)
      expect(cond).toMatchSnapshot({
        id: "test-condition",
        type: "products",
        operator: "in",
        created_at: expect.any(String),
        updated_at: expect.any(String),
        discount_rule_id: expect.any(String),
        discount_rule: {
          id: expect.any(String),
          updated_at: expect.any(String),
          created_at: expect.any(String),
        },
      })
    })

    it("should get condition with expand + fields", async () => {
      const api = useApi()

      const discountCondition = await api
        .get(
          "/admin/discounts/test-discount/conditions/test-condition?expand=products&fields=id,type",
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      const cond = discountCondition.data.discount_condition

      expect(discountCondition.status).toEqual(200)
      expect(cond).toMatchSnapshot({
        id: "test-condition",
        type: "products",
        products: [
          {
            id: "test-product",
            profile_id: expect.any(String),
            type_id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
      })
    })

    it("throws if condition does not exist", async () => {
      const api = useApi()

      const prod2 = await simpleProductFactory(dbConnection, { type: "pants" })

      try {
        await api.post(
          "/admin/discounts/test-discount/conditions/does-not-exist",
          {
            products: [prod2.id],
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
      } catch (error) {
        expect(error.message).toMatchSnapshot(
          "DiscountCondition with id test-condition was not found"
        )
      }
    })

    it("throws if condition does not belong to discount", async () => {
      const api = useApi()

      const prod2 = await simpleProductFactory(dbConnection, { type: "pants" })

      try {
        await api.post(
          "/admin/discounts/test-discount-2/conditions/test-condition",
          {
            products: [prod2.id],
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
      } catch (error) {
        expect(error.message).toMatchSnapshot(
          "DiscountCondition with id test-condition was not found for Discount test-discount-2"
        )
      }
    })
  })
})
