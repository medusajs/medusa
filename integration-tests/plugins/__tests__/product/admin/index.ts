const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")
const productSeeder = require("../../helpers/product-seeder")

const {
  simpleProductFactory,
  simpleSalesChannelFactory,
} = require("../../factories")

jest.setTimeout(50000)

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
})
