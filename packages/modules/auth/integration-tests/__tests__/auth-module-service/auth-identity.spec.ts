import { IAuthModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"
import { createAuthIdentities } from "../../__fixtures__/auth-identity"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.AUTH,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IAuthModuleService>) => {
    describe("AuthModuleService - AuthIdentity", () => {
      beforeEach(async () => {
        await createAuthIdentities(service)
      })

      describe("listAuthIdentities", () => {
        it("should list authIdentities", async () => {
          const authIdentities = await service.list(
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
          const authIdentities = await service.list({
            id: ["test-id"],
          })

          expect(authIdentities).toEqual([
            expect.objectContaining({
              id: "test-id",
            }),
          ])
        })

        it("should list authIdentities by provider", async () => {
          const authIdentities = await service.list({
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
          const [authIdentities, count] = await service.listAndCount(
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
          const [authIdentities, count] = await service.listAndCount({
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
          const authIdentity = await service.retrieve(id)

          expect(authIdentity).toEqual(
            expect.objectContaining({
              id,
            })
          )
        })

        it("should throw an error when an authIdentity with the given id does not exist", async () => {
          let error

          try {
            await service.retrieve("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "AuthIdentity with id: does-not-exist was not found"
          )
        })

        it("should not return an authIdentity with password hash", async () => {
          const authIdentity = await service.retrieve("test-id-1")

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
            await service.retrieve(undefined as unknown as string)
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual("authIdentity - id must be defined")
        })

        it("should return authIdentity based on config select param", async () => {
          const authIdentity = await service.retrieve(id, {
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
          await service.delete([id])

          const authIdentities = await service.list({
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
            await service.update([
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
          await service.update([
            {
              id,
              app_metadata: { email: "test@email.com" },
            },
          ])

          const [authIdentity] = await service.list({ id: [id] })
          expect(authIdentity).toEqual(
            expect.objectContaining({
              app_metadata: { email: "test@email.com" },
            })
          )
        })
      })

      describe("createAuthIdentity", () => {
        it("should create a authIdentity successfully", async () => {
          await service.create([
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

          const [authIdentity, count] = await service.listAndCount({
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
