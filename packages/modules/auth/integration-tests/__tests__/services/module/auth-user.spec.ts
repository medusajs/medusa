import { IAuthModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"
import { createAuthUsers } from "../../../__fixtures__/auth-user"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.AUTH,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IAuthModuleService>) => {
    describe("AuthModuleService - AuthUser", () => {
      beforeEach(async () => {
        await createAuthUsers(MikroOrmWrapper.forkManager())
      })

      describe("listAuthUsers", () => {
        it("should list authUsers", async () => {
          const authUsers = await service.list()

          expect(authUsers).toEqual([
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

        it("should list authUsers by id", async () => {
          const authUsers = await service.list({
            id: ["test-id"],
          })

          expect(authUsers).toEqual([
            expect.objectContaining({
              id: "test-id",
            }),
          ])
        })

        it("should list authUsers by provider", async () => {
          const authUsers = await service.list({
            provider: "manual",
          })

          expect(authUsers).toEqual([
            expect.objectContaining({
              id: "test-id",
            }),
            expect.objectContaining({
              id: "test-id-1",
            }),
          ])
        })
      })

      describe("listAndCountAuthUsers", () => {
        it("should list and count authUsers", async () => {
          const [authUsers, count] = await service.listAndCount()

          expect(count).toEqual(3)
          expect(authUsers).toEqual([
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

        it("should listAndCount authUsers by provider_id", async () => {
          const [authUsers, count] = await service.listAndCount({
            provider: "manual",
          })

          expect(count).toEqual(2)
          expect(authUsers).toEqual([
            expect.objectContaining({
              id: "test-id",
            }),
            expect.objectContaining({
              id: "test-id-1",
            }),
          ])
        })
      })

      describe("retrieveAuthUser", () => {
        const id = "test-id"

        it("should return an authUser for the given id", async () => {
          const authUser = await service.retrieve(id)

          expect(authUser).toEqual(
            expect.objectContaining({
              id,
            })
          )
        })

        it("should throw an error when an authUser with the given id does not exist", async () => {
          let error

          try {
            await service.retrieve("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "AuthUser with id: does-not-exist was not found"
          )
        })

        it("should not return an authUser with password hash", async () => {
          const authUser = await service.retrieve("test-id-1")

          expect(authUser).toEqual(
            expect.objectContaining({
              id: "test-id-1",
            })
          )
          expect(authUser["password_hash"]).toEqual(undefined)
        })

        it("should throw an error when a authUserId is not provided", async () => {
          let error

          try {
            await service.retrieve(undefined as unknown as string)
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual("authUser - id must be defined")
        })

        it("should return authUser based on config select param", async () => {
          const authUser = await service.retrieve(id, {
            select: ["id"],
          })

          expect(authUser).toEqual({
            id,
          })
        })
      })

      describe("deleteAuthUser", () => {
        const id = "test-id"

        it("should delete the authUsers given an id successfully", async () => {
          await service.delete([id])

          const authUsers = await service.list({
            id: [id],
          })

          expect(authUsers).toHaveLength(0)
        })
      })

      describe("updateAuthUser", () => {
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
            'AuthUser with id "does-not-exist" not found'
          )
        })

        it("should update authUser", async () => {
          await service.update([
            {
              id,
              provider_metadata: { email: "test@email.com" },
            },
          ])

          const [authUser] = await service.list({ id: [id] })
          expect(authUser).toEqual(
            expect.objectContaining({
              provider_metadata: { email: "test@email.com" },
            })
          )
        })
      })

      describe("createAuthUser", () => {
        it("should create a authUser successfully", async () => {
          await service.create([
            {
              id: "test",
              provider: "manual",
              entity_id: "test",
              scope: "store",
            },
          ])

          const [authUser, count] = await service.listAndCount({
            id: ["test"],
          })

          expect(count).toEqual(1)
          expect(authUser[0]).toEqual(
            expect.objectContaining({
              id: "test",
            })
          )
        })
      })
    })
  },
})
