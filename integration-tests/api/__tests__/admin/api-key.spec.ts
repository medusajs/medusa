import { ApiKeyType, ContainerRegistrationKeys } from "@medusajs/utils"
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
    describe("API Keys - Admin", () => {
      let container

      beforeAll(async () => {
        container = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, container)
      })

      it("should correctly implement the entire lifecycle of an api key", async () => {
        const created = await api.post(
          `/admin/api-keys`,
          {
            title: "Test Secret Key",
            type: ApiKeyType.SECRET,
          },
          adminHeaders
        )

        expect(created.status).toEqual(200)
        expect(created.data.api_key).toEqual(
          expect.objectContaining({
            id: created.data.api_key.id,
            title: "Test Secret Key",
            created_by: expect.any(String),
          })
        )
        // On create we get the token in raw form so we can store it.
        expect(created.data.api_key.token).toContain("sk_")

        const updated = await api.post(
          `/admin/api-keys/${created.data.api_key.id}`,
          {
            title: "Updated Secret Key",
          },
          adminHeaders
        )

        expect(updated.status).toEqual(200)
        expect(updated.data.api_key).toEqual(
          expect.objectContaining({
            id: created.data.api_key.id,
            title: "Updated Secret Key",
          })
        )

        const revoked = await api.post(
          `/admin/api-keys/${created.data.api_key.id}/revoke`,
          {},
          adminHeaders
        )

        expect(revoked.status).toEqual(200)
        expect(revoked.data.api_key).toEqual(
          expect.objectContaining({
            id: created.data.api_key.id,
            revoked_by: "admin_user",
          })
        )
        expect(revoked.data.api_key.revoked_at).toBeTruthy()

        const deleted = await api.delete(
          `/admin/api-keys/${created.data.api_key.id}`,
          adminHeaders
        )
        const listedApiKeys = await api.get(`/admin/api-keys`, adminHeaders)

        expect(deleted.status).toEqual(200)
        expect(listedApiKeys.data.api_keys).toHaveLength(0)
      })

      it("should allow searching for api keys", async () => {
        await api.post(
          `/admin/api-keys`,
          {
            title: "Test Secret Key",
            type: ApiKeyType.SECRET,
          },
          adminHeaders
        )
        await api.post(
          `/admin/api-keys`,
          {
            title: "Test Publishable Key",
            type: ApiKeyType.PUBLISHABLE,
          },
          adminHeaders
        )

        const listedSecretKeys = await api.get(
          `/admin/api-keys?q=Secret`,
          adminHeaders
        )
        const listedPublishableKeys = await api.get(
          `/admin/api-keys?q=Publish`,
          adminHeaders
        )

        expect(listedSecretKeys.data.api_keys).toHaveLength(1)
        expect(listedSecretKeys.data.api_keys[0].title).toEqual(
          "Test Secret Key"
        )
        expect(listedPublishableKeys.data.api_keys).toHaveLength(1)
        expect(listedPublishableKeys.data.api_keys[0].title).toEqual(
          "Test Publishable Key"
        )
      })

      it("can use a secret api key for authentication", async () => {
        const created = await api.post(
          `/admin/api-keys`,
          {
            title: "Test Secret Key",
            type: ApiKeyType.SECRET,
          },
          adminHeaders
        )

        const createdRegion = await api.post(
          `/admin/regions`,
          {
            name: "Test Region",
            currency_code: "usd",
            countries: ["us", "ca"],
          },
          {
            auth: {
              username: created.data.api_key.token,
            },
          }
        )

        expect(createdRegion.status).toEqual(200)
        expect(createdRegion.data.region.name).toEqual("Test Region")
      })

      it("falls back to other mode of authentication when an api key is not valid", async () => {
        const created = await api.post(
          `/admin/api-keys`,
          {
            title: "Test Secret Key",
            type: ApiKeyType.SECRET,
          },
          adminHeaders
        )

        await api.post(
          `/admin/api-keys/${created.data.api_key.id}/revoke`,
          {},
          adminHeaders
        )

        const err = await api
          .post(
            `/admin/regions`,
            {
              name: "Test Region",
              currency_code: "usd",
              countries: ["us", "ca"],
            },
            {
              auth: {
                username: created.data.api_key.token,
              },
            }
          )
          .catch((e) => e.message)

        const createdRegion = await api.post(
          `/admin/regions`,
          {
            name: "Test Region",
            currency_code: "usd",
            countries: ["us", "ca"],
          },
          {
            auth: {
              username: created.data.api_key.token,
            },
            ...adminHeaders,
          }
        )

        expect(err).toEqual("Request failed with status code 401")
        expect(createdRegion.status).toEqual(200)
        expect(createdRegion.data.region.name).toEqual("Test Region")
      })

      it("should associate sales channels with a publishable API key", async () => {
        const salesChannelRes = await api.post(
          `/admin/sales-channels`,
          {
            name: "Test Sales Channel",
          },
          adminHeaders
        )

        const { sales_channel } = salesChannelRes.data

        const apiKeyRes = await api.post(
          `/admin/api-keys`,
          {
            title: "Test publishable KEY",
            type: ApiKeyType.PUBLISHABLE,
          },
          adminHeaders
        )

        const { api_key } = apiKeyRes.data

        const keyWithChannelsRes = await api.post(
          `/admin/api-keys/${api_key.id}/sales-channels`,
          {
            add: [sales_channel.id],
          },
          adminHeaders
        )

        const keyWithChannels = (
          await api.get(
            `/admin/api-keys/${api_key.id}?fields=*sales_channels`,
            adminHeaders
          )
        ).data.api_key

        expect(keyWithChannelsRes.status).toEqual(200)
        expect(keyWithChannels.title).toEqual("Test publishable KEY")
        expect(keyWithChannels.sales_channels).toEqual([
          expect.objectContaining({
            id: sales_channel.id,
            name: "Test Sales Channel",
          }),
        ])
      })

      it("should throw if API key is not a publishable key", async () => {
        const salesChannelRes = await api.post(
          `/admin/sales-channels`,
          {
            name: "Test Sales Channel",
          },
          adminHeaders
        )

        const { sales_channel } = salesChannelRes.data

        const apiKeyRes = await api.post(
          `/admin/api-keys`,
          {
            title: "Test secret KEY",
            type: ApiKeyType.SECRET,
          },
          adminHeaders
        )

        const errorRes = await api
          .post(
            `/admin/api-keys/${apiKeyRes.data.api_key.id}/sales-channels`,
            {
              add: [sales_channel.id],
            },
            adminHeaders
          )
          .catch((err) => err)

        expect(errorRes.response.status).toEqual(400)
        expect(errorRes.response.data.message).toEqual(
          "Sales channels can only be associated with publishable API keys"
        )
      })

      it("should throw if sales channel does not exist", async () => {
        const apiKeyRes = await api.post(
          `/admin/api-keys`,
          {
            title: "Test publishable KEY",
            type: ApiKeyType.PUBLISHABLE,
          },
          adminHeaders
        )

        const errorRes = await api
          .post(
            `/admin/api-keys/${apiKeyRes.data.api_key.id}/sales-channels`,
            {
              add: ["phony"],
            },
            adminHeaders
          )
          .catch((err) => err)

        expect(errorRes.response.status).toEqual(400)
        expect(errorRes.response.data.message).toEqual(
          "Sales channels with IDs phony do not exist"
        )
      })

      it("should detach sales channels from a publishable API key", async () => {
        const salesChannelRes = await api.post(
          `/admin/sales-channels`,
          {
            name: "Test Sales Channel",
          },
          adminHeaders
        )

        const { sales_channel } = salesChannelRes.data

        const apiKeyRes = await api.post(
          `/admin/api-keys`,
          {
            title: "Test publishable KEY",
            type: ApiKeyType.PUBLISHABLE,
          },
          adminHeaders
        )

        const { api_key } = apiKeyRes.data

        const keyWithChannelsRes = await api.post(
          `/admin/api-keys/${api_key.id}/sales-channels`,
          {
            add: [sales_channel.id],
          },
          adminHeaders
        )

        const keyWithChannels = (
          await api.get(
            `/admin/api-keys/${api_key.id}?fields=*sales_channels`,
            adminHeaders
          )
        ).data.api_key

        expect(keyWithChannelsRes.status).toEqual(200)
        expect(keyWithChannels.title).toEqual("Test publishable KEY")
        expect(keyWithChannels.sales_channels).toEqual([
          expect.objectContaining({
            id: sales_channel.id,
            name: "Test Sales Channel",
          }),
        ])

        const keyWithoutChannelsRes = await api.post(
          `/admin/api-keys/${api_key.id}/sales-channels`,
          {
            remove: [sales_channel.id],
          },
          adminHeaders
        )

        const keyWithoutChannels = (
          await api.get(
            `/admin/api-keys/${api_key.id}?fields=*sales_channels`,
            adminHeaders
          )
        ).data.api_key

        expect(keyWithoutChannelsRes.status).toEqual(200)
        expect(keyWithoutChannels.title).toEqual("Test publishable KEY")
        expect(keyWithoutChannels.sales_channels).toEqual([])
      })

      it("should detach sales channels from a publishable API key on delete", async () => {
        const salesChannelRes = await api.post(
          `/admin/sales-channels`,
          {
            name: "Test Sales Channel",
          },
          adminHeaders
        )

        const { sales_channel } = salesChannelRes.data

        const apiKeyRes = await api.post(
          `/admin/api-keys`,
          {
            title: "Test publishable KEY",
            type: ApiKeyType.PUBLISHABLE,
          },
          adminHeaders
        )

        const { api_key } = apiKeyRes.data

        const keyWithChannelsRes = await api.post(
          `/admin/api-keys/${api_key.id}/sales-channels`,
          {
            add: [sales_channel.id],
          },
          adminHeaders
        )

        const keyWithChannels = (
          await api.get(
            `/admin/api-keys/${api_key.id}?fields=*sales_channels`,
            adminHeaders
          )
        ).data.api_key

        expect(keyWithChannelsRes.status).toEqual(200)
        expect(keyWithChannels.title).toEqual("Test publishable KEY")
        expect(keyWithChannels.sales_channels).toEqual([
          expect.objectContaining({
            id: sales_channel.id,
            name: "Test Sales Channel",
          }),
        ])

        await api.delete(`/admin/api-keys/${api_key.id}`, adminHeaders)

        const deletedApiKeys = await api.get(
          `/admin/api-keys?id=${api_key.id}`,
          adminHeaders
        )

        expect(deletedApiKeys.data.api_keys).toHaveLength(0)

        const remoteQuery = container.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )

        // Not the prettiest, but an easy way to check if the link was removed
        const channels = await remoteQuery({
          publishable_api_key_sales_channels: {
            __args: { sales_channel_id: [sales_channel.id] },
            fields: ["id", "sales_channel_id", "publishable_key_id"],
          },
        })

        expect(channels).toHaveLength(0)
      })
    })
  },
})
