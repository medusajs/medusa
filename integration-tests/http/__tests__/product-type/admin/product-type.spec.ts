import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  createAdminUser,
  adminHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    let type1
    let type2

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      type1 = (
        await api.post(
          "/admin/product-types",
          {
            value: "test1",
          },
          adminHeaders
        )
      ).data.product_type

      type2 = (
        await api.post(
          "/admin/product-types",
          {
            value: "test2",
          },
          adminHeaders
        )
      ).data.product_type
    })

    describe("/admin/product-types", () => {
      it("returns a list of product types", async () => {
        const res = await api.get("/admin/product-types", adminHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_types).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              value: "test1",
            }),
            expect.objectContaining({
              value: "test2",
            }),
          ])
        )
      })

      it("returns a list of product types matching free text search param", async () => {
        const res = await api.get("/admin/product-types?q=test1", adminHeaders)

        expect(res.status).toEqual(200)

        // The value of the type should match the search param
        expect(res.data.product_types).toEqual([
          expect.objectContaining({
            value: "test1",
          }),
        ])
      })

      // BREAKING: Removed a test around filtering based on discount condition id, which is no longer supported
    })
  },
})
