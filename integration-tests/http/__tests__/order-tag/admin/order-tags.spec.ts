import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createAdminUser,
  adminHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("/admin/order-tags", () => {
      it("creates a new tag", async () => {
        const response = await api.post(
          "/admin/order-tags",
          { value: "priority" },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.order_tag.value).toEqual("priority")
        expect(response.data.order_tag.id).toEqual(
          expect.stringContaining("otag_")
        )
      })

      it("returns the existing tag instead of erroring when the value already exists", async () => {
        const first = await api.post(
          "/admin/order-tags",
          { value: "duplicate-value" },
          adminHeaders
        )

        const response = await api.post(
          "/admin/order-tags",
          { value: "duplicate-value" },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.order_tag.id).toEqual(first.data.order_tag.id)

        const list = await api.get(
          "/admin/order-tags?value=duplicate-value",
          adminHeaders
        )

        expect(list.data.count).toEqual(1)
      })

      it("lists order tags", async () => {
        await api.post("/admin/order-tags", { value: "list-me" }, adminHeaders)

        const response = await api.get("/admin/order-tags", adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.order_tags).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ value: "list-me" }),
          ])
        )
      })

      it("updates an existing tag", async () => {
        const created = (
          await api.post(
            "/admin/order-tags",
            { value: "to-update" },
            adminHeaders
          )
        ).data.order_tag

        const response = await api.post(
          `/admin/order-tags/${created.id}`,
          { value: "updated-value" },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.order_tag.value).toEqual("updated-value")
      })

      it("deletes an existing tag", async () => {
        const created = (
          await api.post(
            "/admin/order-tags",
            { value: "to-delete" },
            adminHeaders
          )
        ).data.order_tag

        const response = await api.delete(
          `/admin/order-tags/${created.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: created.id,
          object: "order_tag",
          deleted: true,
        })
      })
    })
  },
})
