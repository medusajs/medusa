import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { In } from "typeorm"
import { breaking } from "../../../helpers/breaking"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(30000)

let { simpleProductCategoryFactory, simpleProductFactory } = {}
let { Product } = {}

medusaIntegrationTestRunner({
  env: {
    MEDUSA_FF_PRODUCT_CATEGORIES: true,
    // MEDUSA_FF_MEDUSA_V2: true,
  },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer
    let productCategory
    let productCategory1
    let productCategory2
    let productCategoryChild
    let productCategoryParent
    let productCategoryChild0
    let productCategoryChild1
    let productCategoryChild2
    let productCategoryChild3

    let productModuleService: IProductModuleService

    beforeAll(() => {
      ;({
        simpleProductCategoryFactory,
        simpleProductFactory,
      } = require("../../../factories"))
      ;({ Product } = require("@medusajs/medusa"))
    })

    beforeEach(async () => {
      appContainer = getContainer()

      productModuleService = appContainer.resolve(
        ModuleRegistrationName.PRODUCT
      )

      await createAdminUser(dbConnection, adminHeaders, appContainer)
    })

    describe("GET /admin/product-categories/:id", () => {
      beforeEach(async () => {
        productCategoryParent = await simpleProductCategoryFactory(
          dbConnection,
          {
            name: "category parent",
            handle: "category-parent",
          }
        )

        productCategory = await simpleProductCategoryFactory(dbConnection, {
          name: "category",
          handle: "category",
          parent_category: productCategoryParent,
        })

        productCategoryChild = await simpleProductCategoryFactory(
          dbConnection,
          {
            name: "category child",
            handle: "category-child",
            parent_category: productCategory,
          }
        )

        productCategoryChild2 = await simpleProductCategoryFactory(
          dbConnection,
          {
            name: "category child 2",
            handle: "category-child-2",
            parent_category: productCategoryChild,
          }
        )
      })

      it("gets product category with children tree and parent", async () => {
        const path = breaking(
          () => `/admin/product-categories/${productCategory.id}`,
          () =>
            `/admin/product-categories/${productCategory.id}?include_descendants_tree=true`
        )

        const response = await api.get(path, adminHeaders)

        expect(response.data.product_category).toEqual(
          expect.objectContaining({
            id: productCategory.id,
            name: productCategory.name,
            handle: productCategory.handle,
            ...breaking(
              () => ({
                parent_category: expect.objectContaining({
                  id: productCategoryParent.id,
                  name: productCategoryParent.name,
                  handle: productCategoryParent.handle,
                }),
              }),
              () => ({
                parent_category_id: productCategoryParent.id,
              })
            ),
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
                    category_children: [],
                  }),
                ],
              }),
            ],
          })
        )

        expect(response.status).toEqual(200)
      })
    })

    describe("GET /admin/product-categories", () => {
      beforeEach(async () => {
        productCategoryParent = await simpleProductCategoryFactory(
          dbConnection,
          {
            name: "Mens",
            rank: 0,
          }
        )

        productCategory = await simpleProductCategoryFactory(dbConnection, {
          name: "sweater",
          parent_category: productCategoryParent,
          is_internal: true,
          rank: 0,
        })

        productCategoryChild = await simpleProductCategoryFactory(
          dbConnection,
          {
            name: "cashmere",
            parent_category: productCategory,
            rank: 0,
          }
        )

        productCategoryChild0 = await simpleProductCategoryFactory(
          dbConnection,
          {
            name: "rank 2",
            parent_category: productCategoryChild,
            rank: 2,
          }
        )

        productCategoryChild1 = await simpleProductCategoryFactory(
          dbConnection,
          {
            name: "rank 1",
            parent_category: productCategoryChild,
            rank: 1,
          }
        )

        productCategoryChild2 = await simpleProductCategoryFactory(
          dbConnection,
          {
            name: "rank 0",
            parent_category: productCategoryChild,
            rank: 0,
          }
        )

        productCategoryChild3 = await simpleProductCategoryFactory(
          dbConnection,
          {
            name: "rank 3",
            parent_category: productCategoryChild,
            rank: 3,
          }
        )
      })

      it("gets list of product category with immediate children and parents", async () => {
        const path = breaking(
          () => `/admin/product-categories?limit=7`,
          () =>
            `/admin/product-categories?include_descendants_tree=true&limit=7`
        )

        const response = await api.get(path, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(7)
        expect(response.data.offset).toEqual(0)
        expect(response.data.limit).toEqual(7)

        expect(response.data.product_categories).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: productCategoryChild.id,
              ...breaking(
                () => ({
                  parent_category: expect.objectContaining({
                    id: productCategory.id,
                    handle: productCategory.handle,
                    rank: 0,
                  }),
                }),
                () => ({
                  parent_category_id: productCategory.id,
                })
              ),
              category_children: [
                expect.objectContaining({
                  id: productCategoryChild2.id,
                  handle: productCategoryChild2.handle,
                  rank: 0,
                }),
                expect.objectContaining({
                  id: productCategoryChild1.id,
                  handle: productCategoryChild1.handle,
                  rank: 1,
                }),
                expect.objectContaining({
                  id: productCategoryChild0.id,
                  handle: productCategoryChild0.handle,
                  rank: 2,
                }),
                expect.objectContaining({
                  id: productCategoryChild3.id,
                  handle: productCategoryChild3.handle,
                  rank: 3,
                }),
              ],
            }),
            expect.objectContaining({
              id: productCategoryParent.id,
              ...breaking(
                () => ({ parent_category: null }),
                () => ({})
              ),
              category_children: [
                expect.objectContaining({
                  id: productCategory.id,
                  handle: productCategory.handle,
                  rank: 0,
                }),
              ],
            }),
            expect.objectContaining({
              id: productCategoryChild2.id,
              ...breaking(
                () => ({
                  parent_category: expect.objectContaining({
                    id: productCategoryChild.id,
                  }),
                }),
                () => ({
                  parent_category_id: productCategoryChild.id,
                })
              ),
              category_children: [],
              rank: 0,
              handle: productCategoryChild2.handle,
            }),
            expect.objectContaining({
              id: productCategory.id,
              ...breaking(
                () => ({
                  parent_category: expect.objectContaining({
                    id: productCategoryParent.id,
                    rank: 0,
                    handle: productCategoryParent.handle,
                  }),
                }),
                () => ({
                  parent_category_id: productCategoryParent.id,
                })
              ),
              category_children: [
                expect.objectContaining({
                  id: productCategoryChild.id,
                  handle: productCategoryChild.handle,
                  rank: 0,
                }),
              ],
            }),
            expect.objectContaining({
              id: productCategoryChild1.id,
              ...breaking(
                () => ({
                  parent_category: expect.objectContaining({
                    id: productCategoryChild.id,
                    handle: productCategoryChild.handle,
                    rank: 0,
                  }),
                }),
                () => ({
                  parent_category_id: productCategoryChild.id,
                })
              ),
              category_children: [],
              handle: productCategoryChild1.handle,
              rank: 1,
            }),
            expect.objectContaining({
              id: productCategoryChild0.id,
              ...breaking(
                () => ({
                  parent_category: expect.objectContaining({
                    id: productCategoryChild.id,
                    handle: productCategoryChild.handle,
                    rank: 0,
                  }),
                }),
                () => ({
                  parent_category_id: productCategoryChild.id,
                })
              ),
              category_children: [],
              handle: productCategoryChild0.handle,
              rank: 2,
            }),
            expect.objectContaining({
              id: productCategoryChild3.id,
              ...breaking(
                () => ({
                  parent_category: expect.objectContaining({
                    id: productCategoryChild.id,
                    handle: productCategoryChild.handle,
                    rank: 0,
                  }),
                }),
                () => ({
                  parent_category_id: productCategoryChild.id,
                })
              ),
              category_children: [],
              handle: productCategoryChild3.handle,
              rank: 3,
            }),
          ])
        )
      })

      it("filters based on whitelisted attributes of the data model", async () => {
        const response = await api.get(
          `/admin/product-categories?is_internal=true&limit=7`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.product_categories[0].id).toEqual(
          productCategory.id
        )
      })

      it("filters based on handle attribute of the data model", async () => {
        const response = await api.get(
          `/admin/product-categories?handle=${productCategory.handle}&limit=2`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.product_categories[0].id).toEqual(
          productCategory.id
        )
      })

      it("filters based on free text on name and handle columns", async () => {
        const response = await api.get(
          `/admin/product-categories?q=men&limit=1`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.product_categories[0].id).toEqual(
          productCategoryParent.id
        )
      })

      it("filters based on parent category", async () => {
        const response = await api.get(
          `/admin/product-categories?parent_category_id=${productCategoryParent.id}&limit=7`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.product_categories[0].id).toEqual(
          productCategory.id
        )

        const nullCategoryResponse = await api
          .get(
            `/admin/product-categories?parent_category_id=null`,
            adminHeaders
          )
          .catch((e) => e)

        expect(nullCategoryResponse.status).toEqual(200)
        expect(nullCategoryResponse.data.count).toEqual(1)
        expect(nullCategoryResponse.data.product_categories[0].id).toEqual(
          productCategoryParent.id
        )
      })

      it("adds all descendants to categories in a nested way", async () => {
        const response = await api.get(
          `/admin/product-categories?parent_category_id=null&include_descendants_tree=true&limit=7`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.product_categories).toEqual([
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
                        rank: 0,
                      }),
                      expect.objectContaining({
                        id: productCategoryChild1.id,
                        category_children: [],
                        handle: productCategoryChild1.handle,
                        rank: 1,
                      }),
                      expect.objectContaining({
                        id: productCategoryChild0.id,
                        category_children: [],
                        handle: productCategoryChild0.handle,
                        rank: 2,
                      }),
                      expect.objectContaining({
                        id: productCategoryChild3.id,
                        category_children: [],
                        handle: productCategoryChild3.handle,
                        rank: 3,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ])
      })
    })

    describe("POST /admin/product-categories", () => {
      beforeEach(async () => {
        productCategoryParent = await breaking(
          async () =>
            await simpleProductCategoryFactory(dbConnection, {
              name: "category parent",
              handle: "category-parent",
            }),
          async () =>
            await productModuleService.createCategory({
              name: "category parent",
              handle: "category-parent",
            })
        )

        productCategory = await breaking(
          async () =>
            await simpleProductCategoryFactory(dbConnection, {
              name: "category",
              handle: "category",
              parent_category: productCategoryParent,
            }),
          async () =>
            await productModuleService.createCategory({
              name: "category",
              handle: "category",
              parent_category_id: productCategoryParent.id,
            })
        )
      })

      it("throws an error if required fields are missing", async () => {
        const error = await api
          .post(`/admin/product-categories`, {}, adminHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.type).toEqual("invalid_data")
        breaking(() => {
          expect(error.response.data.message).toEqual(
            "name should not be empty, name must be a string"
          )
        })
      })

      // TODO: Remove in V2, unnecessary test
      it("throws an error when description is not a string", async () => {
        const payload = {
          name: "test",
          handle: "test",
          description: null,
        }

        const error = await api
          .post(`/admin/product-categories`, payload, adminHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.type).toEqual("invalid_data")
        // expect(error.response.data.message).toEqual(
        //   "description must be a string"
        // )
      })

      it("successfully creates a product category", async () => {
        const payload = {
          name: "test",
          handle: "test",
          is_internal: true,
          parent_category_id: productCategory.id,
          description: "test",
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
              description: payload.description,
              handle: payload.handle,
              is_internal: payload.is_internal,
              is_active: false,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              ...breaking(
                () => ({
                  parent_category: expect.objectContaining({
                    id: productCategory.id,
                  }),
                }),
                () => ({
                  parent_category_id: productCategory.id,
                })
              ),
              category_children: [],
              rank: 0,
            }),
          })
        )
      })

      it("successfully creates a product category with a rank", async () => {
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
              ...breaking(
                () => ({
                  parent_category: expect.objectContaining({
                    id: productCategoryParent.id,
                  }),
                }),
                () => ({
                  parent_category_id: productCategoryParent.id,
                })
              ),
              category_children: [],
              rank: 1,
            }),
          })
        )
      })

      it("root parent returns children correctly on creating new category", async () => {
        const response = await api.post(
          `/admin/product-categories`,
          {
            name: "last descendant",
            parent_category_id: productCategory.id,
            ...breaking(
              () => ({}),
              () => ({ description: "last descendant" })
            ),
          },
          adminHeaders
        )

        const lastDescendant = response.data.product_category

        const path = breaking(
          () => `/admin/product-categories/${productCategoryParent.id}`,
          () =>
            `/admin/product-categories/${productCategoryParent.id}?include_descendants_tree=true`
        )

        const parentResponse = await api.get(path, adminHeaders)

        expect(parentResponse.data.product_category).toEqual(
          expect.objectContaining({
            id: productCategoryParent.id,
            category_children: [
              expect.objectContaining({
                id: productCategory.id,
                category_children: [
                  expect.objectContaining({
                    id: lastDescendant.id,
                    category_children: [],
                  }),
                ],
              }),
            ],
          })
        )
      })
    })

    describe("DELETE /admin/product-categories/:id", () => {
      beforeEach(async () => {
        productCategoryParent = await simpleProductCategoryFactory(
          dbConnection,
          {
            name: "category parent",
            handle: "category-parent",
          }
        )

        productCategory = await simpleProductCategoryFactory(dbConnection, {
          name: "category",
          handle: "category",
          parent_category: productCategoryParent,
        })

        productCategory1 = await simpleProductCategoryFactory(dbConnection, {
          name: "category-1",
          parent_category: productCategoryParent,
          rank: 1,
        })

        productCategory2 = await simpleProductCategoryFactory(dbConnection, {
          name: "category-2",
          parent_category: productCategoryParent,
          rank: 2,
        })
      })

      it("returns successfully with an invalid ID", async () => {
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
        const error = await api
          .delete(
            `/admin/product-categories/${productCategoryParent.id}`,
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.type).toEqual("not_allowed")
        expect(error.response.data.message).toEqual(
          `Deleting ProductCategory (${productCategoryParent.id}) with category children is not allowed`
        )
      })

      it("deletes a product category with no children successfully", async () => {
        const deleteResponse = await api
          .delete(
            `/admin/product-categories/${productCategory.id}`,
            adminHeaders
          )
          .catch((e) => e)

        expect(deleteResponse.status).toEqual(200)
        expect(deleteResponse.data.id).toEqual(productCategory.id)
        expect(deleteResponse.data.deleted).toBeTruthy()
        expect(deleteResponse.data.object).toEqual("product-category")

        const errorFetchingDeleted = await api
          .get(`/admin/product-categories/${productCategory.id}`, adminHeaders)
          .catch((e) => e)

        expect(errorFetchingDeleted.response.status).toEqual(404)
      })

      it("deleting a product category reorders siblings accurately", async () => {
        const deleteResponse = await api
          .delete(
            `/admin/product-categories/${productCategory.id}`,
            adminHeaders
          )
          .catch((e) => e)

        expect(deleteResponse.status).toEqual(200)

        const siblingsResponse = await api
          .get(
            `/admin/product-categories?parent_category_id=${productCategoryParent.id}`,
            adminHeaders
          )
          .catch((e) => e)

        expect(siblingsResponse.data.product_categories).toEqual([
          expect.objectContaining({
            id: productCategory1.id,
            rank: 0,
          }),
          expect.objectContaining({
            id: productCategory2.id,
            rank: 1,
          }),
        ])
      })
    })

    describe("POST /admin/product-categories/:id", () => {
      beforeEach(async () => {
        await breaking(
          async () => {
            productCategoryParent = await simpleProductCategoryFactory(
              dbConnection,
              {
                name: "category parent",
              }
            )

            productCategory = await simpleProductCategoryFactory(dbConnection, {
              name: "category-0",
              parent_category: productCategoryParent,
              rank: 0,
            })

            productCategory1 = await simpleProductCategoryFactory(
              dbConnection,
              {
                name: "category-1",
                parent_category: productCategoryParent,
                rank: 1,
              }
            )

            productCategory2 = await simpleProductCategoryFactory(
              dbConnection,
              {
                name: "category-2",
                parent_category: productCategoryParent,
                rank: 2,
              }
            )

            productCategoryChild = await simpleProductCategoryFactory(
              dbConnection,
              {
                name: "category child",
                parent_category: productCategory,
                rank: 0,
              }
            )

            productCategoryChild0 = await simpleProductCategoryFactory(
              dbConnection,
              {
                name: "category child 0",
                parent_category: productCategoryChild,
                rank: 0,
              }
            )

            productCategoryChild1 = await simpleProductCategoryFactory(
              dbConnection,
              {
                name: "category child 1",
                parent_category: productCategoryChild,
                rank: 1,
              }
            )

            productCategoryChild2 = await simpleProductCategoryFactory(
              dbConnection,
              {
                name: "category child 2",
                parent_category: productCategoryChild,
                rank: 2,
              }
            )

            productCategoryChild3 = await simpleProductCategoryFactory(
              dbConnection,
              {
                name: "category child 3",
                parent_category: productCategoryChild,
                rank: 3,
              }
            )
          },
          async () => {
            productCategoryParent = await productModuleService.createCategory({
              name: "category parent",
              description: "category parent",
            })
            productCategory = await productModuleService.createCategory({
              name: "category-0",
              parent_category_id: productCategoryParent.id,
              rank: 0,
              description: "category-0",
            })
            productCategory1 = await productModuleService.createCategory({
              name: "category-1",
              parent_category_id: productCategoryParent.id,
              rank: 1,
              description: "category-1",
            })
            productCategory2 = await productModuleService.createCategory({
              name: "category-2",
              parent_category_id: productCategoryParent.id,
              rank: 2,
              description: "category-2",
            })
            productCategoryChild = await productModuleService.createCategory({
              name: "category child",
              parent_category_id: productCategory.id,
              rank: 0,
              description: "category child",
            })

            productCategoryChild0 = await productModuleService.createCategory({
              name: "category child 0",
              parent_category_id: productCategoryChild.id,
              rank: 0,
              description: "category child 0",
            })
            productCategoryChild1 = await productModuleService.createCategory({
              name: "category child 1",
              parent_category_id: productCategoryChild.id,
              rank: 1,
              description: "category child 1",
            })
            productCategoryChild2 = await productModuleService.createCategory({
              name: "category child 2",
              parent_category_id: productCategoryChild.id,
              rank: 2,
              description: "category child 2",
            })
            productCategoryChild3 = await productModuleService.createCategory({
              name: "category child 3",
              parent_category_id: productCategoryChild.id,
              rank: 3,
              description: "category child 3",
            })
          }
        )
      })

      it("throws an error if invalid ID is sent", async () => {
        const error = await api
          .post(
            `/admin/product-categories/not-found-id`,
            {
              name: "testing",
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data.type).toEqual("not_found")

        const errorMessage = breaking(
          () => "ProductCategory with id: not-found-id was not found",
          () => "ProductCategory not found ({ id: 'not-found-id' })"
        )
        expect(error.response.data.message).toEqual(errorMessage)
      })

      // TODO: This seems to be a redundant test, I would remove this in V2
      it("throws an error if rank is negative", async () => {
        const error = await api
          .post(
            `/admin/product-categories/not-found-id`,
            {
              rank: -1,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.type).toEqual("invalid_data")

        breaking(() => {
          expect(error.response.data.message).toEqual(
            "rank must not be less than 0"
          )
        }, void 0)
      })

      // TODO: This seems to be a redundant test, I would remove this in V2
      it("throws an error if invalid attribute is sent", async () => {
        const error = await api
          .post(
            `/admin/product-categories/${productCategory.id}`,
            {
              invalid_property: "string",
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.type).toEqual("invalid_data")

        breaking(() => {
          expect(error.response.data.message).toEqual(
            "property invalid_property should not exist"
          )
        }, void 0)
      })

      it("successfully updates a product category", async () => {
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
              ...breaking(
                () => ({
                  parent_category: expect.objectContaining({
                    id: productCategory.id,
                  }),
                }),
                () => ({
                  parent_category_id: productCategory.id,
                })
              ),
              category_children: [],
              rank: 1,
            }),
          })
        )
      })

      // TODO: This seems to be a redundant test, I would remove this in V2
      it("updating properties other than rank should not change its rank", async () => {
        expect(productCategory.rank).toEqual(0)

        const response = await api.post(
          `/admin/product-categories/${productCategory.id}`,
          {
            name: "different-name",
          },
          adminHeaders
        )
        expect(response.status).toEqual(200)
        expect(response.data.product_category.rank).toEqual(
          productCategory.rank
        )
      })

      it("root parent returns children correctly on updating new category", async () => {
        await api.post(
          `/admin/product-categories/${productCategoryChild.id}`,
          {
            parent_category_id: productCategory.id,
          },
          adminHeaders
        )

        // In V2, children are only included if explicitly requested
        const path = breaking(
          () => `/admin/product-categories/${productCategoryParent.id}`,
          () =>
            `/admin/product-categories/${productCategoryParent.id}?include_descendants_tree=true`
        )

        const parentResponse = await api.get(path, adminHeaders)

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
                  }),
                ],
              }),
              expect.objectContaining({
                id: productCategory1.id,
                category_children: [],
                rank: 1,
              }),
              expect.objectContaining({
                id: productCategory2.id,
                category_children: [],
                rank: 2,
              }),
            ],
          })
        )
      })

      it("when parent is updated, rank is updated to elements count + 1", async () => {
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
              ...breaking(
                () => ({
                  parent_category: expect.objectContaining({
                    id: productCategoryParent.id,
                  }),
                }),
                () => ({
                  parent_category_id: productCategoryParent.id,
                })
              ),
              rank: 3,
            }),
          })
        )
      })

      it("when parent is updated with rank, rank accurately updated", async () => {
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
              ...breaking(
                () => ({
                  parent_category: expect.objectContaining({
                    id: productCategoryParent.id,
                  }),
                }),
                () => ({
                  parent_category_id: productCategoryParent.id,
                })
              ),
              rank: 0,
            }),
          })
        )
      })

      // TODO: This seems to be a redundant test, I would remove this in V2
      it("when only rank is updated, rank should be updated", async () => {
        const response = await api.post(
          `/admin/product-categories/${productCategoryChild1.id}`,
          {
            rank: 0,
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

      it("when rank is greater than list count, rank is updated to elements count + 1", async () => {
        const response = await api.post(
          `/admin/product-categories/${productCategoryChild1.id}`,
          {
            rank: 99,
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
        await api.post(
          `/admin/product-categories/${productCategoryChild2.id}`,
          {
            rank: 0,
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
            category_children: expect.arrayContaining([
              expect.objectContaining({
                id: productCategoryChild2.id,
                rank: 0,
              }),
              expect.objectContaining({
                id: productCategoryChild0.id,
                rank: 1,
              }),
              expect.objectContaining({
                id: productCategoryChild1.id,
                rank: 2,
              }),
              expect.objectContaining({
                id: productCategoryChild3.id,
                rank: 3,
              }),
            ]),
          })
        )
      })
    })

    // TODO: Remove in V2, endpoint changed
    describe("POST /admin/product-categories/:id/products/batch", () => {
      beforeEach(async () => {
        productCategory = await simpleProductCategoryFactory(dbConnection, {
          id: "test-category",
          name: "test category",
        })
      })

      it("should add products to a product category", async () => {
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
            id: productCategory.id,
          }),
        ])

        expect(products[1].categories).toEqual([
          expect.objectContaining({
            id: productCategory.id,
          }),
        ])
      })

      it("throws error when product ID is invalid", async () => {
        const payload = {
          product_ids: [{ id: "product-id-invalid" }],
        }

        const error = await api
          .post(
            `/admin/product-categories/${productCategory.id}/products/batch`,
            payload,
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data).toEqual({
          errors: ["Products product-id-invalid do not exist"],
          message:
            "Provided request body contains errors. Please check the data and retry the request",
        })
      })

      it("throws error when category ID is invalid", async () => {
        const payload = { product_ids: [] }

        const error = await api
          .post(
            `/admin/product-categories/invalid-category-id/products/batch`,
            payload,
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data).toEqual({
          message: "ProductCategory with id: invalid-category-id was not found",
          type: "not_found",
        })
      })

      it("throws error trying to expand not allowed relations", async () => {
        const payload = { product_ids: [] }

        const error = await api
          .post(
            `/admin/product-categories/invalid-category-id/products/batch?expand=products`,
            payload,
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data).toEqual({
          message: "Requested fields [products] are not valid",
          type: "invalid_data",
        })
      })
    })

    // TODO: Remove in v2, endpoint changed
    describe("DELETE /admin/product-categories/:id/products/batch", () => {
      let testProduct1, testProduct2

      beforeEach(async () => {
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
          products: [testProduct1, testProduct2],
        })
      })

      it("should remove products from a product category", async () => {
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
            id: productCategory.id,
          }),
        ])

        expect(products[1].categories).toEqual([])
      })

      it("throws error when product ID is invalid", async () => {
        const payload = {
          product_ids: [{ id: "product-id-invalid" }],
        }

        const error = await api
          .delete(
            `/admin/product-categories/${productCategory.id}/products/batch`,
            {
              ...adminHeaders,
              data: payload,
            }
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data).toEqual({
          errors: ["Products product-id-invalid do not exist"],
          message:
            "Provided request body contains errors. Please check the data and retry the request",
        })
      })

      it("throws error when category ID is invalid", async () => {
        const payload = { product_ids: [] }

        const error = await api
          .delete(
            `/admin/product-categories/invalid-category-id/products/batch`,
            {
              ...adminHeaders,
              data: payload,
            }
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data).toEqual({
          message: "ProductCategory with id: invalid-category-id was not found",
          type: "not_found",
        })
      })

      it("throws error trying to expand not allowed relations", async () => {
        const payload = { product_ids: [] }

        const error = await api
          .delete(
            `/admin/product-categories/invalid-category-id/products/batch?expand=products`,
            {
              ...adminHeaders,
              data: payload,
            }
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data).toEqual({
          message: "Requested fields [products] are not valid",
          type: "invalid_data",
        })
      })
    })

    // Skipping because the test is for V2 only
    describe.skip("POST /admin/product-categories/:id/products", () => {
      beforeEach(async () => {
        productCategory = await productModuleService.createCategory({
          name: "category parent",
          description: "category parent",
          parent_category_id: null,
        })
      })

      it("successfully updates a product category", async () => {
        const product1Response = await api.post(
          "/admin/products",
          {
            title: "product 1",
            categories: [{ id: productCategory.id }],
          },
          adminHeaders
        )

        const product2Response = await api.post(
          "/admin/products",
          {
            title: "product 2",
          },
          adminHeaders
        )

        const categoryResponse = await api.post(
          `/admin/product-categories/${productCategory.id}/products`,
          {
            remove: [product1Response.data.product.id],
            add: [product2Response.data.product.id],
          },
          adminHeaders
        )

        const productsInCategoryResponse = await api.get(
          `/admin/products?category_id[]=${productCategory.id}`,
          adminHeaders
        )

        expect(categoryResponse.status).toEqual(200)
        expect(productsInCategoryResponse.data.products).toEqual([
          expect.objectContaining({
            id: product2Response.data.product.id,
          }),
        ])
      })
    })
  },
})
