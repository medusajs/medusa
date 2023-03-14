const path = require("path")
const setupServer = require("../../../../helpers/setup-server")
const { useApi } = require("../../../../helpers/use-api")
const { initDb, useDb } = require("../../../../helpers/use-db")

const {
  simpleProductCategoryFactory,
} = require("../../../factories")

const productSeeder = require("../../../helpers/store-product-seeder")
const adminSeeder = require("../../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/store/products", () => {
  let medusaProcess
  let dbConnection

  const testProductId = "test-product"
  const testProductId1 = "test-product1"
  const testProductFilteringId1 = "test-product_filtering_1"
  const testProductFilteringId2 = "test-product_filtering_2"

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({
      cwd,
      env: { MEDUSA_FF_PRODUCT_CATEGORIES: true }
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("GET /store/products [MEDUSA_FF_PRODUCT_CATEGORIES=true]", () => {
    let categoryWithProduct
    let categoryWithoutProduct
    let inactiveCategoryWithProduct
    let internalCategoryWithProduct
    let nestedCategoryWithProduct
    let nested2CategoryWithProduct
    const nestedCategoryWithProductId = "nested-category-with-product-id"
    const nested2CategoryWithProductId = "nested2-category-with-product-id"
    const categoryWithProductId = "category-with-product-id"
    const categoryWithoutProductId = "category-without-product-id"
    const inactiveCategoryWithProductId = "inactive-category-with-product-id"
    const internalCategoryWithProductId = "inactive-category-with-product-id"

    beforeEach(async () => {
      const manager = dbConnection.manager

      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)

      categoryWithProduct = await simpleProductCategoryFactory(dbConnection, {
        id: categoryWithProductId,
        name: "category with Product",
        products: [{ id: testProductId }],
        is_active: true,
        is_internal: false,
      })

      nestedCategoryWithProduct = await simpleProductCategoryFactory(
        dbConnection,
        {
          id: nestedCategoryWithProductId,
          name: "nested category with Product1",
          parent_category: categoryWithProduct,
          products: [{ id: testProductId1 }],
          is_active: true,
          is_internal: false,
        }
      )

      inactiveCategoryWithProduct = await simpleProductCategoryFactory(dbConnection, {
        id: inactiveCategoryWithProductId,
        name: "inactive category with Product",
        products: [{ id: testProductFilteringId2 }],
        parent_category: nestedCategoryWithProduct,
        is_active: false,
        is_internal: false,
        rank: 0,
      })

      internalCategoryWithProduct = await simpleProductCategoryFactory(dbConnection, {
        id: inactiveCategoryWithProductId,
        name: "inactive category with Product",
        products: [{ id: testProductFilteringId2 }],
        parent_category: nestedCategoryWithProduct,
        is_active: true,
        is_internal: true,
        rank: 1,
      })

      nested2CategoryWithProduct = await simpleProductCategoryFactory(
        dbConnection,
        {
          id: nested2CategoryWithProductId,
          name: "nested2 category with Product1",
          parent_category: nestedCategoryWithProduct,
          products: [{ id: testProductFilteringId1 }],
          is_active: true,
          is_internal: false,
          rank: 2,
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
      const response = await api.get(`/store/products?${params}`)

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
      const response = await api.get(`/store/products?${params}`)

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
      const response = await api.get(`/store/products?${params}`)

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(3)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: testProductId1,
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
      const response = await api.get(`/store/products?${params}`)

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(0)
    })

    it("returns only active and public products with include_category_children", async () => {
      const api = useApi()

      const params = `category_id[]=${nestedCategoryWithProductId}&include_category_children=true`
      const response = await api.get(`/store/products?${params}`)

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(2)

      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: testProductFilteringId1,
          }),
          expect.objectContaining({
            id: testProductId1,
          }),
        ])
      )
    })

    it("does not query products with category that are inactive", async () => {
      const api = useApi()

      const params = `category_id[]=${inactiveCategoryWithProductId}`
      const response = await api.get(`/store/products?${params}`)

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(0)
    })

    it("does not query products with category that are internal", async () => {
      const api = useApi()

      const params = `category_id[]=${internalCategoryWithProductId}`
      const response = await api.get(`/store/products?${params}`)

      expect(response.status).toEqual(200)
      expect(response.data.products).toHaveLength(0)
    })
  })
})
