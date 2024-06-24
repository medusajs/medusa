import { IAuthModuleService } from "@medusajs/types"
import { createAuthIdentities } from "../../__fixtures__/auth-identity"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { Modules } from "@medusajs/utils"

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
            await service.updateAuthIdentites([
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
          await service.updateAuthIdentites([
            {
              id,
              app_metadata: { email: "test@email.com" },
            },
          ])

          const [authIdentity] = await service.listAuthIdentities({ id: [id] })
          expect(authIdentity).toEqual(
            expect.objectContaining({
              app_metadata: { email: "test@email.com" },
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
    })
  },
})
