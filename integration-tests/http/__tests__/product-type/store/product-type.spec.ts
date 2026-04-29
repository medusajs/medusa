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
          "/admin/product-types",
          {
            value: "test1",
            external_id: "ext-test-01",
          },
          adminHeaders
        )
      ).data.product_type

      tag2 = (
        await api.post(
          "/admin/product-types",
          {
            value: "test2",
          },
          adminHeaders
        )
      ).data.product_type
    })

    describe("GET /store/product-types", () => {
      it("returns a list of product types", async () => {
        const res = await api.get("/store/product-types", storeHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_types).toEqual(
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

      it('returns a list of product types matching external_id search param', async () => {
        const res = await api.get("/store/product-types?external_id=ext-test-01", storeHeaders)
        
        expect(res.status).toEqual(200) 
        expect(res.data.product_types.length).toEqual(1)
        expect(res.data.product_types).toEqual(
          expect.arrayContaining([expect.objectContaining({ value: "test1", external_id: "ext-test-01" })])
        )
      });

      it("returns a list of product types matching free text search param", async () => {
        const res = await api.get("/store/product-types?q=1", storeHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_types.length).toEqual(1)
        expect(res.data.product_types).toEqual(
          expect.arrayContaining([expect.objectContaining({ value: "test1", external_id: "ext-test-01" })])
        )
      })
    })
  },
})
