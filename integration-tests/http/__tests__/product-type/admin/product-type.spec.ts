import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
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
            {
              id: expect.stringMatching(/ptyp_.{24}/),
              value: "test1",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              metadata: null,
            },
            {
              id: expect.stringMatching(/ptyp_.{24}/),
              value: "test2",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              metadata: null,
            },
          ])
        )
      })

      it("returns a list of product types matching free text search param", async () => {
        const res = await api.get("/admin/product-types?q=test1", adminHeaders)

        expect(res.status).toEqual(200)

        // The value of the type should match the search param
        expect(res.data.product_types).toEqual([
          {
            id: expect.stringMatching(/ptyp_.{24}/),
            value: "test1",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            metadata: null,
          },
        ])
      })

      // BREAKING: Removed a test around filtering based on discount condition id, which is no longer supported
    })

    describe("/admin/product-types/:id", () => {
      it("returns a product type", async () => {
        const res = await api.get(
          `/admin/product-types/${type1.id}`,
          adminHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.product_type).toEqual({
          id: expect.stringMatching(/ptyp_.{24}/),
          value: "test1",
          created_at: expect.any(String),
          updated_at: expect.any(String),
          metadata: null,
        })
      })
    })
  },
})
