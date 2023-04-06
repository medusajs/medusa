const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")
const productSeeder = require("../../helpers/product-seeder")

const {
  ProductVariant,
  ProductOptionValue,
  MoneyAmount,
  DiscountConditionType,
  DiscountConditionOperator,
} = require("@medusajs/medusa")
const priceListSeeder = require("../../helpers/price-list-seeder")
const {
  simpleProductFactory,
  simpleDiscountFactory,
  simpleSalesChannelFactory,
  simpleRegionFactory,
} = require("../../factories")
const { DiscountRuleType, AllocationType } = require("@medusajs/medusa/dist")
const { IdMap } = require("medusa-test-utils")

jest.setTimeout(50000)

const testProductId = "test-product"
const testProduct1Id = "test-product1"
const testProductFilteringId1 = "test-product_filtering_1"
const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("/admin/products", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({
      cwd,
      env: { MEDUSA_FF_PRODUCT_CATEGORIES: true },
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/products", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)

      await simpleSalesChannelFactory(dbConnection, {
        name: "Default channel",
        id: "default-channel",
        is_default: true,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns a list of products with all statuses when no status or invalid status is provided", async () => {
      const api = useApi()

      const res = await api
        .get("/admin/products", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(res.status).toEqual(200)
      expect(res.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product",
            status: "draft",
          }),
          expect.objectContaining({
            id: "test-product1",
            status: "draft",
          }),
        ])
      )
    })

    it("returns a list of all products when no query is provided", async () => {
      const api = useApi()

      const res = await api
        .get("/admin/products?q=", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(res.status).toEqual(200)
      expect(res.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product",
            status: "draft",
          }),
          expect.objectContaining({
            id: "test-product1",
            status: "draft",
          }),
        ])
      )
    })

    it("returns a list of products where status is proposed", async () => {
      const api = useApi()

      const payload = {
        status: "proposed",
      }

      // update test-product status to proposed
      await api
        .post("/admin/products/test-product", payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      const response = await api
        .get("/admin/products?status[]=proposed", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product",
            status: "proposed",
          }),
        ])
      )
    })

    it("returns a list of products where status is proposed or published", async () => {
      const api = useApi()

      const notExpected = [
        expect.objectContaining({ status: "draft" }),
        expect.objectContaining({ status: "rejected" }),
        expect.objectContaining({
          id: "test-product_filtering_4",
        }),
      ]

      const response = await api
        .get("/admin/products?status[]=published,proposed", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(2)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product_filtering_1",
            status: "proposed",
          }),
          expect.objectContaining({
            id: "test-product_filtering_2",
            status: "published",
          }),
        ])
      )

      for (const notExpect of notExpected) {
        expect(response.data.products).toEqual(
          expect.not.arrayContaining([notExpect])
        )
      }
    })

    it("returns a list of products where type_id is test-type", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/products?type_id[]=test-type", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(5)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type_id: "test-type",
          }),
        ])
      )
    })

    it("returns a list of products filtered by discount condition id", async () => {
      const api = useApi()

      const resProd = await api.get("/admin/products", adminHeaders)

      const prod1 = resProd.data.products[0]
      const prod2 = resProd.data.products[2]

      const buildDiscountData = (code, conditionId, products) => {
        return {
          code,
          rule: {
            type: DiscountRuleType.PERCENTAGE,
            value: 10,
            allocation: AllocationType.TOTAL,
            conditions: [
              {
                id: conditionId,
                type: DiscountConditionType.PRODUCTS,
                operator: DiscountConditionOperator.IN,
                product_tags: products,
              },
            ],
          },
        }
      }

      const discountConditionId = IdMap.getId("discount-condition-prod-1")
      await simpleDiscountFactory(
        dbConnection,
        buildDiscountData("code-1", discountConditionId, [prod1.id])
      )

      const discountConditionId2 = IdMap.getId("discount-condition-prod-2")
      await simpleDiscountFactory(
        dbConnection,
        buildDiscountData("code-2", discountConditionId2, [prod2.id])
      )

      let res = await api.get(
        `/admin/products?discount_condition_id=${discountConditionId}`,
        adminHeaders
      )

      expect(res.status).toEqual(200)
      expect(res.data.products).toHaveLength(1)
      expect(res.data.products).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: prod1.id })])
      )

      res = await api.get(
        `/admin/products?discount_condition_id=${discountConditionId2}`,
        adminHeaders
      )

      expect(res.status).toEqual(200)
      expect(res.data.products).toHaveLength(1)
      expect(res.data.products).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: prod2.id })])
      )

      res = await api.get(`/admin/products`, adminHeaders)

      expect(res.status).toEqual(200)
      expect(res.data.products).toHaveLength(5)
      expect(res.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: prod1.id }),
          expect.objectContaining({ id: prod2.id }),
        ])
      )
    })

    it("doesn't expand collection and types", async () => {
      const api = useApi()

      const notExpected = [
        expect.objectContaining({
          collection: expect.any(Object),
          type: expect.any(Object),
        }),
      ]

      const response = await api
        .get(
          "/admin/products?status[]=published,proposed&expand=tags",
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(2)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product_filtering_1",
            status: "proposed",
          }),
          expect.objectContaining({
            id: "test-product_filtering_2",
            status: "published",
          }),
        ])
      )

      for (const notExpect of notExpected) {
        expect(response.data.products).toEqual(
          expect.not.arrayContaining([notExpect])
        )
      }
    })

    it("returns a list of deleted products with free text query", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/products?deleted_at[gt]=01-26-1990&q=test", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.products).toHaveLength(1)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product_filtering_4",
          }),
        ])
      )
    })

    it("returns a list of products with free text query and limit", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/products?q=t&limit=2", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products.length).toEqual(2)
    })

    it("returns a list of products with free text query including variant prices", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/products?q=test+product1", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      const expectedVariantPrices = response.data.products[0].variants
        .map((v) => v.prices)
        .flat(1)

      expect(response.status).toEqual(200)
      expect(expectedVariantPrices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price4",
          }),
          expect.objectContaining({
            id: "test-price3",
          }),
        ])
      )
    })

    it("returns a list of products with free text query and offset", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/products?q=t&offset=1", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products.length).toEqual(4)
    })

    it("returns a list of deleted products", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/products?deleted_at[gt]=01-26-1990", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(1)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product_filtering_4",
          }),
        ])
      )
    })

    it("returns a list of products in collection", async () => {
      const api = useApi()

      const notExpected = [
        expect.objectContaining({ collection_id: "test-collection" }),
        expect.objectContaining({ collection_id: "test-collection2" }),
      ]

      const response = await api
        .get("/admin/products?collection_id[]=test-collection1", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(2)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product_filtering_1",
            collection_id: "test-collection1",
          }),
          expect.objectContaining({
            id: "test-product_filtering_3",
            collection_id: "test-collection1",
          }),
        ])
      )

      for (const notExpect of notExpected) {
        expect(response.data.products).toEqual(
          expect.not.arrayContaining([notExpect])
        )
      }
    })

    it("returns a list of products with tags", async () => {
      const api = useApi()

      const notExpected = [
        expect.objectContaining({ id: "tag1" }),
        expect.objectContaining({ id: "tag2" }),
        expect.objectContaining({ id: "tag4" }),
      ]

      const response = await api
        .get("/admin/products?tags[]=tag3", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(2)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product_filtering_1",
            tags: [expect.objectContaining({ id: "tag3" })],
          }),
          expect.objectContaining({
            id: "test-product_filtering_2",
            tags: [expect.objectContaining({ id: "tag3" })],
          }),
        ])
      )
      for (const product of response.data.products) {
        for (const notExpect of notExpected) {
          expect(product.tags).toEqual(expect.not.arrayContaining([notExpect]))
        }
      }
    })

    it("returns a list of products with tags in a collection", async () => {
      const api = useApi()

      const notExpectedTags = [
        expect.objectContaining({ id: "tag1" }),
        expect.objectContaining({ id: "tag2" }),
        expect.objectContaining({ id: "tag3" }),
      ]

      const notExpectedCollections = [
        expect.objectContaining({ collection_id: "test-collection" }),
        expect.objectContaining({ collection_id: "test-collection2" }),
      ]

      const response = await api
        .get(
          "/admin/products?collection_id[]=test-collection1&tags[]=tag4",
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(1)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product_filtering_3",
            collection_id: "test-collection1",
            tags: [expect.objectContaining({ id: "tag4" })],
          }),
        ])
      )

      for (const notExpect of notExpectedCollections) {
        expect(response.data.products).toEqual(
          expect.not.arrayContaining([notExpect])
        )
      }

      for (const product of response.data.products) {
        for (const notExpect of notExpectedTags) {
          expect(product.tags).toEqual(expect.not.arrayContaining([notExpect]))
        }
      }
    })

    it("returns a list of products with only giftcard in list", async () => {
      const api = useApi()

      const payload = {
        title: "Test Giftcard",
        is_giftcard: true,
        description: "test-giftcard-description",
        options: [{ title: "Denominations" }],
        variants: [
          {
            title: "Test variant",
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "100" }],
          },
        ],
      }

      await api.post("/admin/products", payload, adminHeaders).catch((err) => {
        console.log(err)
      })

      const response = await api
        .get("/admin/products?is_giftcard=true", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.products).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({ is_giftcard: false }),
        ])
      )

      expect(response.status).toEqual(200)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "Test Giftcard",
            id: expect.stringMatching(/^prod_*/),
            is_giftcard: true,
            description: "test-giftcard-description",
            profile_id: expect.stringMatching(/^sp_*/),
            options: expect.arrayContaining([
              expect.objectContaining({
                title: "Denominations",
                id: expect.stringMatching(/^opt_*/),
                product_id: expect.stringMatching(/^prod_*/),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ]),

            variants: expect.arrayContaining([
              expect.objectContaining({
                title: "Test variant",
                id: expect.stringMatching(/^variant_*/),
                product_id: expect.stringMatching(/^prod_*/),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.any(String),
                    currency_code: "usd",
                    amount: 100,
                    variant_id: expect.stringMatching(/^variant_*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                options: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^opt_*/),
                    option_id: expect.stringMatching(/^opt_*/),
                    created_at: expect.any(String),
                    variant_id: expect.stringMatching(/^variant_*/),
                    updated_at: expect.any(String),
                  }),
                ]),
              }),
            ]),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        ])
      )
    })

    it("returns a list of products not containing a giftcard in list", async () => {
      const api = useApi()

      const payload = {
        title: "Test Giftcard",
        is_giftcard: true,
        description: "test-giftcard-description",
        options: [{ title: "Denominations" }],
        variants: [
          {
            title: "Test variant",
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "100" }],
          },
        ],
      }

      await api.post("/admin/products", payload, adminHeaders).catch((err) => {
        console.log(err)
      })

      const response = await api
        .get("/admin/products?is_giftcard=false", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.products).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({ is_giftcard: true }),
        ])
      )
    })

    it("returns a list of products with child entities", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/products?order=created_at", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.products).toHaveLength(5)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product",
            options: expect.arrayContaining([
              expect.objectContaining({
                id: expect.stringMatching(/^test-*/),
                product_id: expect.stringMatching(/^test-*/),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ]),
            images: expect.arrayContaining([
              expect.objectContaining({
                id: expect.stringMatching(/^test-*/),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ]),
            variants: expect.arrayContaining([
              expect.objectContaining({
                id: "test-variant",
                created_at: expect.any(String),
                updated_at: expect.any(String),
                product_id: expect.stringMatching(/^test-*/),
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    id: "test-price",
                    variant_id: expect.stringMatching(/^test-variant*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                options: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^test-variant-option*/),
                    variant_id: expect.stringMatching(/^test-variant*/),
                    option_id: expect.stringMatching(/^test-opt*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
              }),
              expect.objectContaining({
                id: "test-variant_2",
                created_at: expect.any(String),
                updated_at: expect.any(String),
                product_id: expect.stringMatching(/^test-*/),
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^test-price*/),
                    variant_id: "test-variant_2",
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                options: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^test-variant-option*/),
                    variant_id: expect.stringMatching(/^test-variant*/),
                    option_id: expect.stringMatching(/^test-opt*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
              }),
              expect.objectContaining({
                id: "test-variant_1",
                created_at: expect.any(String),
                updated_at: expect.any(String),
                product_id: expect.stringMatching(/^test-*/),
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^test-price*/),
                    variant_id: expect.stringMatching(/^test-variant*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                options: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^test-variant-option*/),
                    variant_id: expect.stringMatching(/^test-variant*/),
                    option_id: expect.stringMatching(/^test-opt*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
              }),
              expect.objectContaining({
                id: "test-variant-sale",
                created_at: expect.any(String),
                updated_at: expect.any(String),
                product_id: expect.stringMatching(/^test-*/),
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    id: "test-price-sale",
                    variant_id: expect.stringMatching(/^test-variant*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                options: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^test-variant-option*/),
                    variant_id: expect.stringMatching(/^test-variant*/),
                    option_id: expect.stringMatching(/^test-opt*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
              }),
            ]),
            tags: expect.arrayContaining([
              expect.objectContaining({
                id: expect.stringMatching(/^tag*/),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ]),
            type: expect.objectContaining({
              id: expect.stringMatching(/^test-*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            collection: expect.objectContaining({
              id: expect.stringMatching(/^test-*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            profile_id: expect.stringMatching(/^sp_*/),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
          expect.objectContaining({
            id: "test-product1",
            created_at: expect.any(String),
            options: [],
            variants: expect.arrayContaining([
              expect.objectContaining({
                id: "test-variant_4",
                created_at: expect.any(String),
                updated_at: expect.any(String),
                product_id: expect.stringMatching(/^test-*/),
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^test-price*/),
                    variant_id: expect.stringMatching(/^test-variant*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                options: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^test-variant-option*/),
                    variant_id: expect.stringMatching(/^test-variant*/),
                    option_id: expect.stringMatching(/^test-opt*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
              }),
              expect.objectContaining({
                id: "test-variant_3",
                created_at: expect.any(String),
                updated_at: expect.any(String),
                product_id: expect.stringMatching(/^test-*/),
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^test-price*/),
                    variant_id: expect.stringMatching(/^test-variant*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                options: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^test-variant-option*/),
                    variant_id: expect.stringMatching(/^test-variant*/),
                    option_id: expect.stringMatching(/^test-opt*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
              }),
            ]),
            tags: expect.arrayContaining([
              expect.objectContaining({
                id: expect.stringMatching(/^tag*/),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ]),
            type: expect.objectContaining({
              id: expect.stringMatching(/^test-*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            collection: expect.objectContaining({
              id: expect.stringMatching(/^test-*/),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            profile_id: expect.stringMatching(/^sp_*/),
            updated_at: expect.any(String),
          }),
          expect.objectContaining({
            id: "test-product_filtering_1",
            profile_id: expect.stringMatching(/^sp_*/),
            created_at: expect.any(String),
            type: expect.any(Object),
            collection: expect.any(Object),
            options: expect.any(Array),
            tags: expect.any(Array),
            variants: expect.any(Array),
            updated_at: expect.any(String),
          }),
          expect.objectContaining({
            id: "test-product_filtering_2",
            profile_id: expect.stringMatching(/^sp_*/),
            created_at: expect.any(String),
            type: expect.any(Object),
            collection: expect.any(Object),
            options: expect.any(Array),
            tags: expect.any(Array),
            variants: expect.any(Array),
            updated_at: expect.any(String),
          }),
          expect.objectContaining({
            id: "test-product_filtering_3",
            profile_id: expect.stringMatching(/^sp_*/),
            created_at: expect.any(String),
            type: expect.any(Object),
            collection: expect.any(Object),
            options: expect.any(Array),
            tags: expect.any(Array),
            variants: expect.any(Array),
            updated_at: expect.any(String),
          }),
        ])
      )
    })
  })

  describe("POST /admin/products", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)

      await simpleSalesChannelFactory(dbConnection, {
        name: "Default channel",
        id: "default-channel",
        is_default: true,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a product", async () => {
      const api = useApi()

      const payload = {
        title: "Test",
        description: "test-product-description",
        type: { value: "test-type" },
        images: ["test-image.png", "test-image-2.png"],
        collection_id: "test-collection",
        tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant",
            inventory_quantity: 10,
            prices: [
              {
                currency_code: "usd",
                amount: 100,
              },
              {
                currency_code: "eur",
                amount: 45,
              },
              {
                currency_code: "dkk",
                amount: 30,
              },
            ],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      }

      const response = await api
        .post("/admin/products", payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.product).toEqual(
        expect.objectContaining({
          id: expect.stringMatching(/^prod_*/),
          title: "Test",
          discountable: true,
          is_giftcard: false,
          handle: "test",
          status: "draft",
          created_at: expect.any(String),
          updated_at: expect.any(String),
          profile_id: expect.stringMatching(/^sp_*/),
          images: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              url: "test-image.png",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            expect.objectContaining({
              id: expect.any(String),
              url: "test-image-2.png",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          ]),
          thumbnail: "test-image.png",
          tags: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              value: "123",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            expect.objectContaining({
              id: expect.any(String),
              value: "456",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          ]),
          type: expect.objectContaining({
            value: "test-type",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
          collection: expect.objectContaining({
            id: "test-collection",
            title: "Test collection",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
          options: expect.arrayContaining([
            expect.objectContaining({
              id: expect.stringMatching(/^opt_*/),
              product_id: expect.stringMatching(/^prod_*/),
              title: "size",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            expect.objectContaining({
              id: expect.stringMatching(/^opt_*/),
              product_id: expect.stringMatching(/^prod_*/),
              title: "color",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          ]),
          variants: expect.arrayContaining([
            expect.objectContaining({
              id: expect.stringMatching(/^variant_*/),
              product_id: expect.stringMatching(/^prod_*/),
              updated_at: expect.any(String),
              created_at: expect.any(String),
              title: "Test variant",
              prices: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.stringMatching(/^ma_*/),
                  currency_code: "usd",
                  amount: 100,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  variant_id: expect.stringMatching(/^variant_*/),
                }),
                expect.objectContaining({
                  id: expect.stringMatching(/^ma_*/),
                  currency_code: "eur",
                  amount: 45,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  variant_id: expect.stringMatching(/^variant_*/),
                }),
                expect.objectContaining({
                  id: expect.stringMatching(/^ma_*/),
                  currency_code: "dkk",
                  amount: 30,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  variant_id: expect.stringMatching(/^variant_*/),
                }),
              ]),
              options: expect.arrayContaining([
                expect.objectContaining({
                  value: "large",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  variant_id: expect.stringMatching(/^variant_*/),
                  option_id: expect.stringMatching(/^opt_*/),
                  id: expect.stringMatching(/^optval_*/),
                }),
                expect.objectContaining({
                  value: "green",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  variant_id: expect.stringMatching(/^variant_*/),
                  option_id: expect.stringMatching(/^opt_*/),
                  id: expect.stringMatching(/^optval_*/),
                }),
              ]),
            }),
          ]),
        })
      )
    })

    it("creates a product that is not discountable", async () => {
      const api = useApi()

      const payload = {
        title: "Test",
        discountable: false,
        description: "test-product-description",
        type: { value: "test-type" },
        images: ["test-image.png", "test-image-2.png"],
        collection_id: "test-collection",
        tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      }

      const response = await api
        .post("/admin/products", payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.product).toEqual(
        expect.objectContaining({
          discountable: false,
        })
      )
    })

    it("Sets variant ranks when creating a product", async () => {
      const api = useApi()

      const payload = {
        title: "Test product - 1",
        description: "test-product-description 1",
        type: { value: "test-type 1" },
        images: ["test-image.png", "test-image-2.png"],
        collection_id: "test-collection",
        tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant 1",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
          {
            title: "Test variant 2",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      }

      const creationResponse = await api
        .post("/admin/products", payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(creationResponse.status).toEqual(200)

      const productId = creationResponse.data.product.id

      const response = await api
        .get(`/admin/products/${productId}`, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.product).toEqual(
        expect.objectContaining({
          title: "Test product - 1",
          variants: [
            expect.objectContaining({
              title: "Test variant 1",
            }),
            expect.objectContaining({
              title: "Test variant 2",
            }),
          ],
        })
      )
    })

    it("creates a giftcard", async () => {
      const api = useApi()

      const payload = {
        title: "Test Giftcard",
        is_giftcard: true,
        description: "test-giftcard-description",
        options: [{ title: "Denominations" }],
        variants: [
          {
            title: "Test variant",
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "100" }],
          },
        ],
      }

      const response = await api
        .post("/admin/products", payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.product).toEqual(
        expect.objectContaining({
          title: "Test Giftcard",
          discountable: false,
        })
      )
    })

    it("updates a product (update prices, tags, update status, delete collection, delete type, replaces images)", async () => {
      const api = useApi()

      const payload = {
        collection_id: null,
        variants: [
          {
            id: "test-variant",
            prices: [
              {
                currency_code: "usd",
                amount: 75,
              },
            ],
          },
        ],
        tags: [{ value: "123" }],
        images: ["test-image-2.png"],
        type: { value: "test-type-2" },
        status: "published",
      }

      const response = await api
        .post("/admin/products/test-product", payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.product).toEqual(
        expect.objectContaining({
          id: "test-product",
          created_at: expect.any(String),
          description: "test-product-description",
          discountable: true,
          handle: "test-product",
          images: expect.arrayContaining([
            expect.objectContaining({
              created_at: expect.any(String),
              deleted_at: null,
              id: expect.stringMatching(/^img_*/),
              metadata: null,
              updated_at: expect.any(String),
              url: "test-image-2.png",
            }),
          ]),
          is_giftcard: false,
          options: expect.arrayContaining([
            expect.objectContaining({
              created_at: expect.any(String),
              id: "test-option",
              product_id: "test-product",
              title: "test-option",
              updated_at: expect.any(String),
            }),
          ]),
          profile_id: expect.stringMatching(/^sp_*/),
          status: "published",
          tags: expect.arrayContaining([
            expect.objectContaining({
              created_at: expect.any(String),
              id: "tag1",
              updated_at: expect.any(String),
              value: "123",
            }),
          ]),
          thumbnail: "test-image-2.png",
          title: "Test product",
          type: expect.objectContaining({
            created_at: expect.any(String),
            id: expect.stringMatching(/^ptyp_*/),
            updated_at: expect.any(String),
            value: "test-type-2",
          }),
          type_id: expect.stringMatching(/^ptyp_*/),
          updated_at: expect.any(String),
          variants: expect.arrayContaining([
            expect.objectContaining({
              allow_backorder: false,
              barcode: "test-barcode",
              created_at: expect.any(String),
              ean: "test-ean",
              id: "test-variant",
              inventory_quantity: 10,
              manage_inventory: true,
              options: expect.arrayContaining([
                expect.objectContaining({
                  created_at: expect.any(String),
                  deleted_at: null,
                  id: "test-variant-option",
                  metadata: null,
                  option_id: "test-option",
                  updated_at: expect.any(String),
                  value: "Default variant",
                  variant_id: "test-variant",
                }),
              ]),
              origin_country: null,
              prices: expect.arrayContaining([
                expect.objectContaining({
                  amount: 75,
                  created_at: expect.any(String),
                  currency_code: "usd",
                  id: "test-price",
                  updated_at: expect.any(String),
                  variant_id: "test-variant",
                }),
              ]),
              product_id: "test-product",
              sku: "test-sku",
              title: "Test variant",
              upc: "test-upc",
              updated_at: expect.any(String),
            }),
          ]),
        })
      )
    })

    it("updates product (removes images when empty array included)", async () => {
      const api = useApi()

      const payload = {
        images: [],
      }

      const response = await api
        .post("/admin/products/test-product", payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.product.images.length).toEqual(0)
    })

    it("updates a product by deleting a field from metadata", async () => {
      const api = useApi()

      const product = await simpleProductFactory(dbConnection, {
        metadata: {
          "test-key": "test-value",
          "test-key-2": "test-value-2",
          "test-key-3": "test-value-3",
        },
      })

      const payload = {
        metadata: {
          "test-key": "",
          "test-key-2": null,
        },
      }

      const response = await api.post(
        "/admin/products/" + product.id,
        payload,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.product.metadata).toEqual({
        "test-key-2": null,
        "test-key-3": "test-value-3",
      })
    })

    it("fails to update product with invalid status", async () => {
      const api = useApi()

      const payload = {
        status: null,
      }

      try {
        await api.post("/admin/products/test-product", payload, adminHeaders)
      } catch (e) {
        expect(e.response.status).toEqual(400)
        expect(e.response.data.type).toEqual("invalid_data")
      }
    })

    it("updates a product (variant ordering)", async () => {
      const api = useApi()

      const payload = {
        collection_id: null,
        type: null,
        variants: [
          {
            id: "test-variant",
          },
          {
            id: "test-variant_1",
          },
          {
            id: "test-variant_2",
          },
        ],
      }

      const response = await api
        .post("/admin/products/test-product", payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.product).toEqual(
        expect.objectContaining({
          title: "Test product",
          variants: [
            expect.objectContaining({
              id: "test-variant",
              title: "Test variant",
            }),
            expect.objectContaining({
              id: "test-variant_1",
              title: "Test variant rank (1)",
            }),
            expect.objectContaining({
              id: "test-variant_2",
              title: "Test variant rank (2)",
            }),
          ],
          type: null,
          collection: null,
        })
      )
    })

    it("add option", async () => {
      const api = useApi()

      const payload = {
        title: "should_add",
      }

      const response = await api
        .post("/admin/products/test-product/options", payload, adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.product).toEqual(
        expect.objectContaining({
          options: expect.arrayContaining([
            expect.objectContaining({
              title: "should_add",
              product_id: "test-product",
            }),
          ]),
        })
      )
    })
  })

  describe("DELETE /admin/products/:id/options/:option_id", () => {
    beforeEach(async () => {
      await simpleProductFactory(dbConnection, {
        id: "test-product-without-variants",
        variants: [],
        options: [
          {
            id: "test-product-option",
            title: "Test option",
          },
        ],
      })
      await simpleProductFactory(dbConnection, {
        id: "test-product-with-variant",
        variants: [
          {
            product_id: "test-product-with-variant",
            options: [{ option_id: "test-product-option-1", value: "test" }],
          },
        ],
        options: [
          {
            id: "test-product-option-1",
            title: "Test option 1",
          },
        ],
      })
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("deletes a product option", async () => {
      const api = useApi()

      const response = await api
        .delete(
          "/admin/products/test-product-without-variants/options/test-product-option",
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.product).toEqual(
        expect.objectContaining({
          options: [],
          id: "test-product-without-variants",
          variants: [],
        })
      )
    })

    it("deletes a values associated with deleted option", async () => {
      const api = useApi()

      const response = await api.delete(
        "/admin/products/test-product-with-variant/options/test-product-option-1",
        adminHeaders
      )

      const values = await dbConnection.manager.find(ProductOptionValue, {
        where: { option_id: "test-product-option-1" },
        withDeleted: true,
      })

      expect(values).toEqual([
        expect.objectContaining({ deleted_at: expect.any(Date) }),
      ])
    })
  })

  describe("GET /admin/products/:id/variants", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)
      await simpleSalesChannelFactory(dbConnection, {
        name: "Default channel",
        id: "default-channel",
        is_default: true,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should return the variants related to the requested product", async () => {
      const api = useApi()

      const res = await api
        .get("/admin/products/test-product/variants", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(res.status).toEqual(200)
      expect(res.data.variants.length).toBe(4)
      expect(res.data.variants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-variant",
            product_id: "test-product",
          }),
          expect.objectContaining({
            id: "test-variant_1",
            product_id: "test-product",
          }),
          expect.objectContaining({
            id: "test-variant_2",
            product_id: "test-product",
          }),
          expect.objectContaining({
            id: "test-variant-sale",
            product_id: "test-product",
          }),
        ])
      )
    })
  })

  describe("updates a variant's default prices (ignores prices associated with a Price List)", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)
      await priceListSeeder(dbConnection)
      await simpleSalesChannelFactory(dbConnection, {
        name: "Default channel",
        id: "default-channel",
        is_default: true,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("successfully updates a variant's default prices by changing an existing price (currency_code)", async () => {
      const api = useApi()
      const data = {
        prices: [
          {
            currency_code: "usd",
            amount: 1500,
          },
        ],
      }

      const response = await api
        .post(
          "/admin/products/test-product/variants/test-variant",
          data,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        product: expect.objectContaining({
          id: "test-product",
          variants: expect.arrayContaining([
            expect.objectContaining({
              id: "test-variant",
              prices: expect.arrayContaining([
                expect.objectContaining({
                  amount: 1500,
                  currency_code: "usd",
                }),
              ]),
            }),
          ]),
        }),
      })
    })

    it("successfully updates a variant's price by changing an existing price (given a region_id)", async () => {
      const api = useApi()
      const data = {
        prices: [
          {
            region_id: "test-region",
            amount: 1500,
          },
        ],
      }

      const response = await api
        .post(
          "/admin/products/test-product1/variants/test-variant_3",
          data,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.product).toEqual(
        expect.objectContaining({
          variants: expect.arrayContaining([
            expect.objectContaining({
              id: "test-variant_3",
              prices: expect.arrayContaining([
                expect.objectContaining({
                  amount: 1500,
                  currency_code: "usd",
                  region_id: "test-region",
                }),
              ]),
            }),
          ]),
        })
      )
    })

    it("successfully updates a variant's prices by adding a new price", async () => {
      const api = useApi()
      const data = {
        title: "Test variant prices",
        prices: [
          // usd price coming from the product seeder
          {
            id: "test-price",
            amount: 100,
            currency_code: "usd",
          },
          {
            currency_code: "eur",
            amount: 4500,
          },
        ],
      }

      const response = await api
        .post(
          "/admin/products/test-product/variants/test-variant",
          data,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data).toEqual(
        expect.objectContaining({
          product: expect.objectContaining({
            id: "test-product",
            variants: expect.arrayContaining([
              expect.objectContaining({
                id: "test-variant",
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    amount: 100,
                    currency_code: "usd",
                  }),
                  expect.objectContaining({
                    amount: 4500,
                    currency_code: "eur",
                  }),
                ]),
              }),
            ]),
          }),
        })
      )
    })

    it("successfully updates a variant's prices by replacing a price", async () => {
      const api = useApi()
      const variantId = "test-variant"
      const data = {
        prices: [
          {
            currency_code: "usd",
            amount: 4500,
          },
        ],
      }

      const response = await api
        .post(
          `/admin/products/test-product/variants/${variantId}`,
          data,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      const variant = response.data.product.variants.find(
        (v) => v.id === variantId
      )
      expect(variant.prices.length).toEqual(1)
      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 4500,
            currency_code: "usd",
          }),
        ])
      )
    })

    it("successfully updates a variant's prices by deleting a price and adding another price", async () => {
      const api = useApi()
      const data = {
        prices: [
          {
            currency_code: "dkk",
            amount: 8000,
          },
          {
            currency_code: "eur",
            amount: 900,
          },
        ],
      }

      const variantId = "test-variant"
      const response = await api
        .post(
          `/admin/products/test-product/variants/${variantId}`,
          data,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      const variant = response.data.product.variants.find(
        (v) => v.id === variantId
      )
      expect(variant.prices.length).toEqual(2)

      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 8000,
            currency_code: "dkk",
          }),
          expect.objectContaining({
            amount: 900,
            currency_code: "eur",
          }),
        ])
      )
    })

    it("successfully updates a variant's prices by updating an existing price (using region_id) and adding another price", async () => {
      const api = useApi()
      const data = {
        prices: [
          {
            region_id: "test-region",
            amount: 8000,
          },
          {
            currency_code: "eur",
            amount: 900,
          },
        ],
      }

      const variantId = "test-variant_3"
      const response = await api
        .post(
          `/admin/products/test-product1/variants/${variantId}`,
          data,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      const variant = response.data.product.variants.find(
        (v) => v.id === variantId
      )
      expect(variant.prices.length).toEqual(data.prices.length)

      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 8000,
            currency_code: "usd",
            region_id: "test-region",
          }),
          expect.objectContaining({
            amount: 900,
            currency_code: "eur",
          }),
        ])
      )
    })

    it("successfully deletes a region price", async () => {
      const api = useApi()

      const createRegionPricePayload = {
        prices: [
          {
            currency_code: "usd",
            amount: 1000,
          },
          {
            region_id: "test-region",
            amount: 8000,
          },
          {
            currency_code: "eur",
            amount: 900,
          },
        ],
      }

      const variantId = "test-variant_3"

      const createRegionPriceResponse = await api.post(
        "/admin/products/test-product1/variants/test-variant_3",
        createRegionPricePayload,
        adminHeaders
      )

      const initialPriceArray =
        createRegionPriceResponse.data.product.variants.find(
          (v) => v.id === variantId
        ).prices

      expect(createRegionPriceResponse.status).toEqual(200)
      expect(initialPriceArray).toHaveLength(3)
      expect(initialPriceArray).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 1000,
            currency_code: "usd",
          }),
          expect.objectContaining({
            amount: 8000,
            currency_code: "usd",
            region_id: "test-region",
          }),
          expect.objectContaining({
            amount: 900,
            currency_code: "eur",
          }),
        ])
      )

      const deleteRegionPricePayload = {
        prices: [
          {
            currency_code: "usd",
            amount: 1000,
          },
          {
            currency_code: "eur",
            amount: 900,
          },
        ],
      }

      const deleteRegionPriceResponse = await api.post(
        "/admin/products/test-product1/variants/test-variant_3",
        deleteRegionPricePayload,
        adminHeaders
      )

      const finalPriceArray =
        deleteRegionPriceResponse.data.product.variants.find(
          (v) => v.id === variantId
        ).prices

      expect(deleteRegionPriceResponse.status).toEqual(200)
      expect(finalPriceArray).toHaveLength(2)
      expect(finalPriceArray).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 1000,
            currency_code: "usd",
          }),
          expect.objectContaining({
            amount: 900,
            currency_code: "eur",
          }),
        ])
      )
    })

    it("successfully updates a variants prices by deleting both a currency and region price", async () => {
      const api = useApi()

      await Promise.all(
        ["reg_1", "reg_2", "reg_3"].map(async (regionId) => {
          return await simpleRegionFactory(dbConnection, {
            id: regionId,
            currency_code: regionId === "reg_1" ? "eur" : "usd",
          })
        })
      )

      const createPrices = {
        prices: [
          {
            region_id: "reg_1",
            amount: 1,
          },
          {
            region_id: "reg_2",
            amount: 2,
          },
          {
            currency_code: "usd",
            amount: 3,
          },
          {
            region_id: "reg_3",
            amount: 4,
          },
          {
            currency_code: "eur",
            amount: 5,
          },
        ],
      }

      const variantId = "test-variant_3"

      await api
        .post(
          `/admin/products/test-product1/variants/${variantId}`,
          createPrices,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      const updatePrices = {
        prices: [
          {
            region_id: "reg_1",
            amount: 100,
          },
          {
            region_id: "reg_2",
            amount: 200,
          },
          {
            currency_code: "usd",
            amount: 300,
          },
        ],
      }

      const response = await api.post(
        `/admin/products/test-product1/variants/${variantId}`,
        updatePrices,
        adminHeaders
      )

      const finalPriceArray = response.data.product.variants.find(
        (v) => v.id === variantId
      ).prices

      expect(response.status).toEqual(200)
      expect(finalPriceArray).toHaveLength(3)
      expect(finalPriceArray).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 100,
            region_id: "reg_1",
          }),
          expect.objectContaining({
            amount: 200,
            region_id: "reg_2",
          }),
          expect.objectContaining({
            amount: 300,
            currency_code: "usd",
          }),
        ])
      )
    })
  })

  describe("variant creation", () => {
    beforeEach(async () => {
      try {
        await productSeeder(dbConnection)
        await adminSeeder(dbConnection)
        await simpleSalesChannelFactory(dbConnection, {
          name: "Default channel",
          id: "default-channel",
          is_default: true,
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

    it("create a product variant with prices (regional and currency)", async () => {
      const api = useApi()

      const payload = {
        title: "New variant",
        sku: "new-sku",
        ean: "new-ean",
        upc: "new-upc",
        barcode: "new-barcode",
        prices: [
          {
            currency_code: "usd",
            amount: 100,
          },
          {
            region_id: "test-region",
            amount: 200,
          },
        ],
        options: [{ option_id: "test-option", value: "inserted value" }],
      }

      const res = await api
        .post("/admin/products/test-product/variants", payload, adminHeaders)
        .catch((err) => console.log(err))

      const insertedVariant = res.data.product.variants.find(
        (v) => v.sku === "new-sku"
      )

      expect(res.status).toEqual(200)

      expect(insertedVariant.prices).toHaveLength(2)
      expect(insertedVariant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            currency_code: "usd",
            amount: 100,
            min_quantity: null,
            max_quantity: null,
            variant_id: insertedVariant.id,
            region_id: null,
          }),
          expect.objectContaining({
            currency_code: "usd",
            amount: 200,
            min_quantity: null,
            max_quantity: null,
            price_list_id: null,
            variant_id: insertedVariant.id,
            region_id: "test-region",
          }),
        ])
      )
    })
  })

  describe("testing for soft-deletion + uniqueness on handles, collection and variant properties", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)
      await simpleSalesChannelFactory(dbConnection, {
        name: "Default channel",
        id: "default-channel",
        is_default: true,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("successfully deletes a product", async () => {
      const api = useApi()

      const response = await api
        .delete("/admin/products/test-product", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data).toEqual(
        expect.objectContaining({
          id: "test-product",
          deleted: true,
        })
      )
    })

    it("successfully deletes a product and variants", async () => {
      const api = useApi()

      const variantPre = await dbConnection.manager.findOne(ProductVariant, {
        where: { id: "test-variant" },
      })

      expect(variantPre).toBeTruthy()

      const response = await api
        .delete("/admin/products/test-product", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data).toEqual(
        expect.objectContaining({
          id: "test-product",
          deleted: true,
        })
      )

      const variant = await dbConnection.manager.findOne(ProductVariant, {
        where: { id: "test-variant" },
      })

      expect(variant).not.toBeTruthy()
    })

    it("successfully deletes a product variant and its associated option values", async () => {
      const api = useApi()

      // Validate that the option value exists
      const optValPre = await dbConnection.manager.findOne(ProductOptionValue, {
        where: { variant_id: "test-variant_2" },
      })

      expect(optValPre).toBeTruthy()

      // Soft delete the variant
      const response = await api.delete(
        "/admin/products/test-product/variants/test-variant_2",
        adminHeaders
      )

      expect(response.status).toEqual(200)

      // Validate that the option value was deleted
      const optValPost = await dbConnection.manager.findOne(
        ProductOptionValue,
        { where: { variant_id: "test-variant_2" } }
      )

      expect(optValPost).not.toBeTruthy()

      // Validate that the option still exists in the DB with deleted_at
      const optValDeleted = await dbConnection.manager.findOne(
        ProductOptionValue,
        {
          where: {
            variant_id: "test-variant_2",
          },
          withDeleted: true,
        }
      )

      expect(optValDeleted).toEqual(
        expect.objectContaining({
          deleted_at: expect.any(Date),
          variant_id: "test-variant_2",
        })
      )
    })

    it("successfully deletes a product and any option value associated with one of its variants", async () => {
      const api = useApi()

      // Validate that the option value exists
      const optValPre = await dbConnection.manager.findOne(ProductOptionValue, {
        where: { variant_id: "test-variant_2" },
      })

      expect(optValPre).toBeTruthy()

      // Soft delete the product
      const response = await api.delete(
        "/admin/products/test-product",
        adminHeaders
      )

      expect(response.status).toEqual(200)

      // Validate that the option value has been deleted
      const optValPost = await dbConnection.manager.findOne(
        ProductOptionValue,
        {
          where: { variant_id: "test-variant_2" },
        }
      )

      expect(optValPost).not.toBeTruthy()

      // Validate that the option still exists in the DB with deleted_at
      const optValDeleted = await dbConnection.manager.findOne(
        ProductOptionValue,
        {
          where: {
            variant_id: "test-variant_2",
          },
          withDeleted: true,
        }
      )

      expect(optValDeleted).toEqual(
        expect.objectContaining({
          deleted_at: expect.any(Date),
          variant_id: "test-variant_2",
        })
      )
    })

    it("successfully deletes a product variant and its associated prices", async () => {
      const api = useApi()

      // Validate that the price exists
      const pricePre = await dbConnection.manager.findOne(MoneyAmount, {
        where: { id: "test-price" },
      })

      expect(pricePre).toBeTruthy()

      // Soft delete the variant
      const response = await api.delete(
        "/admin/products/test-product/variants/test-variant",
        adminHeaders
      )

      expect(response.status).toEqual(200)

      // Validate that the price was deleted
      const pricePost = await dbConnection.manager.findOne(MoneyAmount, {
        where: { id: "test-price" },
      })

      expect(pricePost).not.toBeTruthy()

      // Validate that the price still exists in the DB with deleted_at
      const optValDeleted = await dbConnection.manager.findOne(MoneyAmount, {
        where: {
          id: "test-price",
        },
        withDeleted: true,
      })

      expect(optValDeleted).toEqual(
        expect.objectContaining({
          deleted_at: expect.any(Date),
          id: "test-price",
        })
      )
    })

    it("successfully deletes a product and any prices associated with one of its variants", async () => {
      const api = useApi()

      // Validate that the price exists
      const pricePre = await dbConnection.manager.findOne(MoneyAmount, {
        where: { id: "test-price" },
      })

      expect(pricePre).toBeTruthy()

      // Soft delete the product
      const response = await api.delete(
        "/admin/products/test-product",
        adminHeaders
      )

      expect(response.status).toEqual(200)

      // Validate that the price has been deleted
      const pricePost = await dbConnection.manager.findOne(MoneyAmount, {
        where: { id: "test-price" },
      })

      expect(pricePost).not.toBeTruthy()

      // Validate that the price still exists in the DB with deleted_at
      const optValDeleted = await dbConnection.manager.findOne(MoneyAmount, {
        where: {
          id: "test-price",
        },
        withDeleted: true,
      })

      expect(optValDeleted).toEqual(
        expect.objectContaining({
          deleted_at: expect.any(Date),
          id: "test-price",
        })
      )
    })

    it("successfully creates product with soft-deleted product handle and deletes it again", async () => {
      const api = useApi()

      // First we soft-delete the product
      const response = await api
        .delete("/admin/products/test-product", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.id).toEqual("test-product")

      // Lets try to create a product with same handle as deleted one
      const payload = {
        title: "Test product",
        handle: "test-product",
        description: "test-product-description",
        type: { value: "test-type" },
        images: ["test-image.png", "test-image-2.png"],
        collection_id: "test-collection",
        tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      }

      const res = await api.post("/admin/products", payload, adminHeaders)

      expect(res.status).toEqual(200)
      expect(res.data.product.handle).toEqual("test-product")

      // Delete product again to ensure uniqueness is enforced in all cases
      const response2 = await api
        .delete("/admin/products/test-product", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response2.status).toEqual(200)
      expect(response2.data.id).toEqual("test-product")
    })

    it("should fail when creating a product with a handle that already exists", async () => {
      const api = useApi()

      // Lets try to create a product with same handle as deleted one
      const payload = {
        title: "Test product",
        handle: "test-product",
        description: "test-product-description",
        type: { value: "test-type" },
        images: ["test-image.png", "test-image-2.png"],
        collection_id: "test-collection",
        tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      }

      try {
        await api.post("/admin/products", payload, adminHeaders)
      } catch (error) {
        expect(error.response.data.message).toMatch(
          "Product with handle test-product already exists."
        )
      }
    })

    it("successfully deletes product collection", async () => {
      const api = useApi()

      // First we soft-delete the product collection
      const response = await api
        .delete("/admin/collections/test-collection", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.id).toEqual("test-collection")
    })

    it("successfully creates soft-deleted product collection", async () => {
      const api = useApi()

      const response = await api
        .delete("/admin/collections/test-collection", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.id).toEqual("test-collection")

      // Lets try to create a product collection with same handle as deleted one
      const payload = {
        title: "Another test collection",
        handle: "test-collection",
      }

      const res = await api.post("/admin/collections", payload, adminHeaders)

      expect(res.status).toEqual(200)
      expect(res.data.collection.handle).toEqual("test-collection")
    })

    it("should fail when creating a collection with a handle that already exists", async () => {
      const api = useApi()

      // Lets try to create a collection with same handle as deleted one
      const payload = {
        title: "Another test collection",
        handle: "test-collection",
      }

      try {
        await api.post("/admin/collections", payload, adminHeaders)
      } catch (error) {
        expect(error.response.data.message).toMatch(
          "Product_collection with handle test-collection already exists."
        )
      }
    })

    it("successfully creates soft-deleted product variant", async () => {
      const api = useApi()

      await api
        .get("/admin/products/test-product", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      const response = await api
        .delete(
          "/admin/products/test-product/variants/test-variant",
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.variant_id).toEqual("test-variant")

      const payload = {
        title: "Second variant",
        sku: "test-sku",
        ean: "test-ean",
        upc: "test-upc",
        barcode: "test-barcode",
        prices: [
          {
            currency_code: "usd",
            amount: 100,
          },
        ],
        options: [{ option_id: "test-option", value: "inserted value" }],
      }

      const res = await api
        .post("/admin/products/test-product/variants", payload, adminHeaders)
        .catch((err) => console.log(err))

      expect(res.status).toEqual(200)
      expect(res.data.product.variants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "Second variant",
            sku: "test-sku",
            ean: "test-ean",
            upc: "test-upc",
            barcode: "test-barcode",
          }),
        ])
      )
    })
  })

  describe("POST /admin/products/:id/variants/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simpleProductFactory(dbConnection, {
        id: "test-product-to-update",
        variants: [
          {
            id: "test-variant-to-update",
          },
        ],
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("successfully updates variant without prices", async () => {
      const api = useApi()

      const res = await api
        .post(
          "/admin/products/test-product-to-update/variants/test-variant-to-update",
          {
            inventory_quantity: 10,
          },
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(res.status).toEqual(200)
    })
  })

  describe("GET /admin/products/tag-usage", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)
      await simpleSalesChannelFactory(dbConnection, {
        name: "Default channel",
        id: "default-channel",
        is_default: true,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("successfully gets the tags usage", async () => {
      const api = useApi()

      const res = await api
        .get("/admin/products/tag-usage", adminHeaders)
        .catch((err) => {
          console.log(err)
        })

      expect(res.status).toEqual(200)
      expect(res.data.tags.length).toEqual(3)
      expect(res.data.tags).toEqual(
        expect.arrayContaining([
          { id: "tag1", usage_count: "2", value: "123" },
          { id: "tag3", usage_count: "2", value: "1235" },
          { id: "tag4", usage_count: "1", value: "1234" },
        ])
      )
    })
  })
})
