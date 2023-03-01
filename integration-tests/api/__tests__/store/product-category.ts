import path from "path"

import startServerWithEnvironment from "../../../helpers/start-server-with-environment"
import { useApi } from "../../../helpers/use-api"
import { useDb } from "../../../helpers/use-db"
import { simpleProductCategoryFactory } from "../../factories"

jest.setTimeout(30000)

describe("/store/product-categories", () => {
  let medusaProcess
  let dbConnection
  let productCategory = null
  let productCategory2 = null
  let productCategoryChild = null
  let productCategoryParent = null
  let productCategoryChild2 = null
  let productCategoryChild3 = null
  let productCategoryChild4 = null

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_PRODUCT_CATEGORIES: true },
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  beforeEach(async () => {
    productCategoryParent = await simpleProductCategoryFactory(dbConnection, {
      name: "category parent",
      is_active: true,
      is_internal: false,
      position: 0,
    })

    productCategory = await simpleProductCategoryFactory(dbConnection, {
      name: "category",
      parent_category: productCategoryParent,
      is_active: true,
      position: 0,
    })

    productCategoryChild = await simpleProductCategoryFactory(dbConnection, {
      name: "category child",
      parent_category: productCategory,
      is_active: true,
      is_internal: false,
      position: 3
    })

    productCategoryChild2 = await simpleProductCategoryFactory(dbConnection, {
      name: "category child 2",
      parent_category: productCategory,
      is_internal: true,
      is_active: true,
      position: 0,
    })

    productCategoryChild3 = await simpleProductCategoryFactory(dbConnection, {
      name: "category child 3",
      parent_category: productCategory,
      is_active: false,
      is_internal: false,
      position: 1,
    })

    productCategoryChild4 = await simpleProductCategoryFactory(dbConnection, {
      name: "category child 4",
      parent_category: productCategory,
      is_active: true,
      is_internal: false,
      position: 2
    })
  })

  describe("GET /store/product-categories/:id", () => {
    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("gets product category with children tree and parent", async () => {
      const api = useApi()

      const response = await api.get(
        `/store/product-categories/${productCategory.id}?fields=handle,name`,
      )

      expect(response.data.product_category).toEqual(
        expect.objectContaining({
          id: productCategory.id,
          handle: productCategory.handle,
          name: productCategory.name,
          parent_category: expect.objectContaining({
            id: productCategoryParent.id,
            handle: productCategoryParent.handle,
            name: productCategoryParent.name,
          }),
          category_children: [
            expect.objectContaining({
              id: productCategoryChild.id,
              handle: productCategoryChild.handle,
              name: productCategoryChild.name,
            }),
            expect.objectContaining({
              id: productCategoryChild4.id,
              handle: productCategoryChild4.handle,
              name: productCategoryChild4.name,
            }),
          ]
        })
      )

      expect(response.status).toEqual(200)
    })

    it("throws error on querying not allowed fields", async () => {
      const api = useApi()

      const error = await api.get(
        `/store/product-categories/${productCategory.id}?fields=mpath`,
      ).catch(e => e)

      expect(error.response.status).toEqual(400)
      expect(error.response.data.type).toEqual('invalid_data')
      expect(error.response.data.message).toEqual('Fields [mpath] are not valid')
    })

    it("throws error on querying for internal product category", async () => {
      const api = useApi()

      const error = await api.get(
        `/store/product-categories/${productCategoryChild2.id}`,
      ).catch(e => e)

      expect(error.response.status).toEqual(404)
      expect(error.response.data.type).toEqual('not_found')
      expect(error.response.data.message).toEqual(
        `ProductCategory with id: ${productCategoryChild2.id} was not found`
      )
    })

    it("throws error on querying for inactive product category", async () => {
      const api = useApi()

      const error = await api.get(
        `/store/product-categories/${productCategoryChild3.id}`,
      ).catch(e => e)

      expect(error.response.status).toEqual(404)
      expect(error.response.data.type).toEqual('not_found')
      expect(error.response.data.message).toEqual(
        `ProductCategory with id: ${productCategoryChild3.id} was not found`
      )
    })
  })

  describe("GET /store/product-categories", () => {
    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("gets list of product category with immediate children and parents", async () => {
      const api = useApi()

      const response = await api.get(
        `/store/product-categories`,
      )

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(4)
      expect(response.data.offset).toEqual(0)
      expect(response.data.limit).toEqual(100)

      expect(response.data.product_categories).toEqual(
        [
          expect.objectContaining({
            id: productCategory.id,
            position: 0,
            parent_category: expect.objectContaining({
              id: productCategoryParent.id,
            }),
            category_children: [
              expect.objectContaining({
                id: productCategoryChild4.id,
                position: 2,
              }),
              expect.objectContaining({
                id: productCategoryChild.id,
                position: 3,
              }),
            ],
          }),
          expect.objectContaining({
            id: productCategoryParent.id,
            parent_category: null,
            position: 0,
            category_children: [
              expect.objectContaining({
                id: productCategory.id,
              })
            ],
          }),
          expect.objectContaining({
            id: productCategoryChild4.id,
            position: 2,
            parent_category: expect.objectContaining({
              id: productCategory.id,
            }),
            category_children: [],
          }),
          expect.objectContaining({
            id: productCategoryChild.id,
            position: 3,
            parent_category: expect.objectContaining({
              id: productCategory.id,
            }),
            category_children: [],
          }),
        ]
      )
    })

    it("throws error when querying not allowed fields", async () => {
      const api = useApi()

      const error = await api.get(
        `/store/product-categories?is_internal=true`,
      ).catch(e => e)

      expect(error.response.status).toEqual(400)
      expect(error.response.data.type).toEqual('invalid_data')
      expect(error.response.data.message).toEqual('property is_internal should not exist')
    })

    it("filters based on free text on name and handle columns", async () => {
      const api = useApi()

      const response = await api.get(
        `/store/product-categories?q=category-parent`,
      )

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.product_categories[0].id).toEqual(productCategoryParent.id)
    })

    it("filters based on parent category", async () => {
      const api = useApi()

      const response = await api.get(
        `/store/product-categories?parent_category_id=${productCategory.id}`,
      )

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(2)
      expect(response.data.product_categories).toEqual(
        [
          expect.objectContaining({
            id: productCategoryChild4.id,
            category_children: [],
            parent_category: expect.objectContaining({
              id: productCategory.id,
            }),
            position: 2
          }),
          expect.objectContaining({
            id: productCategoryChild.id,
            category_children: [],
            parent_category: expect.objectContaining({
              id: productCategory.id,
            }),
            position: 3
          }),
        ]
      )

      const nullCategoryResponse = await api.get(
        `/store/product-categories?parent_category_id=null`,
      ).catch(e => e)

      expect(nullCategoryResponse.status).toEqual(200)
      expect(nullCategoryResponse.data.count).toEqual(1)
      expect(nullCategoryResponse.data.product_categories[0].id).toEqual(productCategoryParent.id)
    })
  })
})
