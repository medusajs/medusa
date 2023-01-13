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

  describe("GET /store/product-categories/:id", () => {
    beforeEach(async () => {
      productCategoryParent = await simpleProductCategoryFactory(dbConnection, {
        name: "category parent",
        is_active: true,
      })

      productCategory = await simpleProductCategoryFactory(dbConnection, {
        name: "category",
        parent_category: productCategoryParent,
        is_active: true,
      })

      productCategoryChild = await simpleProductCategoryFactory(dbConnection, {
        name: "category child",
        parent_category: productCategory,
        is_active: true,
      })

      productCategoryChild2 = await simpleProductCategoryFactory(dbConnection, {
        name: "category child 2",
        parent_category: productCategory,
        is_internal: true,
        is_active: true,
      })

      productCategoryChild3 = await simpleProductCategoryFactory(dbConnection, {
        name: "category child 3",
        parent_category: productCategory,
        is_active: false,
      })
    })

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
})
