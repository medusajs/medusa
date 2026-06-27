import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let type1
    let type2

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      type1 = (
        await api.post(
          "/admin/shipping-option-types",
          {
            label: "Test1",
            code: "test1",
            description: "Test1 description",
          },
          adminHeaders
        )
      ).data.shipping_option_type

      type2 = (
        await api.post(
          "/admin/shipping-option-types",
          {
            label: "Test2",
            code: "test2",
            description: "Test2 description",
          },
          adminHeaders
        )
      ).data.shipping_option_type

      await dbUtils.snapshot()
    })

    describe("/admin/shipping-option-types", () => {
      it("returns a list of shipping option types", async () => {
        const res = await api.get("/admin/shipping-option-types", adminHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.shipping_option_types).toEqual(
          expect.arrayContaining([
            {
              id: expect.stringMatching(/sotype_.{24}/),
              label: "Test1",
              code: "test1",
              description: "Test1 description",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
            {
              id: expect.stringMatching(/sotype_.{24}/),
              label: "Test2",
              code: "test2",
              description: "Test2 description",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ])
        )
      })

      it("returns a list of shipping option types matching free text search param", async () => {
        const res = await api.get(
          "/admin/shipping-option-types?q=st1",
          adminHeaders
        )

        expect(res.status).toEqual(200)

        expect(res.data.shipping_option_types).toEqual([
          {
            id: expect.stringMatching(/sotype_.{24}/),
            label: "Test1",
            code: "test1",
            description: "Test1 description",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ])
      })

      it("returns a list of shipping option types matching code search param", async () => {
        const res = await api.get(
          "/admin/shipping-option-types?code=test1",
          adminHeaders
        )

        expect(res.status).toEqual(200)

        expect(res.data.shipping_option_types).toEqual([
          {
            id: expect.stringMatching(/sotype_.{24}/),
            label: "Test1",
            code: "test1",
            description: "Test1 description",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ])
      })
    })

    describe("/admin/shipping-option-types/:id", () => {
      it("returns a shipping option type", async () => {
        const res = await api.get(
          `/admin/shipping-option-types/${type1.id}`,
          adminHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.shipping_option_type).toEqual({
          id: expect.stringMatching(/sotype_.{24}/),
          label: "Test1",
          code: "test1",
          description: "Test1 description",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      })
    })
  },
})
