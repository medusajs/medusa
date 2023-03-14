const path = require("path")
const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const {
  simpleProductFactory,
  simpleProductCategoryFactory,
} = require("../../factories")

const productSeeder = require("../../helpers/store-product-seeder")
const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/store/products", () => {
  let medusaProcess
  let dbConnection

  const giftCardId = "giftcard"
  const testProductId = "test-product"
  const testProductId1 = "test-product1"
  const testProductFilteringId1 = "test-product_filtering_1"
  const testProductFilteringId2 = "test-product_filtering_2"

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

  describe("GET /store/products", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns a list of ordered products by id ASC", async () => {
      const api = useApi()

      const response = await api.get("/store/products?order=id")

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(5)
      expect(response.data.products[0].id).toEqual(giftCardId)
      expect(response.data.products[1].id).toEqual(testProductId)
      expect(response.data.products[2].id).toEqual(testProductId1)
      expect(response.data.products[3].id).toEqual(testProductFilteringId1)
      expect(response.data.products[4].id).toEqual(testProductFilteringId2)
    })

    it("returns a list of ordered products by id DESC", async () => {
      const api = useApi()

      const response = await api.get("/store/products?order=-id")

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(5)
      expect(response.data.products[0].id).toEqual(testProductFilteringId2)
      expect(response.data.products[1].id).toEqual(testProductFilteringId1)
      expect(response.data.products[2].id).toEqual(testProductId1)
      expect(response.data.products[3].id).toEqual(testProductId)
      expect(response.data.products[4].id).toEqual(giftCardId)
    })

    it("returns a list of ordered products by variants title DESC", async () => {
      const api = useApi()

      const response = await api.get("/store/products?order=-variants.title")

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(5)

      const testProductIndex = response.data.products.indexOf(
        response.data.products.find((p) => p.id === testProductId)
      )
      const testProduct1Index = response.data.products.indexOf(
        response.data.products.find((p) => p.id === testProductId1)
      )

      expect(testProductIndex).toBe(3)
      expect(testProduct1Index).toBe(4)
    })

    it("returns a list of ordered products by variants title ASC", async () => {
      const api = useApi()

      const response = await api.get("/store/products?order=variants.title")

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(5)

      const testProductIndex = response.data.products.indexOf(
        response.data.products.find((p) => p.id === testProductId)
      )
      const testProduct1Index = response.data.products.indexOf(
        response.data.products.find((p) => p.id === testProductId1)
      )

      expect(testProductIndex).toBe(0)
      expect(testProduct1Index).toBe(1)
    })

    it("returns a list of ordered products by variants prices DESC", async () => {
      const api = useApi()

      await simpleProductFactory(dbConnection, {
        id: "test-product2",
        status: "published",
        variants: [
          {
            id: "test_variant_5",
            prices: [
              {
                currency: "usd",
                amount: 200,
              },
            ],
          },
        ],
      })

      const response = await api.get(
        "/store/products?order=-variants.prices.amount"
      )

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(6)

      const testProductIndex = response.data.products.indexOf(
        response.data.products.find((p) => p.id === testProductId)
      )
      const testProduct1Index = response.data.products.indexOf(
        response.data.products.find((p) => p.id === testProductId1)
      )
      const testProduct2Index = response.data.products.indexOf(
        response.data.products.find((p) => p.id === "test-product2")
      )

      expect(testProduct2Index).toBe(3) // 200
      expect(testProductIndex).toBe(4) // 100
      expect(testProduct1Index).toBe(5) // 100
    })

    it("returns a list of ordered products by variants prices ASC", async () => {
      const api = useApi()

      await simpleProductFactory(dbConnection, {
        id: "test-product2",
        status: "published",
        variants: [
          {
            id: "test_variant_5",
            prices: [
              {
                currency: "usd",
                amount: 200,
              },
            ],
          },
        ],
      })

      const response = await api.get(
        "/store/products?order=variants.prices.amount"
      )

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(6)

      const testProductIndex = response.data.products.indexOf(
        response.data.products.find((p) => p.id === testProductId)
      )
      const testProduct1Index = response.data.products.indexOf(
        response.data.products.find((p) => p.id === testProductId1)
      )
      const testProduct2Index = response.data.products.indexOf(
        response.data.products.find((p) => p.id === "test-product2")
      )

      expect(testProductIndex).toBe(0) // 100
      expect(testProduct1Index).toBe(1) // 100
      expect(testProduct2Index).toBe(2) // 200
    })

    it("products contain only fields defined with `fields` param", async () => {
      const api = useApi()

      const response = await api.get("/store/products?fields=handle")

      expect(response.status).toEqual(200)

      expect(Object.keys(response.data.products[0])).toEqual([
        // fields
        "handle",
        // relations
        "variants",
        "options",
        "images",
        "tags",
        "collection",
        "type",
      ])
    })

    it("returns a list of ordered products by id ASC and filtered with free text search", async () => {
      const api = useApi()

      const response = await api.get("/store/products?q=filtering&order=id")

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(2)

      expect(response.data.products).toEqual([
        expect.objectContaining({
          id: testProductFilteringId1,
        }),
        expect.objectContaining({
          id: testProductFilteringId2,
        }),
      ])
    })

    it("returns a list of ordered products by id DESC and filtered with free text search", async () => {
      const api = useApi()

      const response = await api.get("/store/products?q=filtering&order=-id")

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(2)

      expect(response.data.products).toEqual([
        expect.objectContaining({
          id: testProductFilteringId2,
        }),
        expect.objectContaining({
          id: testProductFilteringId1,
        }),
      ])
    })

    it("returns a list of products in collection", async () => {
      const api = useApi()

      const notExpected = [
        expect.objectContaining({ collection_id: "test-collection" }),
        expect.objectContaining({ collection_id: "test-collection1" }),
      ]

      const response = await api
        .get("/store/products?collection_id[]=test-collection2")
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(1)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: testProductFilteringId2,
            collection_id: "test-collection2",
          }),
        ])
      )

      for (const notExpect of notExpected) {
        expect(response.data.products).toEqual(
          expect.not.arrayContaining([notExpect])
        )
      }
    })

    it("returns a list of products with a given tag", async () => {
      const api = useApi()

      const notExpected = [expect.objectContaining({ id: "tag4" })]

      const response = await api
        .get("/store/products?tags[]=tag3")
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(1)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: testProductFilteringId1,
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

    it("returns gift card product", async () => {
      const api = useApi()

      const response = await api
        .get("/store/products?is_giftcard=true")
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products.length).toEqual(1)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: giftCardId,
            is_giftcard: true,
          }),
        ])
      )
    })

    it("returns non gift card products", async () => {
      const api = useApi()

      const response = await api
        .get("/store/products?is_giftcard=false")
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.products).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({ is_giftcard: true }),
        ])
      )
    })

    it("returns product with tag", async () => {
      const api = useApi()

      const notExpected = [expect.objectContaining({ id: "tag4" })]

      const response = await api
        .get("/store/products?tags[]=tag3")
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(1)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: testProductFilteringId1,
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

    it("returns a list of products in with a given handle", async () => {
      const api = useApi()

      const notExpected = [
        expect.objectContaining({ handle: testProductFilteringId1 }),
      ]

      const response = await api
        .get("/store/products?handle=test-product_filtering_2")
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(1)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: testProductFilteringId2,
            handle: testProductFilteringId2,
          }),
        ])
      )

      for (const notExpect of notExpected) {
        expect(response.data.products).toEqual(
          expect.not.arrayContaining([notExpect])
        )
      }
    })

    it("works when filtering by type_id", async () => {
      const api = useApi()

      const response = await api.get(
        `/store/products?type_id[]=test-type&fields=id,title,type_id`
      )

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

    it("returns only published products", async () => {
      const api = useApi()

      const notExpected = [
        expect.objectContaining({ status: "proposed" }),
        expect.objectContaining({ status: "draft" }),
        expect.objectContaining({ status: "rejected" }),
      ]

      const response = await api.get("/store/products").catch((err) => {
        console.log(err)
      })

      expect(response.status).toEqual(200)
      expect(response.data.products.length).toEqual(5)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: testProductId1,
            collection_id: "test-collection",
          }),
          expect.objectContaining({
            id: testProductId,
            collection_id: "test-collection",
          }),
          expect.objectContaining({
            id: testProductFilteringId2,
            collection_id: "test-collection2",
          }),
          expect.objectContaining({
            id: testProductFilteringId1,
            collection_id: "test-collection1",
          }),
          expect.objectContaining({
            id: giftCardId,
          }),
        ])
      )

      for (const notExpect of notExpected) {
        expect(response.data.products).toEqual(
          expect.not.arrayContaining([notExpect])
        )
      }
    })
  })

  describe("list params", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Includes Additional prices when queried with a cart id", async () => {
      const api = useApi()

      const response = await api
        .get("/store/products?cart_id=test-cart")
        .catch((err) => {
          console.log(err)
        })

      const products = response.data.products

      expect(products).toHaveLength(5)

      const testProduct = products.find((p) => p.id === testProductId)
      expect(testProduct.variants).toHaveLength(3)

      for (const variant of testProduct.variants) {
        expect(variant.prices).toHaveLength(2)
      }

      expect(products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: testProductId1,
            collection_id: "test-collection",
          }),
          expect.objectContaining({
            id: testProductId,
            collection_id: "test-collection",
            variants: expect.arrayContaining([
              expect.objectContaining({
                original_price: 100,
                calculated_price: 80,
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    id: "test-price",
                    currency_code: "usd",
                    amount: 100,
                  }),
                  expect.objectContaining({
                    id: "test-price-discount",
                    currency_code: "usd",
                    amount: 80,
                  }),
                ]),
              }),
              expect.objectContaining({
                original_price: 100,
                calculated_price: 80,
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    id: "test-price1",
                    currency_code: "usd",
                    amount: 100,
                  }),
                  expect.objectContaining({
                    id: "test-price1-discount",
                    currency_code: "usd",
                    amount: 80,
                  }),
                ]),
              }),
              expect.objectContaining({
                original_price: 100,
                calculated_price: 80,
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    id: "test-price2",
                    currency_code: "usd",
                    amount: 100,
                  }),
                  expect.objectContaining({
                    id: "test-price2-discount",
                    currency_code: "usd",
                    amount: 80,
                  }),
                ]),
              }),
            ]),
          }),
          expect.objectContaining({
            id: testProductFilteringId2,
            collection_id: "test-collection2",
          }),
          expect.objectContaining({
            id: testProductFilteringId1,
            collection_id: "test-collection1",
          }),
          expect.objectContaining({
            id: giftCardId,
          }),
        ])
      )
    })
  })

  describe("list params", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simpleProductFactory(
        dbConnection,
        {
          title: "testprod",
          status: "published",
          variants: [{ title: "test-variant" }],
        },
        11
      )

      await simpleProductFactory(
        dbConnection,
        {
          title: "testprod3",
          status: "published",
          variants: [{ title: "test-variant1" }],
        },
        12
      )
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("works with expand and fields", async () => {
      const api = useApi()

      const response = await api.get(
        "/store/products?expand=variants,variants.prices&fields=id,title&limit=1"
      )

      expect(response.data).toEqual(
        expect.objectContaining({
          products: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              variants: expect.arrayContaining([
                expect.objectContaining({
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  id: expect.any(String),
                  product_id: expect.any(String),
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      created_at: expect.any(String),
                      updated_at: expect.any(String),
                      id: expect.any(String),
                      variant_id: expect.any(String),
                    }),
                  ]),
                }),
              ]),
            }),
          ]),
        })
      )
    })
  })

  describe("/store/products/:id", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("includes default relations", async () => {
      const api = useApi()

      const response = await api.get("/store/products/test-product")

      expect(response.data).toEqual(
        expect.objectContaining({
          product: expect.objectContaining({
            id: testProductId,
            variants: expect.arrayContaining([
              expect.objectContaining({
                id: "test-variant",
                inventory_quantity: 10,
                allow_backorder: false,
                title: "Test variant",
                sku: "test-sku",
                ean: "test-ean",
                upc: "test-upc",
                length: null,
                manage_inventory: true,
                material: null,
                metadata: null,
                mid_code: null,
                height: null,
                hs_code: null,
                origin_country: null,
                calculated_price: null,
                original_price: null,
                barcode: "test-barcode",
                product_id: testProductId,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                options: expect.arrayContaining([
                  expect.objectContaining({
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                    amount: 100,
                    currency_code: "usd",
                    deleted_at: null,
                    min_quantity: null,
                    max_quantity: null,
                    price_list_id: null,
                    id: "test-price",
                    region_id: null,
                    variant_id: "test-variant",
                  }),
                  expect.objectContaining({
                    id: "test-price-discount",
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                    amount: 80,
                    currency_code: "usd",
                    price_list_id: "pl",
                    deleted_at: null,
                    region_id: null,
                    variant_id: "test-variant",
                    price_list: expect.objectContaining({
                      id: "pl",
                      type: "sale",
                      created_at: expect.any(String),
                      updated_at: expect.any(String),
                    }),
                  }),
                ]),
              }),
              expect.objectContaining({
                id: "test-variant_2",
                inventory_quantity: 10,
                allow_backorder: false,
                title: "Test variant rank (2)",
                sku: "test-sku2",
                ean: "test-ean2",
                upc: "test-upc2",
                length: null,
                manage_inventory: true,
                material: null,
                metadata: null,
                mid_code: null,
                height: null,
                hs_code: null,
                origin_country: null,
                barcode: null,
                calculated_price: null,
                original_price: null,
                product_id: testProductId,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                options: expect.arrayContaining([
                  expect.objectContaining({
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    id: "test-price2",
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                    amount: 100,
                    currency_code: "usd",
                    price_list_id: null,
                    deleted_at: null,
                    region_id: null,
                    variant_id: "test-variant_2",
                  }),
                  expect.objectContaining({
                    id: "test-price2-discount",
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                    amount: 80,
                    currency_code: "usd",
                    price_list_id: "pl",
                    deleted_at: null,
                    region_id: null,
                    variant_id: "test-variant_2",
                    price_list: expect.objectContaining({
                      id: "pl",
                      type: "sale",
                      created_at: expect.any(String),
                      updated_at: expect.any(String),
                    }),
                  }),
                ]),
              }),
              expect.objectContaining({
                id: "test-variant_1",
                inventory_quantity: 10,
                allow_backorder: false,
                title: "Test variant rank (1)",
                sku: "test-sku1",
                ean: "test-ean1",
                upc: "test-upc1",
                length: null,
                manage_inventory: true,
                material: null,
                metadata: null,
                mid_code: null,
                height: null,
                hs_code: null,
                origin_country: null,
                calculated_price: null,
                original_price: null,
                barcode: "test-barcode 1",
                product_id: testProductId,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                options: expect.arrayContaining([
                  expect.objectContaining({
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    id: "test-price1",
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                    amount: 100,
                    currency_code: "usd",
                    min_quantity: null,
                    max_quantity: null,
                    price_list_id: null,
                    deleted_at: null,
                    region_id: null,
                    variant_id: "test-variant_1",
                  }),
                  expect.objectContaining({
                    id: "test-price1-discount",
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                    amount: 80,
                    currency_code: "usd",
                    price_list_id: "pl",
                    deleted_at: null,
                    region_id: null,
                    variant_id: "test-variant_1",
                    price_list: expect.objectContaining({
                      id: "pl",
                      type: "sale",
                      created_at: expect.any(String),
                      updated_at: expect.any(String),
                    }),
                  }),
                ]),
              }),
            ]),
            images: expect.arrayContaining([
              expect.objectContaining({
                id: "test-image",
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ]),
            handle: testProductId,
            title: "Test product",
            profile_id: expect.stringMatching(/^sp_*/),
            description: "test-product-description",
            collection_id: "test-collection",
            collection: expect.objectContaining({
              id: "test-collection",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            type: expect.objectContaining({
              id: "test-type",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            tags: expect.arrayContaining([
              expect.objectContaining({
                id: "tag1",
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ]),
            options: expect.arrayContaining([
              expect.objectContaining({
                id: "test-option",
                values: expect.arrayContaining([
                  expect.objectContaining({
                    id: "test-variant-option",
                    value: "Default variant",
                    option_id: "test-option",
                    variant_id: "test-variant",
                    metadata: null,
                    deleted_at: null,
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                  expect.objectContaining({
                    id: "test-variant-option-1",
                    value: "Default variant 1",
                    option_id: "test-option",
                    variant_id: "test-variant_1",
                    metadata: null,
                    deleted_at: null,
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                  expect.objectContaining({
                    id: "test-variant-option-2",
                    value: "Default variant 2",
                    option_id: "test-option",
                    variant_id: "test-variant_2",
                    metadata: null,
                    deleted_at: null,
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                  expect.objectContaining({
                    id: "test-variant-option-3",
                    value: "Default variant 3",
                    option_id: "test-option",
                    variant_id: "test-variant_3",
                    metadata: null,
                    deleted_at: null,
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                  expect.objectContaining({
                    id: "test-variant-option-4",
                    value: "Default variant 4",
                    option_id: "test-option",
                    variant_id: "test-variant_4",
                    metadata: null,
                    deleted_at: null,
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ]),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        })
      )
    })

    it("lists all published products", async () => {
      const api = useApi()

      // update test-product status to published
      await api
        .post(
          "/admin/products/test-product",
          {
            status: "published",
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

      const response = await api.get("/store/products")

      expect(response.status).toEqual(200)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: testProductId,
            status: "published",
          }),
        ])
      )
    })

    it("response contains only fields defined with `fields` param", async () => {
      const api = useApi()

      const response = await api.get(
        "/store/products/test-product?fields=handle"
      )

      expect(response.status).toEqual(200)

      expect(Object.keys(response.data.product)).toEqual([
        // fields
        "handle",
        // relations
        "variants",
        "options",
        "images",
        "tags",
        "collection",
        "type",
      ])
    })
  })
})
