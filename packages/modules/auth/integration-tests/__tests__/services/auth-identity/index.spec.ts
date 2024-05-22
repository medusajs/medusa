import { createAuthIdentities } from "../../../__fixtures__/auth-identity"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import { Modules } from "@medusajs/modules-sdk"
import { IAuthModuleService } from "@medusajs/types"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.AUTH,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IAuthModuleService>) => {
    describe("AuthIdentity Service", () => {
      beforeEach(async () => {
        await createAuthIdentities(MikroOrmWrapper.forkManager())
      })

      describe("list", () => {
        it("should list authIdentities", async () => {
          const authIdentities = await service.list()
          const serialized = JSON.parse(JSON.stringify(authIdentities))

          expect(serialized).toEqual([
            expect.objectContaining({
              provider: "store",
            }),
            expect.objectContaining({
              provider: "manual",
            }),
            expect.objectContaining({
              provider: "manual",
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

        it("should list authIdentities by provider_id", async () => {
          const authIdentities = await service.list({
            provider: "manual",
          })

          const serialized = JSON.parse(JSON.stringify(authIdentities))

          expect(serialized).toEqual([
            expect.objectContaining({
              id: "test-id",
            }),
            expect.objectContaining({
              id: "test-id-1",
            }),
          ])
        })
      })

      describe("listAndCount", () => {
        it("should list authIdentities", async () => {
          const [authIdentities, count] = await service.listAndCount()
          const serialized = JSON.parse(JSON.stringify(authIdentities))

          expect(count).toEqual(3)
          expect(serialized).toEqual([
            expect.objectContaining({
              provider: "store",
            }),
            expect.objectContaining({
              provider: "manual",
            }),
            expect.objectContaining({
              provider: "manual",
            }),
          ])
        })

        it("should listAndCount authIdentities by provider_id", async () => {
          const [authIdentities, count] = await service.listAndCount({
            provider: "manual",
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

      describe("retrieve", () => {
        const id = "test-id"

        it("should return an authIdentity for the given id", async () => {
          const authIdentity = await service.retrieve(id)

          expect(authIdentity).toEqual(
            expect.objectContaining({
              id,
            })
          )
        })

        it("should return authIdentity based on config select param", async () => {
          const authIdentity = await service.retrieve(id, {
            select: ["id"],
          })

          const serialized = JSON.parse(JSON.stringify(authIdentity))

          expect(serialized).toEqual({
            id,
          })
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

        it("should throw an error when a authIdentityId is not provided", async () => {
          let error

          try {
            await service.retrieve(undefined as unknown as string)
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual("authIdentity - id must be defined")
        })
      })

      describe("delete", () => {
        it("should delete the authIdentities given an id successfully", async () => {
          const id = "test-id"

          await service.delete([id])

          const authIdentities = await service.list({
            id: [id],
          })

          expect(authIdentities).toHaveLength(0)
        })
      })

      describe("update", () => {
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
          const id = "test-id"

          await service.update([
            {
              id,
              provider_metadata: { email: "test@email.com" },
            },
          ])

          const [authIdentity] = await service.list({ id: [id] })
          expect(authIdentity).toEqual(
            expect.objectContaining({
              provider_metadata: { email: "test@email.com" },
            })
          )
        })
      })

      describe("create", () => {
        it("should create a authIdentity successfully", async () => {
          await service.create([
            {
              id: "test",
              provider: "manual",
              entity_id: "test",
              scope: "store",
            },
          ])

          const [authIdentity] = await service.list({
            id: ["test"],
          })

          expect(authIdentity).toEqual(
            expect.objectContaining({
              id: "test",
            })
          )
        })
      })
    })
  },
})
