import { IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { createAuthIdentities } from "../../__fixtures__/auth-identity"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IAuthModuleService>({
  moduleName: Modules.AUTH,
  testSuite: ({ service }) => {
    describe("AuthModuleService - AuthIdentity", () => {
      beforeEach(async () => {
        await createAuthIdentities(service)
      })

      describe("listAuthIdentities", () => {
        it("should list authIdentities", async () => {
          const authIdentities = await service.listAuthIdentities(
            {},
            { relations: ["provider_identities"] }
          )

          expect(authIdentities).toEqual([
            expect.objectContaining({
              provider_identities: [
                expect.objectContaining({ provider: "store" }),
              ],
            }),
            expect.objectContaining({
              provider_identities: [
                expect.objectContaining({ provider: "manual" }),
              ],
            }),
            expect.objectContaining({
              provider_identities: [
                expect.objectContaining({ provider: "manual" }),
              ],
            }),
          ])
        })

        it("should list authIdentities by id", async () => {
          const authIdentities = await service.listAuthIdentities({
            id: ["test-id"],
          })

          expect(authIdentities).toEqual([
            expect.objectContaining({
              id: "test-id",
            }),
          ])
        })

        it("should list authIdentities by provider", async () => {
          const authIdentities = await service.listAuthIdentities({
            provider_identities: {
              provider: "manual",
            },
          })

          expect(authIdentities).toEqual([
            expect.objectContaining({
              id: "test-id",
            }),
            expect.objectContaining({
              id: "test-id-1",
            }),
          ])
        })

        it("should list authIdentities by meta data", async () => {
          const authIdentities = await service.listAuthIdentities({
            app_metadata: {
              user_id: "user-1",
            },
          })

          expect(authIdentities).toEqual([
            expect.objectContaining({
              id: "test-id",
            }),
          ])
        })
      })

      describe("listAndCountAuthIdentities", () => {
        it("should list and count authIdentities", async () => {
          const [authIdentities, count] =
            await service.listAndCountAuthIdentities(
              {},
              { relations: ["provider_identities"] }
            )

          expect(count).toEqual(3)
          expect(authIdentities).toEqual([
            expect.objectContaining({
              provider_identities: [
                expect.objectContaining({ provider: "store" }),
              ],
            }),
            expect.objectContaining({
              provider_identities: [
                expect.objectContaining({ provider: "manual" }),
              ],
            }),
            expect.objectContaining({
              provider_identities: [
                expect.objectContaining({ provider: "manual" }),
              ],
            }),
          ])
        })

        it("should listAndCount authIdentities by provider_id", async () => {
          const [authIdentities, count] =
            await service.listAndCountAuthIdentities({
              provider_identities: { provider: "manual" },
            })

          expect(count).toEqual(2)
          expect(authIdentities).toEqual([
            expect.objectContaining({
              id: "test-id",
            }),
            expect.objectContaining({
              id: "test-id-1",
            }),
          ])
        })
      })

      describe("retrieveAuthIdentity", () => {
        const id = "test-id"

        it("should return an authIdentity for the given id", async () => {
          const authIdentity = await service.retrieveAuthIdentity(id)

          expect(authIdentity).toEqual(
            expect.objectContaining({
              id,
            })
          )
        })

        it("should throw an error when an authIdentity with the given id does not exist", async () => {
          let error

          try {
            await service.retrieveAuthIdentity("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "AuthIdentity with id: does-not-exist was not found"
          )
        })

        it("should not return an authIdentity with password hash", async () => {
          const authIdentity = await service.retrieveAuthIdentity("test-id-1")

          expect(authIdentity).toEqual(
            expect.objectContaining({
              id: "test-id-1",
            })
          )
          expect(
            authIdentity.provider_identities?.[0].provider_metadata?.[
              "password_hash"
            ]
          ).toEqual(undefined)
        })

        it("should throw an error when a authIdentityId is not provided", async () => {
          let error

          try {
            await service.retrieveAuthIdentity(undefined as unknown as string)
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual("authIdentity - id must be defined")
        })

        it("should return authIdentity based on config select param", async () => {
          const authIdentity = await service.retrieveAuthIdentity(id, {
            select: ["id"],
          })

          expect(authIdentity).toEqual({
            id,
          })
        })
      })

      describe("deleteAuthIdentity", () => {
        const id = "test-id"

        it("should delete the authIdentities given an id successfully", async () => {
          await service.deleteAuthIdentities([id])

          const authIdentities = await service.listAuthIdentities({
            id: [id],
          })

          expect(authIdentities).toHaveLength(0)
        })
      })

      describe("updateAuthIdentity", () => {
        const id = "test-id"

        it("should throw an error when a id does not exist", async () => {
          let error

          try {
            await service.updateAuthIdentities([
              {
                id: "does-not-exist",
              },
            ])
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            'AuthIdentity with id "does-not-exist" not found'
          )
        })

        it("should update authIdentity", async () => {
          await service.updateAuthIdentities([
            {
              id,
              app_metadata: { email: "test@email.com" },
            },
          ])

          const [authIdentity] = await service.listAuthIdentities({ id: [id] })
          expect(authIdentity).toEqual(
            expect.objectContaining({
              app_metadata: expect.objectContaining({
                email: "test@email.com",
              }),
            })
          )
        })
      })

      describe("createAuthIdentity", () => {
        it("should create a authIdentity successfully", async () => {
          await service.createAuthIdentities([
            {
              id: "test",
              provider_identities: [
                {
                  provider: "manual",
                  entity_id: "test",
                },
              ],
            },
          ])

          const [authIdentity, count] =
            await service.listAndCountAuthIdentities({
              id: ["test"],
            })

          expect(count).toEqual(1)
          expect(authIdentity[0]).toEqual(
            expect.objectContaining({
              id: "test",
            })
          )
        })
      })

      describe("createProviderIdentity", () => {
        it("should create a providerIdentity successfully", async () => {
          let authIdentity = await service.retrieveAuthIdentity("test-id", {
            relations: ["provider_identities"],
          })

          expect(authIdentity).toEqual(
            expect.not.objectContaining({
              provider_identities: [
                expect.objectContaining({ provider: "manual" }),
                expect.objectContaining({ provider: "github" }),
              ],
            })
          )

          await service.createProviderIdentities({
            id: "test",
            entity_id: "christian@medusajs.com",
            provider: "github",
            auth_identity_id: authIdentity.id,
          })

          authIdentity = await service.retrieveAuthIdentity("test-id", {
            relations: ["provider_identities"],
          })

          expect(authIdentity).toEqual(
            expect.objectContaining({
              provider_identities: [
                expect.objectContaining({ provider: "manual" }),
                expect.objectContaining({ provider: "github" }),
              ],
            })
          )
        })

        it("should list authIdentities by newly created provider", async () => {
          await service.createProviderIdentities([
            {
              id: "test",
              entity_id: "christian@medusajs.com",
              provider: "github",
              auth_identity_id: "test-id",
            },
          ])

          const authIdentities = await service.listAuthIdentities({
            provider_identities: {
              provider: "github",
            },
          })

          expect(authIdentities).toEqual([
            expect.objectContaining({
              id: "test-id",
            }),
          ])
        })
      })

      describe("deleteProviderIdentity", () => {
        const entity_id = "provider-test-id"

        it("should delete the providerIdentities given an id successfully", async () => {
          let providerIdentities = await service.listProviderIdentities({
            entity_id,
          })

          expect(providerIdentities).toHaveLength(1)
          const providerIdentityId = providerIdentities[0].id

          await service.deleteProviderIdentities([providerIdentityId])

          providerIdentities = await service.listProviderIdentities({
            entity_id,
          })

          expect(providerIdentities).toHaveLength(0)
        })
      })

      describe("updateProviderIdentity", () => {
        const entity_id = "provider-test-id"

        it("should throw an error when a id does not exist", async () => {
          let error

          try {
            await service.updateProviderIdentities([
              {
                id: "does-not-exist",
              },
            ])
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            'ProviderIdentity with id "does-not-exist" not found'
          )
        })

        it("should update providerIdentity", async () => {
          let [providerIdentity] = await service.listProviderIdentities({
            entity_id,
          })
          await service.updateProviderIdentities([
            {
              id: providerIdentity.id,
              provider_metadata: { email: "test@email.com" },
            },
          ])

          const providerIdentities = await service.listProviderIdentities({
            id: [providerIdentity.id],
          })

          expect(providerIdentities[0]).toEqual(
            expect.objectContaining({
              provider_metadata: expect.objectContaining({
                email: "test@email.com",
              }),
            })
          )
        })
      })
    })
  },
})
