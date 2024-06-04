import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  createAdminUser,
  adminHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    let tag1
    let tag2

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      tag1 = (
        await api.post(
          "/admin/product-tags",
          {
            value: "test1",
          },
          adminHeaders
        )
      ).data.product_tag

      tag2 = (
        await api.post(
          "/admin/product-tags",
          {
            value: "test2",
          },
          adminHeaders
        )
      ).data.product_tag
    })

    describe("GET /admin/product-tags", () => {
      it("returns a list of product tags", async () => {
        const res = await api.get("/admin/product-tags", adminHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_tags).toEqual(
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

      it("returns a list of product tags matching free text search param", async () => {
        const res = await api.get("/admin/product-tags?q=1", adminHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_tags.length).toEqual(1)
        expect(res.data.product_tags).toEqual(
          expect.arrayContaining([expect.objectContaining({ value: "test1" })])
        )
      })
    })
    // BREAKING: Removed a test that filtered tags by discount condition id, which is no longer supported
  },
})
