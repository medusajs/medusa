import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createAdminUser,
  adminHeaders,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    let tag1
    let tag2
    let publishableKey
    let storeHeaders

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })

      tag1 = (
        await api.post(
          "/admin/product-tags",
          {
            value: "test1",
            external_id: "ext-test-01",
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

    describe("GET /store/product-tags", () => {
      it("returns a list of product tags", async () => {
        const res = await api.get("/store/product-tags", storeHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_tags).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              value: "test1",
              external_id: "ext-test-01",
            }),
            expect.objectContaining({
              value: "test2",
            }),
          ])
        )
      })

      it('returns a list of product tags matching external_id search param', async () => {
        const res = await api.get("/store/product-tags?external_id=ext-test-01", storeHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_tags.length).toEqual(1)
        expect(res.data.product_tags).toEqual(
          expect.arrayContaining([expect.objectContaining({ value: "test1", external_id: "ext-test-01" })])
        )
      });

      it("returns a list of product tags matching free text search param", async () => {
        const res = await api.get("/store/product-tags?q=1", storeHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_tags.length).toEqual(1)
        expect(res.data.product_tags).toEqual(
          expect.arrayContaining([expect.objectContaining({ value: "test1", external_id: "ext-test-01" })])
        )
      })
    })
  },
})
