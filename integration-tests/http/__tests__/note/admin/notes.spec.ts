import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createAdminUser,
  adminHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    let adminUserId: string

    beforeAll(async () => {
      const container = getContainer()
      const { user } = await createAdminUser(
        dbConnection,
        adminHeaders,
        container
      )
      adminUserId = user.id
    })

    describe("/admin/notes", () => {
      it("creates a note using the authenticated admin as author, ignoring a client-supplied author_id", async () => {
        const response = await api.post(
          "/admin/notes",
          {
            resource_type: "order",
            resource_id: "order_01TESTCREATE",
            value: "Called customer",
            author_id: "user_someone_else",
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.note.author_id).toEqual(adminUserId)
        expect(response.data.note.resource_id).toEqual("order_01TESTCREATE")
        expect(response.data.note.resource_type).toEqual("order")
        expect(response.data.note.value).toEqual("Called customer")
      })

      it("rejects a resource_type outside the allowed enum", async () => {
        const response = await api
          .post(
            "/admin/notes",
            {
              resource_type: "not_a_real_type",
              resource_id: "order_01TESTREJECT",
              value: "x",
            },
            adminHeaders
          )
          .catch((e) => e.response)

        expect(response.status).toEqual(400)
      })

      it("lists notes for multiple resource_id values in one call", async () => {
        const orderAId = "order_01LISTA"
        const orderBId = "order_01LISTB"
        const orderCId = "order_01LISTC"

        await api.post(
          "/admin/notes",
          { resource_type: "order", resource_id: orderAId, value: "note a" },
          adminHeaders
        )
        await api.post(
          "/admin/notes",
          { resource_type: "order", resource_id: orderBId, value: "note b" },
          adminHeaders
        )

        const response = await api.get(
          `/admin/notes?resource_type=order&resource_id[]=${orderAId}&resource_id[]=${orderBId}&resource_id[]=${orderCId}`,
          adminHeaders
        )

        expect(
          response.data.notes
            .map((n: { resource_id: string }) => n.resource_id)
            .sort()
        ).toEqual([orderAId, orderBId].sort())
      })

      it("returns an empty list when resource_id[] is empty", async () => {
        const response = await api.get(
          `/admin/notes?resource_type=order&resource_id[]=`,
          adminHeaders
        )

        expect(response.data.notes).toEqual([])
      })

      it("deletes a note regardless of which admin created it", async () => {
        await createAdminUser(dbConnection, adminHeaders, getContainer(), {
          email: "other-admin@medusa.js",
        })

        const created = (
          await api.post(
            "/admin/notes",
            {
              resource_type: "order",
              resource_id: "order_01TESTDELETE",
              value: "note to delete",
            },
            adminHeaders
          )
        ).data.note

        // switch the shared adminHeaders bearer token back to the original admin
        await createAdminUser(dbConnection, adminHeaders, getContainer())

        const response = await api.delete(
          `/admin/notes/${created.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: created.id,
          object: "note",
          deleted: true,
        })
      })
    })
  },
})
