import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Product categories - Admin", () => {
      let container

      beforeAll(async () => {
        container = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, container)
      })

      it("should correctly query categories by q", async () => {
        const productService = container.resolve("productModuleService")
        const categoryOne = await productService.createCategory({
          name: "Category One",
        })
        const categoryTwo = await productService.createCategory({
          name: "Category Two",
          parent_category_id: categoryOne.id,
        })
        const categoryThree = await productService.createCategory({
          name: "Category Three",
          parent_category_id: categoryTwo.id,
        })

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
