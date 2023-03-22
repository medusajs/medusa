import path from "path"
import { Product, ProductCategory } from "@medusajs/medusa"
import { In } from "typeorm"

import startServerWithEnvironment
  from "../../../helpers/start-server-with-environment"
import { useApi } from "../../../helpers/use-api"
import { useDb } from "../../../helpers/use-db"
import adminSeeder from "../../helpers/admin-seeder"
import {
  simpleProductCategoryFactory,
  simpleProductFactory,
} from "../../factories"

jest.setTimeout(30000)

const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("/admin/product-categories", () => {
  let medusaProcess
  let dbConnection
  let productCategory!: ProductCategory
  let productCategory1!: ProductCategory
  let productCategory2!: ProductCategory
  let productCategoryChild!: ProductCategory
  let productCategoryParent!: ProductCategory
  let productCategoryChild0!: ProductCategory
  let productCategoryChild1!: ProductCategory
  let productCategoryChild2!: ProductCategory
  let productCategoryChild3!: ProductCategory

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

  describe("GET /admin/product-categories", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      productCategoryParent = await simpleProductCategoryFactory(dbConnection, {
        name: "Mens",
        rank: 0,
      })

      productCategory = await simpleProductCategoryFactory(dbConnection, {
        name: "sweater",
        parent_category: productCategoryParent,
        is_internal: true,
        rank: 0
      })

      productCategoryChild = await simpleProductCategoryFactory(dbConnection, {
        name: "cashmere",
        parent_category: productCategory,
        rank: 0
      })

      productCategoryChild0 = await simpleProductCategoryFactory(dbConnection, {
        name: "rank 2",
        parent_category: productCategoryChild,
        rank: 2
      })

      productCategoryChild1 = await simpleProductCategoryFactory(dbConnection, {
        name: "rank 1",
        parent_category: productCategoryChild,
        rank: 1
      })

      productCategoryChild2 = await simpleProductCategoryFactory(dbConnection, {
        name: "rank 0",
        parent_category: productCategoryChild,
        rank: 0
      })

      productCategoryChild3 = await simpleProductCategoryFactory(dbConnection, {
        name: "rank 3",
        parent_category: productCategoryChild,
        rank: 3
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("gets list of product category with immediate children and parents", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/product-categories`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(7)
      expect(response.data.offset).toEqual(0)
      expect(response.data.limit).toEqual(100)

      expect(response.data.product_categories).toEqual(
        [
          expect.objectContaining({
            id: productCategoryChild.id,
            parent_category: expect.objectContaining({
              id: productCategory.id,
              handle: productCategory.handle,
              rank: 0
            }),
            category_children: [
              expect.objectContaining({
                id: productCategoryChild2.id,
                handle: productCategoryChild2.handle,
                rank: 0
              }),
              expect.objectContaining({
                id: productCategoryChild1.id,
                handle: productCategoryChild1.handle,
                rank: 1
              }),
              expect.objectContaining({
                id: productCategoryChild0.id,
                handle: productCategoryChild0.handle,
                rank: 2
              }),
              expect.objectContaining({
                id: productCategoryChild3.id,
                handle: productCategoryChild3.handle,
                rank: 3
              }),
            ],
          }),
          expect.objectContaining({
            id: productCategoryParent.id,
            parent_category: null,
            category_children: [
              expect.objectContaining({
                id: productCategory.id,
                handle: productCategory.handle,
                rank: 0
              })
            ],
          }),
          expect.objectContaining({
            id: productCategoryChild2.id,
            parent_category: expect.objectContaining({
              id: productCategoryChild.id,
            }),
            category_children: [],
            rank: 0,
            handle: productCategoryChild2.handle,
          }),
          expect.objectContaining({
            id: productCategory.id,
            parent_category: expect.objectContaining({
              id: productCategoryParent.id,
              rank: 0,
              handle: productCategoryParent.handle,
            }),
            category_children: [
              expect.objectContaining({
                id: productCategoryChild.id,
                handle: productCategoryChild.handle,
                rank: 0,
              })
            ],
          }),
          expect.objectContaining({
            id: productCategoryChild1.id,
            parent_category: expect.objectContaining({
              id: productCategoryChild.id,
              handle: productCategoryChild.handle,
              rank: 0
            }),
            category_children: [],
            handle: productCategoryChild1.handle,
            rank: 1
          }),
          expect.objectContaining({
            id: productCategoryChild0.id,
            parent_category: expect.objectContaining({
              id: productCategoryChild.id,
              handle: productCategoryChild.handle,
              rank: 0
            }),
            category_children: [],
            handle: productCategoryChild0.handle,
            rank: 2
          }),
          expect.objectContaining({
            id: productCategoryChild3.id,
            parent_category: expect.objectContaining({
              id: productCategoryChild.id,
              handle: productCategoryChild.handle,
              rank: 0
            }),
            category_children: [],
            handle: productCategoryChild3.handle,
            rank: 3
          }),
        ]
      )
    })

    it("filters based on whitelisted attributes of the data model", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/product-categories?is_internal=true`,
        adminHeaders,
      )

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.product_categories[0].id).toEqual(productCategory.id)
    })

    it("filters based on free text on name and handle columns", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/product-categories?q=men`,
        adminHeaders,
      )

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.product_categories[0].id).toEqual(productCategoryParent.id)
    })

    it("filters based on parent category", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/product-categories?parent_category_id=${productCategoryParent.id}`,
        adminHeaders,
      )

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.product_categories[0].id).toEqual(productCategory.id)

      const nullCategoryResponse = await api.get(
        `/admin/product-categories?parent_category_id=null`,
        adminHeaders,
      ).catch(e => e)

      expect(nullCategoryResponse.status).toEqual(200)
      expect(nullCategoryResponse.data.count).toEqual(1)
      expect(nullCategoryResponse.data.product_categories[0].id).toEqual(productCategoryParent.id)
    })

    it("adds all descendants to categories in a nested way", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/product-categories?parent_category_id=null&include_descendants_tree=true`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.product_categories).toEqual(
        [
          expect.objectContaining({
            id: productCategoryParent.id,
            rank: 0,
            handle: productCategoryParent.handle,
            category_children: [
              expect.objectContaining({
                id: productCategory.id,
                rank: 0,
                handle: productCategory.handle,
                category_children: [
                  expect.objectContaining({
                    id: productCategoryChild.id,
                    category_children: [
                      expect.objectContaining({
                        id: productCategoryChild2.id,
                        category_children: [],
                        handle: productCategoryChild2.handle,
                        rank: 0
                      }),
                      expect.objectContaining({
                        id: productCategoryChild1.id,
                        category_children: [],
                        handle: productCategoryChild1.handle,
                        rank: 1
                      }),
                      expect.objectContaining({
                        id: productCategoryChild0.id,
                        category_children: [],
                        handle: productCategoryChild0.handle,
                        rank: 2
                      }),
                      expect.objectContaining({
                        id: productCategoryChild3.id,
                        category_children: [],
                        handle: productCategoryChild3.handle,
                        rank: 3
                      })
                    ],
                  })
                ]
              })
            ],
          }),
        ]
      )
    })
  })

  describe("POST /admin/product-categories", () => {
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

    it("throws an error if required fields are missing", async () => {
      const api = useApi()

      const error = await api.post(
        `/admin/product-categories`,
        {},
        adminHeaders
      ).catch(e => e)

      expect(error.response.status).toEqual(400)
      expect(error.response.data.type).toEqual("invalid_data")
      expect(error.response.data.message).toEqual(
        "name should not be empty, name must be a string"
      )
    })

    it("successfully creates a product category", async () => {
      const api = useApi()
      const payload = {
        name: "test",
        handle: "test",
        is_internal: true,
        parent_category_id: productCategory.id,
      }

      const response = await api.post(
        `/admin/product-categories`,
        payload,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual(
        expect.objectContaining({
          product_category: expect.objectContaining({
            name: payload.name,
            handle: payload.handle,
            is_internal: payload.is_internal,
            is_active: false,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            parent_category: expect.objectContaining({
              id: payload.parent_category_id
            }),
            category_children: [],
            rank: 0,
          }),
        })
      )
    })

    it("successfully creates a product category with a rank", async () => {
      const api = useApi()
      const payload = {
        name: "test",
        handle: "test",
        is_internal: true,
        parent_category_id: productCategoryParent.id,
      }

      const response = await api.post(
        `/admin/product-categories`,
        payload,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual(
        expect.objectContaining({
          product_category: expect.objectContaining({
            name: payload.name,
            handle: payload.handle,
            is_internal: payload.is_internal,
            is_active: false,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            parent_category: expect.objectContaining({
              id: productCategoryParent.id
            }),
            category_children: [],
            rank: 1,
          }),
        })
      )
    })

    it("root parent returns children correctly on creating new category", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/product-categories`,
        {
          name: "last descendant",
          parent_category_id: productCategory.id,
        },
        adminHeaders
      )
      const lastDescendant = response.data.product_category

      const parentResponse = await api.get(
        `/admin/product-categories/${productCategoryParent.id}`,
        adminHeaders
      )

      expect(parentResponse.data.product_category).toEqual(
        expect.objectContaining({
          id: productCategoryParent.id,
          category_children: [
            expect.objectContaining({
              id: productCategory.id,
              category_children: [
                expect.objectContaining({
                  id: lastDescendant.id,
                  category_children: []
                })
              ]
            })
          ]
        })
      )
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

      productCategory1 = await simpleProductCategoryFactory(dbConnection, {
        name: "category-1",
        parent_category: productCategoryParent,
        rank: 1
      })

      productCategory2 = await simpleProductCategoryFactory(dbConnection, {
        name: "category-2",
        parent_category: productCategoryParent,
        rank: 2
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("returns successfully with an invalid ID", async () => {
      const api = useApi()

      const response = await api.delete(
        `/admin/product-categories/invalid-id`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.id).toEqual("invalid-id")
      expect(response.data.deleted).toBeTruthy()
      expect(response.data.object).toEqual("product-category")
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

    it("deletes a product category with no children successfully", async () => {
      const api = useApi()

      const deleteResponse = await api.delete(
        `/admin/product-categories/${productCategory.id}`,
        adminHeaders
      ).catch(e => e)

      expect(deleteResponse.status).toEqual(200)
      expect(deleteResponse.data.id).toEqual(productCategory.id)
      expect(deleteResponse.data.deleted).toBeTruthy()
      expect(deleteResponse.data.object).toEqual("product-category")

      const errorFetchingDeleted = await api.get(
        `/admin/product-categories/${productCategory.id}`,
        adminHeaders
      ).catch(e => e)

      expect(errorFetchingDeleted.response.status).toEqual(404)
    })

    it("deleting a product category reorders siblings accurately", async () => {
      const api = useApi()

      const deleteResponse = await api.delete(
        `/admin/product-categories/${productCategory.id}`,
        adminHeaders
      ).catch(e => e)

      expect(deleteResponse.status).toEqual(200)

      const siblingsResponse = await api.get(
        `/admin/product-categories?parent_category_id=${productCategoryParent.id}`,
        adminHeaders
      ).catch(e => e)

      expect(siblingsResponse.data.product_categories).toEqual(
        [
          expect.objectContaining({
            id: productCategory1.id,
            rank: 0
          }),
          expect.objectContaining({
            id: productCategory2.id,
            rank: 1
          }),
        ]
      )
    })
  })

  describe("POST /admin/product-categories/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      productCategoryParent = await simpleProductCategoryFactory(dbConnection, {
        name: "category parent",
      })

      productCategory = await simpleProductCategoryFactory(dbConnection, {
        name: "category-0",
        parent_category: productCategoryParent,
        rank: 0
      })

      productCategory1 = await simpleProductCategoryFactory(dbConnection, {
        name: "category-1",
        parent_category: productCategoryParent,
        rank: 1
      })

      productCategory2 = await simpleProductCategoryFactory(dbConnection, {
        name: "category-2",
        parent_category: productCategoryParent,
        rank: 2
      })

      productCategoryChild = await simpleProductCategoryFactory(dbConnection, {
        name: "category child",
        parent_category: productCategory,
        rank: 0,
      })

      productCategoryChild0 = await simpleProductCategoryFactory(dbConnection, {
        name: "category child 0",
        parent_category: productCategoryChild,
        rank: 0,
      })

      productCategoryChild1 = await simpleProductCategoryFactory(dbConnection, {
        name: "category child 1",
        parent_category: productCategoryChild,
        rank: 1
      })

      productCategoryChild2 = await simpleProductCategoryFactory(dbConnection, {
        name: "category child 2",
        parent_category: productCategoryChild,
        rank: 2,
      })

      productCategoryChild3 = await simpleProductCategoryFactory(dbConnection, {
        name: "category child 3",
        parent_category: productCategoryChild,
        rank: 3,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("throws an error if invalid ID is sent", async () => {
      const api = useApi()

      const error = await api.post(
        `/admin/product-categories/not-found-id`,
        {
          name: 'testing'
        },
        adminHeaders
      ).catch(e => e)

      expect(error.response.status).toEqual(404)
      expect(error.response.data.type).toEqual("not_found")
      expect(error.response.data.message).toEqual(
        "ProductCategory with id: not-found-id was not found"
      )
    })

    it("throws an error if rank is negative", async () => {
      const api = useApi()

      const error = await api.post(
        `/admin/product-categories/not-found-id`,
        {
          rank: -1
        },
        adminHeaders
      ).catch(e => e)

      expect(error.response.status).toEqual(400)
      expect(error.response.data.type).toEqual("invalid_data")
      expect(error.response.data.message).toEqual(
        "rank must not be less than 0"
      )
    })

    it("throws an error if invalid attribute is sent", async () => {
      const api = useApi()

      const error = await api.post(
        `/admin/product-categories/${productCategory.id}`,
        {
          invalid_property: 'string'
        },
        adminHeaders
      ).catch(e => e)

      expect(error.response.status).toEqual(400)
      expect(error.response.data.type).toEqual("invalid_data")
      expect(error.response.data.message).toEqual(
        "property invalid_property should not exist"
      )
    })

    it("successfully updates a product category", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/product-categories/${productCategoryChild2.id}`,
        {
          name: "test",
          handle: "test",
          is_internal: true,
          is_active: true,
          parent_category_id: productCategory.id,
        },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual(
        expect.objectContaining({
          product_category: expect.objectContaining({
            name: "test",
            handle: "test",
            is_internal: true,
            is_active: true,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            parent_category: expect.objectContaining({
              id: productCategory.id,
            }),
            category_children: [],
            rank: 1,
          }),
        })
      )
    })

    it("updating properties other than rank should not change its rank", async () => {
      const api = useApi()

      expect(productCategory.rank).toEqual(0)

      const response = await api.post(
        `/admin/product-categories/${productCategory.id}`,
        {
          name: "different-name",
        },
        adminHeaders
      )
      expect(response.status).toEqual(200)
      expect(response.data.product_category.rank).toEqual(productCategory.rank)
    })

    it("root parent returns children correctly on updating new category", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/product-categories/${productCategoryChild.id}`,
        {
          parent_category_id: productCategory.id,
        },
        adminHeaders
      )
      const lastDescendant = response.data.product_category

      const parentResponse = await api.get(
        `/admin/product-categories/${productCategoryParent.id}`,
        adminHeaders
      )

      expect(parentResponse.data.product_category).toEqual(
        expect.objectContaining({
          id: productCategoryParent.id,
          category_children: [
            expect.objectContaining({
              id: productCategory.id,
              rank: 0,
              category_children: [
                expect.objectContaining({
                  id: productCategoryChild.id,
                  rank: 0,
                })
              ],
            }),
            expect.objectContaining({
              id: productCategory1.id,
              category_children: [],
              rank: 1
            }),
            expect.objectContaining({
              id: productCategory2.id,
              category_children: [],
              rank: 2
            }),
          ]
        })
      )
    })

    it("when parent is updated, rank is updated to elements count + 1", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/product-categories/${productCategoryChild1.id}`,
        {
          parent_category_id: productCategoryParent.id,
        },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual(
        expect.objectContaining({
          product_category: expect.objectContaining({
            parent_category: expect.objectContaining({
              id: productCategoryParent.id,
            }),
            rank: 3,
          }),
        })
      )
    })

    it("when parent is updated with rank, rank accurately updated", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/product-categories/${productCategoryChild1.id}`,
        {
          parent_category_id: productCategoryParent.id,
          rank: 0,
        },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual(
        expect.objectContaining({
          product_category: expect.objectContaining({
            parent_category: expect.objectContaining({
              id: productCategoryParent.id,
            }),
            rank: 0,
          }),
        })
      )
    })

    it("when only rank is updated, rank should be updated", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/product-categories/${productCategoryChild1.id}`,
        {
          rank: 0
        },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual(
        expect.objectContaining({
          product_category: expect.objectContaining({
            rank: 0,
          }),
        })
      )
    })

    it("when rank is greater than list count, rank is updated to updated to elements count + 1", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/product-categories/${productCategoryChild1.id}`,
        {
          rank: 99
        },
        adminHeaders
      )

      expect(response.data).toEqual(
        expect.objectContaining({
          product_category: expect.objectContaining({
            rank: 3,
          }),
        })
      )
    })

    it("when rank is updated, it accurately updates sibling ranks", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/product-categories/${productCategoryChild2.id}`,
        {
          rank: 0
        },
        adminHeaders
      )

      const parentResponse = await api.get(
        `/admin/product-categories/${productCategoryChild2.parent_category_id}`,
        adminHeaders
      )

      expect(parentResponse.data.product_category).toEqual(
        expect.objectContaining({
          id: productCategoryChild2.parent_category_id,
          category_children: [
            expect.objectContaining({
              id: productCategoryChild2.id,
              rank: 0
            }),
            expect.objectContaining({
              id: productCategoryChild0.id,
              rank: 1,
            }),
            expect.objectContaining({
              id: productCategoryChild1.id,
              rank: 2
            }),
            expect.objectContaining({
              id: productCategoryChild3.id,
              rank: 3
            }),
          ]
        })
      )
    })
  })

  describe("POST /admin/product-categories/:id/products/batch", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      productCategory = await simpleProductCategoryFactory(dbConnection, {
        id: "test-category",
        name: "test category",
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should add products to a product category", async () => {
      const api = useApi()
      const testProduct1 = await simpleProductFactory(dbConnection, {
        id: "test-product-1",
        title: "test product 1",
      })

      const testProduct2 = await simpleProductFactory(dbConnection, {
        id: "test-product-2",
        title: "test product 2",
      })

      const payload = {
        product_ids: [{ id: testProduct1.id }, { id: testProduct2.id }],
      }

      const response = await api.post(
        `/admin/product-categories/${productCategory.id}/products/batch`,
        payload,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.product_category).toEqual(
        expect.objectContaining({
          id: productCategory.id,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )

      const products = await dbConnection.manager.find(Product, {
        where: { id: In([testProduct1.id, testProduct2.id]) },
        relations: ["categories"],
      })

      expect(products[0].categories).toEqual([
        expect.objectContaining({
          id: productCategory.id
        })
      ])

      expect(products[1].categories).toEqual([
        expect.objectContaining({
          id: productCategory.id
        })
      ])
    })

    it("throws error when product ID is invalid", async () => {
      const api = useApi()

      const payload = {
        product_ids: [{ id: "product-id-invalid" }],
      }

      const error = await api.post(
        `/admin/product-categories/${productCategory.id}/products/batch`,
        payload,
        adminHeaders
      ).catch(e => e)

      expect(error.response.status).toEqual(400)
      expect(error.response.data).toEqual({
        errors: ["Products product-id-invalid do not exist"],
        message: "Provided request body contains errors. Please check the data and retry the request"
      })
    })

    it("throws error when category ID is invalid", async () => {
      const api = useApi()
      const payload = { product_ids: [] }

      const error = await api.post(
        `/admin/product-categories/invalid-category-id/products/batch`,
        payload,
        adminHeaders
      ).catch(e => e)

      expect(error.response.status).toEqual(404)
      expect(error.response.data).toEqual({
        message: "ProductCategory with id: invalid-category-id was not found",
        type: "not_found",
      })
    })

    it("throws error trying to expand not allowed relations", async () => {
      const api = useApi()
      const payload = { product_ids: [] }

      const error = await api.post(
        `/admin/product-categories/invalid-category-id/products/batch?expand=products`,
        payload,
        adminHeaders
      ).catch(e => e)

      expect(error.response.status).toEqual(400)
      expect(error.response.data).toEqual({
        message: "Relations [products] are not valid",
        type: "invalid_data",
      })
    })
  })

  describe("DELETE /admin/product-categories/:id/products/batch", () => {
    let testProduct1, testProduct2

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      testProduct1 = await simpleProductFactory(dbConnection, {
        id: "test-product-1",
        title: "test product 1",
      })

      testProduct2 = await simpleProductFactory(dbConnection, {
        id: "test-product-2",
        title: "test product 2",
      })

      productCategory = await simpleProductCategoryFactory(dbConnection, {
        id: "test-category",
        name: "test category",
        products: [testProduct1, testProduct2]
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should remove products from a product category", async () => {
      const api = useApi()

      const payload = {
        product_ids: [{ id: testProduct2.id }],
      }

      const response = await api.delete(
        `/admin/product-categories/${productCategory.id}/products/batch`,
        {
          ...adminHeaders,
          data: payload,
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.product_category).toEqual(
        expect.objectContaining({
          id: productCategory.id,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )

      const products = await dbConnection.manager.find(Product, {
        where: { id: In([testProduct1.id, testProduct2.id]) },
        relations: ["categories"],
      })

      expect(products[0].categories).toEqual([
        expect.objectContaining({
          id: productCategory.id
        })
      ])

      expect(products[1].categories).toEqual([])
    })

    it("throws error when product ID is invalid", async () => {
      const api = useApi()

      const payload = {
        product_ids: [{ id: "product-id-invalid" }],
      }

      const error = await api.delete(
        `/admin/product-categories/${productCategory.id}/products/batch`,
        {
          ...adminHeaders,
          data: payload,
        }
      ).catch(e => e)

      expect(error.response.status).toEqual(400)
      expect(error.response.data).toEqual({
        errors: ["Products product-id-invalid do not exist"],
        message: "Provided request body contains errors. Please check the data and retry the request"
      })
    })

    it("throws error when category ID is invalid", async () => {
      const api = useApi()
      const payload = { product_ids: [] }

      const error = await api.delete(
        `/admin/product-categories/invalid-category-id/products/batch`,
        {
          ...adminHeaders,
          data: payload,
        }
      ).catch(e => e)

      expect(error.response.status).toEqual(404)
      expect(error.response.data).toEqual({
        message: "ProductCategory with id: invalid-category-id was not found",
        type: "not_found",
      })
    })

    it("throws error trying to expand not allowed relations", async () => {
      const api = useApi()
      const payload = { product_ids: [] }

      const error = await api.delete(
        `/admin/product-categories/invalid-category-id/products/batch?expand=products`,
        {
          ...adminHeaders,
          data: payload,
        }
      ).catch(e => e)

      expect(error.response.status).toEqual(400)
      expect(error.response.data).toEqual({
        message: "Relations [products] are not valid",
        type: "invalid_data",
      })
    })
  })
})
