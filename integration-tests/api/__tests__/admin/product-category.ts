import path from "path"

import startServerWithEnvironment from "../../../helpers/start-server-with-environment"
import { useApi } from "../../../helpers/use-api"
import { useDb } from "../../../helpers/use-db"
import adminSeeder from "../../helpers/admin-seeder"
import { simpleProductCategoryFactory } from "../../factories"

jest.setTimeout(30000)

const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("/admin/product-categories", () => {
  let medusaProcess
  let dbConnection
  let productCategory = null
  let productCategoryChild = null
  let productCategoryParent = null
  let productCategoryChild2 = null

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

  describe("GET /admin/product-categories/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      productCategoryParent = await simpleProductCategoryFactory(dbConnection, {
        name: "category parent",
        handle: "category-parent",
      })

      productCategory = await simpleProductCategoryFactory(dbConnection, {
        name: "category",
        handle: "category",
        parent_category: productCategoryParent,
      })

      productCategoryChild = await simpleProductCategoryFactory(dbConnection, {
        name: "category child",
        handle: "category-child",
        parent_category: productCategory,
      })

      productCategoryChild2 = await simpleProductCategoryFactory(dbConnection, {
        name: "category child 2",
        handle: "category-child-2",
        parent_category: productCategoryChild,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("gets product category with children tree and parent", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/product-categories/${productCategory.id}`,
        adminHeaders
      )

      expect(response.data.product_category).toEqual(
        expect.objectContaining({
          id: productCategory.id,
          name: productCategory.name,
          handle: productCategory.handle,
          parent_category: expect.objectContaining({
            id: productCategoryParent.id,
            name: productCategoryParent.name,
            handle: productCategoryParent.handle,
          }),
          category_children: [
            expect.objectContaining({
              id: productCategoryChild.id,
              name: productCategoryChild.name,
              handle: productCategoryChild.handle,
              category_children: [
                expect.objectContaining({
                  id: productCategoryChild2.id,
                  name: productCategoryChild2.name,
                  handle: productCategoryChild2.handle,
                  category_children: []
                })
              ]
            })
          ]
        })
      )

      expect(response.status).toEqual(200)
    })
  })

  describe("DELETE /admin/product-categories/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      productCategoryParent = await simpleProductCategoryFactory(dbConnection, {
        name: "category parent",
        handle: "category-parent",
      })

      productCategory = await simpleProductCategoryFactory(dbConnection, {
        name: "category",
        handle: "category",
        parent_category: productCategoryParent,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("throws a not found error with an invalid ID", async () => {
      const api = useApi()

      const error = await api.delete(
        `/admin/product-categories/invalid-id`,
        adminHeaders
      ).catch(e => e)

      expect(error.response.status).toEqual(404)
      expect(error.response.data.type).toEqual("not_found")
      expect(error.response.data.message).toEqual(
        "ProductCategory with id: invalid-id was not found"
      )
    })

    it("throws a not allowed error for a category with children", async () => {
      const api = useApi()

      const error = await api.delete(
        `/admin/product-categories/${productCategoryParent.id}`,
        adminHeaders
      ).catch(e => e)

      expect(error.response.status).toEqual(400)
      expect(error.response.data.type).toEqual("not_allowed")
      expect(error.response.data.message).toEqual(
        `Deleting ProductCategory (${productCategoryParent.id}) with category children is not allowed`
      )
    })

    it("soft deletes a product category with no children successfully", async () => {
      const api = useApi()

      const deleteResponse = await api.delete(
        `/admin/product-categories/${productCategory.id}`,
        adminHeaders
      )

      expect(deleteResponse.status).toEqual(200)
      expect(deleteResponse.data.id).toEqual(productCategory.id)
      expect(deleteResponse.data.deleted).toBeTruthy()
      expect(deleteResponse.data.object).toEqual("product_category")

      const errorFetchingDeleted = await api.get(
        `/admin/product-categories/${productCategory.id}`,
        adminHeaders
      ).catch(e => e)

      expect(errorFetchingDeleted.response.status).toEqual(404)
    })
  })
})
