import { IApiKeyModuleService } from "@medusajs/types"
import { ApiKeyType, Module, Modules } from "@medusajs/utils"
import crypto from "crypto"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import {
  createPublishableKeyFixture,
  createSecretKeyFixture,
} from "../__fixtures__"
import { ApiKeyModuleService } from "@services"

jest.setTimeout(100000)

const mockPublishableKeyBytes = () => {
  jest.spyOn(crypto, "randomBytes").mockImplementationOnce(() => {
    return Buffer.from(
      "44de31ebcf085fa423fc584aa854067025e937a79edb565f472404345f0f23be",
      "hex"
    )
  })
}

const mockSecretKeyBytes = () => {
  jest
    .spyOn(crypto, "randomBytes")
    .mockImplementationOnce(() => {
      return Buffer.from(
        "44de31ebcf085fa423fc584aa854067025e937a79edb565f472404345f0f23be",
        "hex"
      )
    })
    .mockImplementationOnce(() => {
      return Buffer.from("44de31ebcf085fa423fc584aa8540670", "hex")
    })
}

moduleIntegrationTestRunner<IApiKeyModuleService>({
  moduleName: Modules.API_KEY,
  testSuite: ({ service }) => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    it(`should export the appropriate linkable configuration`, () => {
      const linkable = Module(Modules.API_KEY, {
        service: ApiKeyModuleService,
      }).linkable

      expect(Object.keys(linkable)).toEqual(["apiKey"])

      linkable.apiKey.toJSON = undefined

      expect(linkable.apiKey).toEqual({
        id: {
          linkable: "api_key_id",
          primaryKey: "id",
          serviceName: "apiKey",
          field: "apiKey",
        },
      })
    })

    describe("API Key Module Service", () => {
      describe("creating a publishable API key", () => {
        it("should create it successfully", async function () {
          mockPublishableKeyBytes()
          const apiKey = await service.createApiKeys(
            createPublishableKeyFixture
          )

          expect(apiKey).toEqual(
            expect.objectContaining({
              title: "Test API Key",
              type: ApiKeyType.PUBLISHABLE,
              salt: undefined,
              created_by: "test",
              last_used_at: null,
              revoked_by: null,
              revoked_at: null,
              redacted: "pk_44d***3be",
              token:
                "pk_44de31ebcf085fa423fc584aa854067025e937a79edb565f472404345f0f23be",
            })
          )
        })
      })

      describe("creating a secret API key", () => {
        it("should get created successfully", async function () {
          mockSecretKeyBytes()
          const apiKey = await service.createApiKeys(createSecretKeyFixture)

          expect(apiKey).toEqual(
            expect.objectContaining({
              title: "Secret key",
              type: ApiKeyType.SECRET,
              salt: undefined,
              created_by: "test",
              last_used_at: null,
              revoked_by: null,
              revoked_at: null,
              redacted: "sk_44d***3be",
              token:
                "sk_44de31ebcf085fa423fc584aa854067025e937a79edb565f472404345f0f23be",
            })
          )
        })

        it("should only allow creating one active token", async function () {
          await expect(
            service.createApiKeys([
              createSecretKeyFixture,
              createSecretKeyFixture,
            ])
          ).rejects.toThrow(
            "You can only create one secret key at a time. You tried to create 2 secret keys."
          )

          await service.createApiKeys(createSecretKeyFixture)
          const err = await service
            .createApiKeys(createSecretKeyFixture)
            .catch((e) => e)
          expect(err.message).toEqual(
            "You can only have one active secret key a time. Revoke or delete your existing key before creating a new one."
          )
        })

        it("should allow for at most two tokens, where one is revoked", async function () {
          const firstApiKey = await service.createApiKeys(
            createSecretKeyFixture
          )
          await service.revoke(
            { id: firstApiKey.id },
            {
              revoked_by: "test",
            }
          )

          await service.createApiKeys(createSecretKeyFixture)
          const err = await service
            .createApiKeys(createSecretKeyFixture)
            .catch((e) => e)
          expect(err.message).toEqual(
            "You can only have one active secret key a time. Revoke or delete your existing key before creating a new one."
          )
        })
      })

      describe("revoking API keys", () => {
        it("should have the revoked at and revoked by set when a key is revoked", async function () {
          const firstApiKey = await service.createApiKeys(
            createSecretKeyFixture
          )
          const revokedKey = await service.revoke(firstApiKey.id, {
            revoked_by: "test",
          })

          expect(revokedKey).toEqual(
            expect.objectContaining({
              revoked_by: "test",
              revoked_at: expect.any(Date),
            })
          )
        })

        it("should be able to revoke a key in the future", async function () {
          const now = Date.parse("2021-01-01T00:00:00Z")
          const hourInSec = 3600
          jest.useFakeTimers().setSystemTime(now)

          const createdKey = await service.createApiKeys(createSecretKeyFixture)
          const revokedKey = await service.revoke(createdKey.id, {
            revoked_by: "test",
            revoke_in: hourInSec,
          })

          expect(revokedKey).toEqual(
            expect.objectContaining({
              revoked_by: "test",
              revoked_at: new Date(now + hourInSec * 1000),
            })
          )

          jest.useRealTimers()
        })

        it("should do nothing if the revokal list is empty", async function () {
          const firstApiKey = await service.createApiKeys(
            createSecretKeyFixture
          )
          let revokedKeys = await service.revoke([])
          expect(revokedKeys).toHaveLength(0)

          const apiKey = await service.retrieveApiKey(firstApiKey.id)
          expect(apiKey.revoked_at).toBeFalsy()
          expect(apiKey.revoked_by).toBeFalsy()
        })

        it("should not allow revoking an already revoked API key", async function () {
          const firstApiKey = await service.createApiKeys(
            createSecretKeyFixture
          )
          await service.revoke(firstApiKey.id, {
            revoked_by: "test",
          })

          const err = await service
            .revoke(firstApiKey.id, {
              revoked_by: "test2",
            })
            .catch((e) => e)

          expect(err.message).toEqual(
            `There are 1 secret keys that are already revoked.`
          )
        })
      })

      describe("updating an API key", () => {
        it("should update the name successfully", async function () {
          const createdApiKey = await service.createApiKeys(
            createSecretKeyFixture
          )

          const updatedApiKey = await service.updateApiKeys(createdApiKey.id, {
            title: "New Name",
          })
          expect(updatedApiKey.title).toEqual("New Name")
        })

        it("should not reflect any updates on other fields", async function () {
          const createdApiKey = await service.createApiKeys(
            createSecretKeyFixture
          )

          const updatedApiKey = await service.updateApiKeys(createdApiKey.id, {
            title: createdApiKey.title,
            revoked_by: "test",
            revoked_at: new Date(),
            last_used_at: new Date(),
          })

          // These should not be returned on an update
          createdApiKey.token = ""
          expect(createdApiKey).toEqual(updatedApiKey)
        })
      })

      describe("deleting API keys", () => {
        it("should successfully delete existing api keys", async function () {
          const createdApiKeys = await service.createApiKeys([
            createPublishableKeyFixture,
            createSecretKeyFixture,
          ])
          await service.deleteApiKeys([
            createdApiKeys[0].id,
            createdApiKeys[1].id,
          ])

          const apiKeysInDatabase = await service.listApiKeys()
          expect(apiKeysInDatabase).toHaveLength(0)
        })
      })

      describe("authenticating with API keys", () => {
        it("should authenticate a secret key successfully", async function () {
          const createdApiKey = await service.createApiKeys(
            createSecretKeyFixture
          )
          const authenticated = await service.authenticate(createdApiKey.token)

          expect(authenticated).toBeTruthy()
          expect(authenticated.title).toEqual(createSecretKeyFixture.title)
        })
        it("should authenticate with a token to be revoked in the future", async function () {
          const createdApiKey = await service.createApiKeys(
            createSecretKeyFixture
          )

          // We simulate setting the revoked_at in the future here
          jest.useFakeTimers().setSystemTime(new Date().setFullYear(3000))
          await service.revoke(createdApiKey.id, {
            revoked_by: "test",
          })
          jest.useRealTimers()

          const authenticated = await service.authenticate(createdApiKey.token)
          expect(authenticated).toBeTruthy()
          expect(authenticated.title).toEqual(createdApiKey.title)
        })

        it("should not authenticate a publishable key", async function () {
          const createdApiKey = await service.createApiKeys(
            createPublishableKeyFixture
          )
          const authenticated = await service.authenticate(createdApiKey.token)

          expect(authenticated).toBeFalsy()
        })
        it("should not authenticate with a non-existent token", async function () {
          const createdApiKey = await service.createApiKeys(
            createSecretKeyFixture
          )
          const authenticated = await service.authenticate("some-token")

          expect(authenticated).toBeFalsy()
        })
        it("should not authenticate with a revoked token", async function () {
          const createdApiKey = await service.createApiKeys(
            createSecretKeyFixture
          )
          await service.revoke(createdApiKey.id, {
            revoked_by: "test",
          })
          const authenticated = await service.authenticate(createdApiKey.token)

          expect(authenticated).toBeFalsy()
        })
      })

      describe("retrieving API keys", () => {
        it("should successfully return all existing api keys", async function () {
          await service.createApiKeys([
            createPublishableKeyFixture,
            createSecretKeyFixture,
          ])

          const apiKeysInDatabase = await service.listApiKeys()
          expect(apiKeysInDatabase).toHaveLength(2)
        })

        it("should only return keys with matching token", async function () {
          const created = await service.createApiKeys([
            createPublishableKeyFixture,
            createPublishableKeyFixture,
          ])

          const apiKeysInDatabase = await service.listApiKeys({
            token: created[0].token,
          })
          expect(apiKeysInDatabase).toHaveLength(1)
          expect(apiKeysInDatabase[0].token).toEqual(created[0].token)
        })

        it("should not return the token and salt for secret keys when listing", async function () {
          await service.createApiKeys([createSecretKeyFixture])

          const apiKeysInDatabase = await service.listApiKeys()
          expect(apiKeysInDatabase).toHaveLength(1)
          expect(apiKeysInDatabase[0].token).toBeFalsy()
          expect(apiKeysInDatabase[0].salt).toBeFalsy()
        })

        it("should return the token for publishable keys when listing", async function () {
          await service.createApiKeys([createPublishableKeyFixture])

          const apiKeysInDatabase = await service.listApiKeys()
          expect(apiKeysInDatabase).toHaveLength(1)
          expect(apiKeysInDatabase[0].token).toBeTruthy()
          expect(apiKeysInDatabase[0].salt).toBeFalsy()
        })

        it("should not return the token and salt for secret keys when listing and counting", async function () {
          await service.createApiKeys([createSecretKeyFixture])

          const [apiKeysInDatabase] = await service.listAndCountApiKeys()
          expect(apiKeysInDatabase).toHaveLength(1)
          expect(apiKeysInDatabase[0].token).toBeFalsy()
          expect(apiKeysInDatabase[0].salt).toBeFalsy()
        })

        it("should return the token for publishable keys when listing and counting", async function () {
          await service.createApiKeys([createPublishableKeyFixture])

          const [apiKeysInDatabase] = await service.listAndCountApiKeys()
          expect(apiKeysInDatabase).toHaveLength(1)
          expect(apiKeysInDatabase[0].token).toBeTruthy()
          expect(apiKeysInDatabase[0].salt).toBeFalsy()
        })

        it("should not return the token and salt for secret keys when retrieving", async function () {
          const [createdApiKey] = await service.createApiKeys([
            createSecretKeyFixture,
          ])

          const apiKeyInDatabase = await service.retrieveApiKey(
            createdApiKey.id
          )
          expect(apiKeyInDatabase.token).toBeFalsy()
          expect(apiKeyInDatabase.salt).toBeFalsy()
        })

        it("should return the token for publishable keys when retrieving", async function () {
          const [createdApiKey] = await service.createApiKeys([
            createPublishableKeyFixture,
          ])

          const apiKeyInDatabase = await service.retrieveApiKey(
            createdApiKey.id
          )
          expect(apiKeyInDatabase.token).toBeTruthy()
          expect(apiKeyInDatabase.salt).toBeFalsy()
        })
      })
    })
  },
})
