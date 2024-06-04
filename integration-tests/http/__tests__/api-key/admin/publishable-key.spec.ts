import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Publishable Keys - Admin", () => {
      let pubKey1
      let pubKey2

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, getContainer())

        pubKey1 = (
          await api.post(
            "/admin/api-keys",
            { title: "sample key", type: "publishable" },
            adminHeaders
          )
        ).data.api_key
        pubKey2 = (
          await api.post(
            "/admin/api-keys",
            // BREAKING: The type field is now required
            { title: "just a title", type: "publishable" },
            adminHeaders
          )
        ).data.api_key
      })

      // BREAKING: The URL changed from /admin/api-keys to /admin/api-keys, as well as the response field
      describe("GET /admin/api-keys/:id", () => {
        it("retrieve a publishable key by id ", async () => {
          const response = await api.get(
            `/admin/api-keys/${pubKey1.id}`,
            adminHeaders
          )

          expect(response.status).toBe(200)

          expect(response.data.api_key).toMatchObject({
            id: pubKey1.id,
            created_at: expect.any(String),
            created_by: expect.stringContaining("user_"),
            revoked_by: null,
            revoked_at: null,
          })
        })
      })

      describe("GET /admin/api-keys", () => {
        it("list publishable keys", async () => {
          const response = await api.get(
            `/admin/api-keys?limit=2`,
            adminHeaders
          )

          expect(response.data.count).toBe(2)
          expect(response.data.limit).toBe(2)
          expect(response.data.offset).toBe(0)
          expect(response.data.api_keys).toHaveLength(2)
        })

        it("list publishable keys with query search", async () => {
          const response = await api.get(
            `/admin/api-keys?q=sample`,
            adminHeaders
          )

          expect(response.data.count).toBe(1)
          expect(response.data.limit).toBe(20)
          expect(response.data.offset).toBe(0)
          expect(response.data.api_keys).toHaveLength(1)
          expect(response.data.api_keys).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                title: "sample key",
              }),
            ])
          )
        })
      })

      describe("POST /admin/api-keys", () => {
        it("crete a publishable keys", async () => {
          const response = await api.post(
            `/admin/api-keys`,
            { title: "Store api key", type: "publishable" },
            adminHeaders
          )

          expect(response.status).toBe(200)
          expect(response.data.api_key).toMatchObject({
            created_by: expect.any(String),
            id: expect.any(String),
            title: "Store api key",
            revoked_by: null,
            revoked_at: null,
            created_at: expect.any(String),
          })
        })
      })

      describe("POST /admin/api-keys/:id", () => {
        it("update a publishable key", async () => {
          const response = await api.post(
            `/admin/api-keys/${pubKey1.id}`,
            { title: "Changed title" },
            adminHeaders
          )

          expect(response.status).toBe(200)
          expect(response.data.api_key).toMatchObject({
            id: pubKey1.id,
            title: "Changed title",
            revoked_by: null,
            revoked_at: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          })
        })
      })

      describe("DELETE /admin/api-keys/:id", () => {
        it("delete a publishable key", async () => {
          const response1 = await api.delete(
            `/admin/api-keys/${pubKey1.id}`,
            adminHeaders
          )

          expect(response1.status).toBe(200)
          expect(response1.data).toEqual({
            id: pubKey1.id,
            object: "api_key",
            deleted: true,
          })

          const err = await api
            .get(`/admin/api-keys/${pubKey1.id}`, adminHeaders)
            .catch((e) => e)

          expect(err.response.status).toBe(404)
        })
      })

      describe("POST /admin/api-keys/:id/revoke", () => {
        it("revoke a publishable key", async () => {
          const response = await api.post(
            `/admin/api-keys/${pubKey1.id}/revoke`,
            {},
            adminHeaders
          )

          expect(response.status).toBe(200)

          expect(response.data.api_key).toMatchObject({
            id: pubKey1.id,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            revoked_by: expect.stringContaining("user_"),
            revoked_at: expect.any(String),
          })
        })
      })

      // BREAKING: The GET /admin/api-keys/:id/sales-channels endpoint was removed.
      // It was replaced by the GET /admin/sales-channels endpoint where you can filter by publishable key
      // BREAKING: Batch route and input changed (no more batch suffix, and the input takes ids to add and remove)
      describe("Add /admin/api-keys/:id/sales-channels", () => {
        let salesChannel1
        let salesChannel2

        beforeEach(async () => {
          salesChannel1 = (
            await api.post(
              "/admin/sales-channels",
              {
                name: "test name",
                description: "test description",
              },
              adminHeaders
            )
          ).data.sales_channel

          salesChannel2 = (
            await api.post(
              "/admin/sales-channels",
              {
                name: "test name 2",
                description: "test description 2",
              },
              adminHeaders
            )
          ).data.sales_channel
        })

        it("add sales channels to the publishable api key scope", async () => {
          const response = await api.post(
            `/admin/api-keys/${pubKey1.id}/sales-channels`,
            {
              add: [salesChannel1.id, salesChannel2.id],
            },
            adminHeaders
          )

          expect(response.status).toBe(200)
          const keyWithChannels = (
            await api.get(`/admin/api-keys/${pubKey1.id}`, adminHeaders)
          ).data.api_key

          expect(keyWithChannels.sales_channels).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: salesChannel1.id,
              }),
              expect.objectContaining({
                id: salesChannel2.id,
              }),
            ])
          )
        })

        it("remove sales channels from the publishable api key scope", async () => {
          await api.post(
            `/admin/api-keys/${pubKey1.id}/sales-channels`,
            {
              add: [salesChannel1.id, salesChannel2.id],
            },
            adminHeaders
          )

          const response = await api.post(
            `/admin/api-keys/${pubKey1.id}/sales-channels`,
            {
              remove: [salesChannel1.id],
            },
            adminHeaders
          )

          expect(response.status).toBe(200)
          const keyWithChannels = (
            await api.get(`/admin/api-keys/${pubKey1.id}`, adminHeaders)
          ).data.api_key

          expect(keyWithChannels.sales_channels).toEqual([
            expect.objectContaining({
              id: salesChannel2.id,
            }),
          ])
        })

        it("list sales channels from the publishable api key", async () => {
          await api.post(
            `/admin/api-keys/${pubKey1.id}/sales-channels`,
            {
              add: [salesChannel1.id, salesChannel2.id],
            },
            adminHeaders
          )

          const response = await api.get(
            `/admin/api-keys/${pubKey1.id}`,
            adminHeaders
          )

          const salesChannels = response.data.api_key.sales_channels
          expect(response.status).toBe(200)
          expect(salesChannels.length).toEqual(2)
          expect(salesChannels).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: salesChannel1.id,
                name: "test name",
              }),
              expect.objectContaining({
                id: salesChannel2.id,
                name: "test name 2",
              }),
            ])
          )
        })
      })
    })
  },
})
