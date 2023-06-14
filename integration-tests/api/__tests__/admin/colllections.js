const path = require("path")
const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const productSeeder = require("../../helpers/product-seeder")
const adminSeeder = require("../../helpers/admin-seeder")
const {
  DiscountRuleType,
  AllocationType,
  DiscountConditionType,
  DiscountConditionOperator,
} = require("@medusajs/medusa")
const { IdMap } = require("medusa-test-utils")
const {
  simpleDiscountFactory,
  simpleSalesChannelFactory,
} = require("../../factories")

jest.setTimeout(30000)

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("/admin/collections", () => {
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

  describe("/admin/collections/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await productSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("updates a collection", async () => {
      const api = useApi()

      const creationResponse = await api.post(
        "/admin/collections",
        {
          title: "test",
        },
        { headers: { Authorization: "Bearer test_token" } }
      )

      const response = await api.post(
        `/admin/collections/${creationResponse.data.collection.id}`,
        {
          title: "test collection creation",
          handle: "test-handle-creation",
        },
        { headers: { Authorization: "Bearer test_token" } }
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual(
        expect.objectContaining({
          collection: expect.objectContaining({
            id: expect.stringMatching(/^pcol_*/),
            title: "test collection creation",
            handle: "test-handle-creation",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        })
      )
    })

    it("deletes a collection", async () => {
      const api = useApi()

      const creationResponse = await api.post(
        "/admin/collections",
        {
          title: "test",
        },
        { headers: { Authorization: "Bearer test_token" } }
      )

      const response = await api.delete(
        `/admin/collections/${creationResponse.data.collection.id}`,
        { headers: { Authorization: "Bearer test_token" } }
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id: creationResponse.data.collection.id,
        object: "product-collection",
        deleted: true,
      })
    })

    it("gets collection", async () => {
      const api = useApi()

      const response = await api.get("/admin/collections/test-collection", {
        headers: { Authorization: "Bearer test_token" },
      })

      expect(response.data).toEqual(
        expect.objectContaining({
          collection: expect.objectContaining({
            id: "test-collection",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            products: expect.arrayContaining([
              expect.objectContaining({
                collection_id: "test-collection",
                created_at: expect.any(String),
                updated_at: expect.any(String),
                profile_id: expect.stringMatching(/^sp_*/),
              }),
              expect.objectContaining({
                collection_id: "test-collection",
                created_at: expect.any(String),
                updated_at: expect.any(String),
                profile_id: expect.stringMatching(/^sp_*/),
              }),
            ]),
          }),
        })
      )
    })
  })

  describe("/admin/collections", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await productSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a collection", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/collections",
        {
          title: "test collection creation",
          handle: "test-handle-creation",
        },
        { headers: { Authorization: "Bearer test_token" } }
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual(
        expect.objectContaining({
          collection: expect.objectContaining({
            id: expect.stringMatching(/^pcol_*/),
            title: "test collection creation",
            handle: "test-handle-creation",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        })
      )
    })

    it("lists collections", async () => {
      const api = useApi()

      const response = await api.get("/admin/collections", {
        headers: { Authorization: "Bearer test_token" },
      })

      expect(response.data).toEqual(
        expect.objectContaining({
          count: 3,
          collections: expect.arrayContaining([
            expect.objectContaining({
              id: "test-collection2",
              handle: "test-collection2",
              title: "Test collection 2",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              products: expect.arrayContaining([
                expect.objectContaining({
                  collection_id: "test-collection2",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  profile_id: expect.stringMatching(/^sp_*/),
                }),
              ]),
            }),
            expect.objectContaining({
              id: "test-collection1",
              handle: "test-collection1",
              title: "Test collection 1",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              products: expect.arrayContaining([
                expect.objectContaining({
                  collection_id: "test-collection1",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  profile_id: expect.stringMatching(/^sp_*/),
                }),
                expect.objectContaining({
                  collection_id: "test-collection1",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  profile_id: expect.stringMatching(/^sp_*/),
                }),
              ]),
            }),
            expect.objectContaining({
              id: "test-collection",
              handle: "test-collection",
              title: "Test collection",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              products: expect.arrayContaining([
                expect.objectContaining({
                  collection_id: "test-collection",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  profile_id: expect.stringMatching(/^sp_*/),
                }),
                expect.objectContaining({
                  collection_id: "test-collection",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  profile_id: expect.stringMatching(/^sp_*/),
                }),
              ]),
            }),
          ]),
        })
      )
    })

    it("adds products to collection", async () => {
      const api = useApi()

      // adds product test-product-filterid-1
      const response = await api
        .post(
          "/admin/collections/test-collection/products/batch",
          {
            product_ids: ["test-product_filtering_1"],
          },
          {
            headers: { Authorization: "Bearer test_token" },
          }
        )
        .catch((err) => console.warn(err))

      expect(response.data).toEqual(
        expect.objectContaining({
          collection: expect.objectContaining({
            id: "test-collection",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            products: expect.arrayContaining([
              expect.objectContaining({
                collection_id: "test-collection",
                id: "test-product",
                created_at: expect.any(String),
                updated_at: expect.any(String),
                profile_id: expect.stringMatching(/^sp_*/),
              }),
              expect.objectContaining({
                collection_id: "test-collection",
                id: "test-product_filtering_1",
                created_at: expect.any(String),
                updated_at: expect.any(String),
                profile_id: expect.stringMatching(/^sp_*/),
              }),
              expect.objectContaining({
                collection_id: "test-collection",
                id: "test-product1",
                created_at: expect.any(String),
                updated_at: expect.any(String),
                profile_id: expect.stringMatching(/^sp_*/),
              }),
            ]),
          }),
        })
      )

      expect(response.status).toEqual(200)
    })

    it("removes products from collection", async () => {
      const api = useApi()

      const response = await api
        .delete("/admin/collections/test-collection/products/batch", {
          headers: { Authorization: "Bearer test_token" },
          data: { product_ids: ["test-product"] },
        })
        .catch((err) => console.warn(err))

      expect(response.data).toEqual(
        expect.objectContaining({
          id: "test-collection",
          object: "product-collection",
          removed_products: ["test-product"],
        })
      )

      expect(response.status).toEqual(200)
    })

    it("filters collections by title", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/collections?title=Test%20collection", {
          headers: { Authorization: "Bearer test_token" },
        })
        .catch((err) => console.log(err))

      expect(response.data).toEqual(
        expect.objectContaining({
          count: 1,
          limit: 10,
          offset: 0,
          collections: expect.arrayContaining([
            expect.objectContaining({
              id: "test-collection",
              handle: "test-collection",
              title: "Test collection",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              products: expect.arrayContaining([
                expect.objectContaining({
                  collection_id: "test-collection",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  profile_id: expect.stringMatching(/^sp_*/),
                }),
                expect.objectContaining({
                  collection_id: "test-collection",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  profile_id: expect.stringMatching(/^sp_*/),
                }),
              ]),
            }),
          ]),
        })
      )
    })

    it("returns a list of collections filtered by discount condition id", async () => {
      const api = useApi()

      const resCollections = await api.get("/admin/collections", adminReqConfig)

      const collection1 = resCollections.data.collections[0]
      const collection2 = resCollections.data.collections[1]

      const buildDiscountData = (code, conditionId, collections) => {
        return {
          code,
          rule: {
            type: DiscountRuleType.PERCENTAGE,
            value: 10,
            allocation: AllocationType.TOTAL,
            conditions: [
              {
                id: conditionId,
                type: DiscountConditionType.PRODUCT_COLLECTIONS,
                operator: DiscountConditionOperator.IN,
                product_collections: collections,
              },
            ],
          },
        }
      }

      const discountConditionId = IdMap.getId("discount-condition-type-1")
      await simpleDiscountFactory(
        dbConnection,
        buildDiscountData("code-1", discountConditionId, [collection1.id])
      )

      const discountConditionId2 = IdMap.getId("discount-condition-type-2")
      await simpleDiscountFactory(
        dbConnection,
        buildDiscountData("code-2", discountConditionId2, [collection2.id])
      )

      let res = await api.get(
        `/admin/collections?discount_condition_id=${discountConditionId}`,
        adminReqConfig
      )

      expect(res.status).toEqual(200)
      expect(res.data.collections).toHaveLength(1)
      expect(res.data.collections).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: collection1.id }),
        ])
      )

      res = await api.get(
        `/admin/collections?discount_condition_id=${discountConditionId2}`,
        adminReqConfig
      )

      expect(res.status).toEqual(200)
      expect(res.data.collections).toHaveLength(1)
      expect(res.data.collections).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: collection2.id }),
        ])
      )

      res = await api.get(`/admin/collections`, adminReqConfig)

      expect(res.status).toEqual(200)
      expect(res.data.collections).toHaveLength(3)
      expect(res.data.collections).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: collection1.id }),
          expect.objectContaining({ id: collection2.id }),
        ])
      )
    })
  })
})
