import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let productCategory
    let productCategory1
    let productCategory2
    let productCategoryChild
    let productCategoryParent
    let productCategoryChild0
    let productCategoryChild1
    let productCategoryChild2
    let productCategoryChild3

    beforeEach(async () => {
      const appContainer = getContainer()
      await createAdminUser(dbConnection, adminHeaders, appContainer)
    })

    describe("GET /admin/product-categories/:id", () => {
      beforeEach(async () => {
        productCategoryParent = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category parent",
              description: "category parent",
            },
            adminHeaders
          )
        ).data.product_category

        productCategory = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category-0",
              parent_category_id: productCategoryParent.id,
              rank: 0,
              description: "category-0",
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category child",
              parent_category_id: productCategory.id,
              rank: 0,
              description: "category child",
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild2 = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category child 2",
              parent_category_id: productCategoryChild.id,
              rank: 2,
              description: "category child 2",
            },
            adminHeaders
          )
        ).data.product_category
      })

      it("gets product category with children tree and parent", async () => {
        // BREAKING: To get the category children, the query param include_descendants_tree must be used
        const path = `/admin/product-categories/${productCategory.id}?include_descendants_tree=true`

        const response = await api.get(path, adminHeaders)

        expect(response.data.product_category).toEqual(
          expect.objectContaining({
            id: productCategory.id,
            name: productCategory.name,
            handle: productCategory.handle,
            parent_category_id: productCategoryParent.id,
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
      // TODO/BREAKING: We don't support rank reordering upon creation in V2
      //   New categories with the same parent are always added at the end of the "list"
      beforeEach(async () => {
        productCategoryParent = (
          await api.post(
            "/admin/product-categories",
            {
              name: "Mens",
            },
            adminHeaders
          )
        ).data.product_category

        productCategory = (
          await api.post(
            "/admin/product-categories",
            {
              name: "sweater",
              parent_category_id: productCategoryParent.id,
              is_internal: true,
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild = (
          await api.post(
            "/admin/product-categories",
            {
              name: "cashmere",
              parent_category_id: productCategory.id,
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild0 = (
          await api.post(
            "/admin/product-categories",
            {
              name: "child0",
              parent_category_id: productCategoryChild.id,
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild1 = (
          await api.post(
            "/admin/product-categories",
            {
              name: "child1",
              parent_category_id: productCategoryChild.id,
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild2 = (
          await api.post(
            "/admin/product-categories",
            {
              name: "child2",
              parent_category_id: productCategoryChild.id,
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild3 = (
          await api.post(
            "/admin/product-categories",
            {
              name: "child3",
              parent_category_id: productCategoryChild.id,
            },
            adminHeaders
          )
        ).data.product_category
      })

      it("should correctly query categories by q", async () => {
        const categoryOne = (
          await api.post(
            "/admin/product-categories",
            {
              name: "Category One",
            },
            adminHeaders
          )
        ).data.product_category

        const categoryTwo = (
          await api.post(
            "/admin/product-categories",
            {
              name: "Category Two",
              parent_category_id: categoryOne.id,
            },
            adminHeaders
          )
        ).data.product_category

        const categoryThree = (
          await api.post(
            "/admin/product-categories",
            {
              name: "Category Three",
              parent_category_id: categoryTwo.id,
            },
            adminHeaders
          )
        ).data.product_category

        const response = await api.get(
          "/admin/product-categories?q=Category",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.product_categories).toHaveLength(3)
        expect(response.data.product_categories).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: categoryOne.id,
              name: "Category One",
            }),
            expect.objectContaining({
              id: categoryTwo.id,
              name: "Category Two",
            }),
            expect.objectContaining({
              id: categoryThree.id,
              name: "Category Three",
            }),
          ])
        )

        const responseTwo = await api.get(
          "/admin/product-categories?q=three",
          adminHeaders
        )

        expect(responseTwo.status).toEqual(200)
        expect(responseTwo.data.product_categories).toHaveLength(1)
        expect(responseTwo.data.product_categories).toEqual([
          expect.objectContaining({
            id: categoryThree.id,
            name: "Category Three",
          }),
        ])
      })

      it("gets list of product category with immediate children and parents", async () => {
        // BREAKING: To get the children tree, the query param include_descendants_tree must be used
        const path = `/admin/product-categories?limit=7`

        const response = await api.get(path, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(7)
        expect(response.data.offset).toEqual(0)
        expect(response.data.limit).toEqual(7)

        expect(response.data.product_categories).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: productCategoryChild.id,
              parent_category_id: productCategory.id,
              category_children: [
                expect.objectContaining({
                  id: productCategoryChild0.id,
                  handle: productCategoryChild0.handle,
                }),
                expect.objectContaining({
                  id: productCategoryChild1.id,
                  handle: productCategoryChild1.handle,
                }),
                expect.objectContaining({
                  id: productCategoryChild2.id,
                  handle: productCategoryChild2.handle,
                }),
                expect.objectContaining({
                  id: productCategoryChild3.id,
                  handle: productCategoryChild3.handle,
                }),
              ],
            }),
            expect.objectContaining({
              id: productCategoryParent.id,
              category_children: [
                expect.objectContaining({
                  id: productCategory.id,
                  handle: productCategory.handle,
                }),
              ],
            }),
            expect.objectContaining({
              id: productCategoryChild2.id,
              parent_category_id: productCategoryChild.id,
              category_children: [],
              handle: productCategoryChild2.handle,
            }),
            expect.objectContaining({
              id: productCategory.id,
              parent_category_id: productCategoryParent.id,
              category_children: [
                expect.objectContaining({
                  id: productCategoryChild.id,
                  handle: productCategoryChild.handle,
                }),
              ],
            }),
            expect.objectContaining({
              id: productCategoryChild0.id,
              parent_category_id: productCategoryChild.id,
              category_children: [],
              handle: productCategoryChild0.handle,
            }),
            expect.objectContaining({
              id: productCategoryChild1.id,
              parent_category_id: productCategoryChild.id,
              category_children: [],
              handle: productCategoryChild1.handle,
            }),
            expect.objectContaining({
              id: productCategoryChild2.id,
              parent_category_id: productCategoryChild.id,
              category_children: [],
              handle: productCategoryChild2.handle,
            }),
            expect.objectContaining({
              id: productCategoryChild3.id,
              parent_category_id: productCategoryChild.id,
              category_children: [],
              handle: productCategoryChild3.handle,
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
                        id: productCategoryChild0.id,
                        category_children: [],
                        handle: productCategoryChild0.handle,
                      }),
                      expect.objectContaining({
                        id: productCategoryChild1.id,
                        category_children: [],
                        handle: productCategoryChild1.handle,
                      }),
                      expect.objectContaining({
                        id: productCategoryChild2.id,
                        category_children: [],
                        handle: productCategoryChild2.handle,
                      }),
                      expect.objectContaining({
                        id: productCategoryChild3.id,
                        category_children: [],
                        handle: productCategoryChild3.handle,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ])
      })

      it("adds all ancestors to categories in a nested way", async () => {
        const response = await api.get(
          `/admin/product-categories/${productCategoryChild1.id}?include_ancestors_tree=true`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.product_category).toEqual(
          expect.objectContaining({
            id: productCategoryChild1.id,
            name: "child1",
            parent_category: expect.objectContaining({
              id: productCategoryChild.id,
              name: "cashmere",
              rank: 0,
              parent_category: expect.objectContaining({
                id: productCategory.id,
                name: "sweater",
                rank: 0,
                parent_category: expect.objectContaining({
                  id: productCategoryParent.id,
                  name: "Mens",
                  rank: 0,
                }),
              }),
            }),
          })
        )
      })
    })

    describe("POST /admin/product-categories", () => {
      beforeEach(async () => {
        productCategoryParent = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category parent",
              handle: "category-parent",
            },
            adminHeaders
          )
        ).data.product_category

        productCategory = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category",
              handle: "category",
              parent_category_id: productCategoryParent.id,
            },
            adminHeaders
          )
        ).data.product_category
      })

      it("throws an error if required fields are missing", async () => {
        const error = await api
          .post(`/admin/product-categories`, {}, adminHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.type).toEqual("invalid_data")
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
              parent_category: expect.objectContaining({
                id: productCategory.id,
              }),
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
              parent_category_id: productCategoryParent.id,
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
            description: "last descendant",
          },
          adminHeaders
        )

        const lastDescendant = response.data.product_category

        // BREAKING: To get the category children, the query param include_descendants_tree must be used
        const path = `/admin/product-categories/${productCategoryParent.id}?include_descendants_tree=true`

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
        productCategoryParent = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category parent",
              description: "category parent",
            },
            adminHeaders
          )
        ).data.product_category

        productCategory = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category-0",
              parent_category_id: productCategoryParent.id,
              rank: 0,
              description: "category-0",
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category child",
              parent_category_id: productCategory.id,
              rank: 0,
              description: "category child",
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild2 = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category child 2",
              parent_category_id: productCategoryChild.id,
              description: "category child 2",
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild3 = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category child 3",
              parent_category_id: productCategoryChild.id,
              description: "category child 3",
            },
            adminHeaders
          )
        ).data.product_category
      })

      // BREAKING: In v1 we would return 200 on an invalid ID, in v2 we return 404
      it("returns successfully with an invalid ID", async () => {
        const err = await api
          .delete(`/admin/product-categories/invalid-id`, adminHeaders)
          .catch((e) => e)

        expect(err.response.status).toEqual(404)
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
        const deleteResponse = await api.delete(
          `/admin/product-categories/${productCategoryChild2.id}`,
          adminHeaders
        )

        expect(deleteResponse.status).toEqual(200)
        expect(deleteResponse.data.id).toEqual(productCategoryChild2.id)
        expect(deleteResponse.data.deleted).toBeTruthy()
        expect(deleteResponse.data.object).toEqual("product_category")

        const errorFetchingDeleted = await api
          .get(
            `/admin/product-categories/${productCategoryChild2.id}`,
            adminHeaders
          )
          .catch((e) => e)

        expect(errorFetchingDeleted.response.status).toEqual(404)
      })

      it("deleting a product category reorders siblings accurately", async () => {
        const deleteResponse = await api.delete(
          `/admin/product-categories/${productCategoryChild2.id}`,
          adminHeaders
        )

        expect(deleteResponse.status).toEqual(200)
        const siblingsResponse = await api
          .get(
            `/admin/product-categories?parent_category_id=${productCategoryChild.id}`,
            adminHeaders
          )
          .catch((e) => e)

        expect(siblingsResponse.data.product_categories).toEqual([
          expect.objectContaining({
            id: productCategoryChild3.id,
            rank: 0,
          }),
        ])
      })
    })

    describe("POST /admin/product-categories/:id", () => {
      beforeEach(async () => {
        productCategoryParent = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category parent",
              description: "category parent",
            },
            adminHeaders
          )
        ).data.product_category

        productCategory = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category-0",
              parent_category_id: productCategoryParent.id,
              rank: 0,
              description: "category-0",
            },
            adminHeaders
          )
        ).data.product_category

        productCategory1 = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category-1",
              parent_category_id: productCategoryParent.id,
              rank: 1,
              description: "category-1",
            },
            adminHeaders
          )
        ).data.product_category

        productCategory2 = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category-2",
              parent_category_id: productCategoryParent.id,
              rank: 2,
              description: "category-2",
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category child",
              parent_category_id: productCategory.id,
              rank: 0,
              description: "category child",
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild0 = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category child 0",
              parent_category_id: productCategoryChild.id,
              rank: 0,
              description: "category child 0",
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild1 = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category child 1",
              parent_category_id: productCategoryChild.id,
              rank: 1,
              description: "category child 1",
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild2 = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category child 2",
              parent_category_id: productCategoryChild.id,
              rank: 2,
              description: "category child 2",
            },
            adminHeaders
          )
        ).data.product_category

        productCategoryChild3 = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category child 3",
              parent_category_id: productCategoryChild.id,
              rank: 3,
              description: "category child 3",
            },
            adminHeaders
          )
        ).data.product_category
      })

      // TODO: In almost all places we use a selector, not an id, to do the update, so throwing a 404 doesn't make sense from the workflow POV
      // Discuss how we want this handled across all endpoints
      it.skip("throws an error if invalid ID is sent", async () => {
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
        expect(error.response.data.message).toEqual(
          "ProductCategory not found ({ id: 'not-found-id' })"
        )
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
              parent_category_id: productCategory.id,
              category_children: [],
              rank: 1,
            }),
          })
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

        // BREAKING: To get the category children, the query param include_descendants_tree must be used
        const path = `/admin/product-categories/${productCategoryParent.id}?include_descendants_tree=true`

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
              parent_category_id: productCategoryParent.id,
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
              parent_category_id: productCategoryParent.id,
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

    describe("POST /admin/product-categories/:id/products", () => {
      beforeEach(async () => {
        productCategory = (
          await api.post(
            "/admin/product-categories",
            {
              name: "category parent",
              description: "category parent",
            },
            adminHeaders
          )
        ).data.product_category
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
