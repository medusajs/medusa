import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"
import { breaking } from "../../../helpers/breaking"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: { MEDUSA_FF_PRODUCT_CATEGORIES: true },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let productCategoryParent
    let productCategory
    let productCategoryChild
    let productCategoryChild2
    let productCategoryChild3
    let productCategoryChild4

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      productCategoryParent = (
        await api.post(
          "/admin/product-categories",
          {
            name: "category parent",
            description: "test description",
            is_active: true,
            is_internal: false,
          },
          adminHeaders
        )
      ).data.product_category

      productCategory = (
        await api.post(
          "/admin/product-categories",
          {
            name: "category",
            parent_category_id: productCategoryParent.id,
            is_active: true,
          },
          adminHeaders
        )
      ).data.product_category

      // The order in which the children are created is intentional as in v1 there was no way to explicitly set the rank.
      productCategoryChild2 = (
        await api.post(
          "/admin/product-categories",
          {
            name: "category child 2",
            parent_category_id: productCategory.id,
            is_internal: true,
            is_active: true,
          },
          adminHeaders
        )
      ).data.product_category

      productCategoryChild3 = (
        await api.post(
          "/admin/product-categories",
          {
            name: "category child 3",
            parent_category_id: productCategory.id,
            is_internal: false,
            is_active: false,
          },
          adminHeaders
        )
      ).data.product_category

      productCategoryChild4 = (
        await api.post(
          "/admin/product-categories",
          {
            name: "category child 4",
            parent_category_id: productCategory.id,
            is_internal: false,
            is_active: true,
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
            is_active: true,
            is_internal: false,
          },
          adminHeaders
        )
      ).data.product_category
    })

    describe("/store/product-categories", () => {
      describe("GET /store/product-categories/:id", () => {
        it("gets product category with children tree and parent", async () => {
          const response = await api.get(
            `/store/product-categories/${productCategory.id}?${breaking(
              () => "fields=handle,name,description",
              () => "include_ancestors_tree=true&include_descendants_tree=true"
            )}`
          )

          expect(response.data.product_category).toEqual(
            expect.objectContaining({
              id: productCategory.id,
              handle: productCategory.handle,
              name: productCategory.name,
              description: "",
              parent_category: expect.objectContaining({
                id: productCategoryParent.id,
                handle: productCategoryParent.handle,
                name: productCategoryParent.name,
                description: "test description",
              }),
              category_children: expect.arrayContaining([
                expect.objectContaining({
                  id: productCategoryChild4.id,
                  handle: productCategoryChild4.handle,
                  name: productCategoryChild4.name,
                }),
                expect.objectContaining({
                  id: productCategoryChild.id,
                  handle: productCategoryChild.handle,
                  name: productCategoryChild.name,
                }),
              ]),
            })
          )

          expect(response.status).toEqual(200)
        })

        // TODO: This one is failing since we don't validate allowed fields currently. We should add that as part of our validators
        it("throws error on querying not allowed fields", async () => {
          const error = await api
            .get(`/store/product-categories/${productCategory.id}?fields=mpath`)
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data.type).toEqual("invalid_data")
          expect(error.response.data.message).toEqual(
            "Requested fields [mpath] are not valid"
          )
        })

        it("throws error on querying for internal product category", async () => {
          const error = await api
            .get(`/store/product-categories/${productCategoryChild2.id}`)
            .catch((e) => e)

          expect(error.response.status).toEqual(404)
          expect(error.response.data.type).toEqual("not_found")
          expect(error.response.data.message).toEqual(
            breaking(
              () =>
                `ProductCategory with id: ${productCategoryChild2.id}, is_internal: false, is_active: true was not found`,
              () =>
                `Product category with id: ${productCategoryChild2.id} was not found`
            )
          )
        })

        it("throws error on querying for inactive product category", async () => {
          const error = await api
            .get(`/store/product-categories/${productCategoryChild3.id}`)
            .catch((e) => e)

          expect(error.response.status).toEqual(404)
          expect(error.response.data.type).toEqual("not_found")
          expect(error.response.data.message).toEqual(
            breaking(
              () =>
                `ProductCategory with id: ${productCategoryChild3.id}, is_internal: false, is_active: true was not found`,
              () =>
                `Product category with id: ${productCategoryChild3.id} was not found`
            )
          )
        })
      })

      describe("GET /store/product-categories", () => {
        //TODO: The listing results in V2 are unexpected and differ from v1, we need to investigate where the issue is
        it("gets list of product category with immediate children and parents", async () => {
          const response = await api.get(
            `/store/product-categories?limit=10${breaking(
              () => "",
              () => "&include_ancestors_tree=true&include_descendants_tree=true"
            )}`
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(4)
          expect(response.data.offset).toEqual(0)
          expect(response.data.limit).toEqual(10)

          expect(response.data.product_categories).toEqual([
            expect.objectContaining({
              id: productCategory.id,
              rank: 0,
              parent_category: expect.objectContaining({
                id: productCategoryParent.id,
              }),
              category_children: expect.arrayContaining([
                expect.objectContaining({
                  id: productCategoryChild4.id,
                  rank: 2,
                }),
                expect.objectContaining({
                  id: productCategoryChild.id,
                  rank: 3,
                }),
              ]),
            }),
            expect.objectContaining({
              id: productCategoryParent.id,
              parent_category: null,
              rank: 0,
              category_children: [
                expect.objectContaining({
                  id: productCategory.id,
                }),
              ],
            }),
            expect.objectContaining({
              id: productCategoryChild4.id,
              rank: 2,
              parent_category: expect.objectContaining({
                id: productCategory.id,
              }),
              category_children: [],
            }),
            expect.objectContaining({
              id: productCategoryChild.id,
              rank: 3,
              parent_category: expect.objectContaining({
                id: productCategory.id,
              }),
              category_children: [],
            }),
          ])
        })

        // TODO: It seems filtering using null doesn't work.
        it("gets list of product category with all childrens when include_descendants_tree=true", async () => {
          const response = await api.get(
            `/store/product-categories?parent_category_id=null&include_descendants_tree=true&limit=10`
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.product_categories).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: productCategoryParent.id,
                parent_category: null,
                rank: 0,
                category_children: [
                  expect.objectContaining({
                    id: productCategory.id,
                    parent_category_id: productCategoryParent.id,
                    rank: 0,
                    category_children: [
                      expect.objectContaining({
                        id: productCategoryChild4.id,
                        parent_category_id: productCategory.id,
                        category_children: [],
                        rank: 2,
                      }),
                      expect.objectContaining({
                        id: productCategoryChild.id,
                        parent_category_id: productCategory.id,
                        category_children: [],
                        rank: 3,
                      }),
                    ],
                  }),
                ],
              }),
            ])
          )
        })

        it("throws error when querying not allowed fields", async () => {
          const error = await api
            .get(`/store/product-categories?is_internal=true&limit=10`)
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data.type).toEqual("invalid_data")
          expect(error.response.data.message).toEqual(
            "property is_internal should not exist"
          )
        })

        it("filters based on free text on name and handle columns", async () => {
          const response = await api.get(
            `/store/product-categories?q=category-parent&limit=10`
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.product_categories[0].id).toEqual(
            productCategoryParent.id
          )
        })

        it("filters based on handle attribute of the data model", async () => {
          const response = await api.get(
            `/store/product-categories?handle=${productCategory.handle}&limit=10`
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.product_categories[0].id).toEqual(
            productCategory.id
          )
        })

        it("filters based on parent category", async () => {
          const response = await api.get(
            `/store/product-categories?parent_category_id=${productCategory.id}&limit=10`
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(2)
          expect(response.data.product_categories).toEqual([
            expect.objectContaining({
              id: productCategoryChild4.id,
              category_children: [],
              parent_category: expect.objectContaining({
                id: productCategory.id,
              }),
              rank: 2,
            }),
            expect.objectContaining({
              id: productCategoryChild.id,
              category_children: [],
              parent_category: expect.objectContaining({
                id: productCategory.id,
              }),
              rank: 3,
            }),
          ])

          const nullCategoryResponse = await api
            .get(`/store/product-categories?parent_category_id=null`)
            .catch((e) => e)

          expect(nullCategoryResponse.status).toEqual(200)
          expect(nullCategoryResponse.data.count).toEqual(1)
          expect(nullCategoryResponse.data.product_categories[0].id).toEqual(
            productCategoryParent.id
          )
        })
      })
    })
  },
})
