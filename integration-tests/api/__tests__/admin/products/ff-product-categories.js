const path = require("path")
const { ProductCategory } = require("@medusajs/medusa")
const { DiscountRuleType, AllocationType } = require("@medusajs/medusa/dist")
const { IdMap } = require("medusa-test-utils")
const {
  ProductVariant,
  ProductOptionValue,
  MoneyAmount,
  DiscountConditionType,
  DiscountConditionOperator,
} = require("@medusajs/medusa")

const setupServer = require("../../../../helpers/setup-server")
const { useApi } = require("../../../../helpers/use-api")
const { initDb, useDb } = require("../../../../helpers/use-db")
const adminSeeder = require("../../../helpers/admin-seeder")
const productSeeder = require("../../../helpers/product-seeder")
const priceListSeeder = require("../../../helpers/price-list-seeder")
const {
  simpleProductFactory,
  simpleDiscountFactory,
  simpleProductCategoryFactory,
  simpleSalesChannelFactory,
  simpleRegionFactory,
} = require("../../../factories")

const testProductId = "test-product"
const testProduct1Id = "test-product1"
const testProductFilteringId1 = "test-product_filtering_1"
const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("/admin/products [MEDUSA_FF_PRODUCT_CATEGORIES=true]", () => {
  let medusaProcess
  let dbConnection
  let categoryWithProduct
  let categoryWithoutProduct
  let nestedCategoryWithProduct
  let nested2CategoryWithProduct
  const nestedCategoryWithProductId = "nested-category-with-product-id"
  const nested2CategoryWithProductId = "nested2-category-with-product-id"
  const categoryWithProductId = "category-with-product-id"
  const categoryWithoutProductId = "category-without-product-id"

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
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

      const manager = dbConnection.manager
      categoryWithProduct = await simpleProductCategoryFactory(dbConnection, {
        id: categoryWithProductId,
        name: "category with Product",
        products: [{ id: testProductId }],
        is_active: false,
        is_internal: false,
      })

      nestedCategoryWithProduct = await simpleProductCategoryFactory(
        dbConnection,
        {
          id: nestedCategoryWithProductId,
          name: "nested category with Product1",
          parent_category: categoryWithProduct,
          products: [{ id: testProduct1Id }],
          is_active: true,
          is_internal: true,
        }
      )

      nested2CategoryWithProduct = await simpleProductCategoryFactory(
        dbConnection,
        {
          id: nested2CategoryWithProductId,
          name: "nested2 category with Product1",
          parent_category: nestedCategoryWithProduct,
          products: [{ id: testProductFilteringId1 }],
          is_active: false,
          is_internal: true,
        }
      )

      categoryWithoutProduct = await simpleProductCategoryFactory(
        dbConnection,
        {
          id: categoryWithoutProductId,
          name: "category without product",
          is_active: true,
          is_internal: false,
        }
      )
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns a list of products in product category without category children", async () => {
      const api = useApi()
      const params = `category_id[]=${categoryWithProductId}`
      const response = await api.get(
        `/admin/products?${params}`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(1)
      expect(response.data.products).toEqual([
        expect.objectContaining({
          id: testProductId,
        }),
      ])
    })

    it("returns a list of products in product category without category children explicitly set to false", async () => {
      const api = useApi()
      const params = `category_id[]=${categoryWithProductId}&include_category_children=false`
      const response = await api.get(
        `/admin/products?${params}`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(1)
      expect(response.data.products).toEqual([
        expect.objectContaining({
          id: testProductId,
        }),
      ])
    })

    it("returns a list of products in product category with category children", async () => {
      const api = useApi()

      const params = `category_id[]=${categoryWithProductId}&include_category_children=true`
      const response = await api.get(
        `/admin/products?${params}`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(3)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: testProduct1Id,
          }),
          expect.objectContaining({
            id: testProductId,
          }),
          expect.objectContaining({
            id: testProductFilteringId1,
          }),
        ])
      )
    })

    it("returns no products when product category with category children does not have products", async () => {
      const api = useApi()

      const params = `category_id[]=${categoryWithoutProductId}&include_category_children=true`
      const response = await api.get(
        `/admin/products?${params}`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(0)
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

      const manager = dbConnection.manager
      categoryWithProduct = await manager.create(ProductCategory, {
        id: categoryWithProductId,
        name: "category with Product",
        products: [{ id: testProductId }],
      })
      await manager.save(categoryWithProduct)

      categoryWithoutProduct = await manager.create(ProductCategory, {
        id: categoryWithoutProductId,
        name: "category without product",
      })
      await manager.save(categoryWithoutProduct)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a product with categories associated to it", async () => {
      const api = useApi()

      const payload = {
        title: "Test",
        description: "test-product-description",
        categories: [
          { id: categoryWithProductId },
          { id: categoryWithoutProductId },
        ],
      }

      const response = await api
        .post("/admin/products", payload, adminHeaders)
        .catch((e) => e)

      expect(response.status).toEqual(200)
      expect(response.data.product).toEqual(
        expect.objectContaining({
          categories: [
            expect.objectContaining({
              id: categoryWithProductId,
            }),
            expect.objectContaining({
              id: categoryWithoutProductId,
            }),
          ],
        })
      )
    })

    it("throws error when creating a product with invalid category ID", async () => {
      const api = useApi()
      const categoryNotFoundId = "category-doesnt-exist"

      const payload = {
        title: "Test",
        description: "test-product-description",
        categories: [{ id: categoryNotFoundId }],
      }

      const error = await api
        .post("/admin/products", payload, adminHeaders)
        .catch((e) => e)

      expect(error.response.status).toEqual(404)
      expect(error.response.data.type).toEqual("not_found")
      expect(error.response.data.message).toEqual(
        `Product_category with product_category_id ${categoryNotFoundId} does not exist.`
      )
    })

    it("updates a product's categories", async () => {
      const api = useApi()

      const payload = {
        categories: [{ id: categoryWithoutProductId }],
      }

      const response = await api.post(
        `/admin/products/${testProductId}`,
        payload,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.product).toEqual(
        expect.objectContaining({
          id: testProductId,
          handle: "test-product",
          categories: [
            expect.objectContaining({
              id: categoryWithoutProductId,
            }),
          ],
        })
      )
    })

    it("remove all categories of a product", async () => {
      const api = useApi()
      const category = await simpleProductCategoryFactory(dbConnection, {
        id: "existing-category",
        name: "existing category",
        products: [{ id: "test-product" }],
      })

      const payload = {
        categories: [],
      }

      const response = await api.post(
        "/admin/products/test-product",
        payload,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.product).toEqual(
        expect.objectContaining({
          id: "test-product",
          categories: [],
        })
      )
    })

    it("throws error if product categories input is incorreect", async () => {
      const api = useApi()
      const payload = {
        categories: [{ incorrect: "test-category-d2B" }],
      }

      const error = await api
        .post("/admin/products/test-product", payload, adminHeaders)
        .catch((e) => e)

      expect(error.response.status).toEqual(400)
      expect(error.response.data.type).toEqual("invalid_data")
      expect(error.response.data.message).toEqual(
        "property incorrect should not exist, id must be a string"
      )
    })
  })
})
