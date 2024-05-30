import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Product categories - Admin", () => {
      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, getContainer())
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
    })
  },
})
