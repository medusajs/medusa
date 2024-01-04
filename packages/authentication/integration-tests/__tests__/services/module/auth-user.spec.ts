import { SqlEntityManager } from "@mikro-orm/postgresql"

import { MikroOrmWrapper } from "../../../utils"
import { createAuthProviders } from "../../../__fixtures__/auth-provider"
import { createAuthUsers } from "../../../__fixtures__/auth-user"
import { DB_URL } from "@medusajs/pricing/integration-tests/utils"
import { IAuthenticationModuleService } from "@medusajs/types"
import { initialize } from "../../../../src"

jest.setTimeout(30000)

describe("AuthenticationModuleService - AuthUser", () => {
  let service: IAuthenticationModuleService
  let testManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    testManager = MikroOrmWrapper.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
      },
    })

    await createAuthProviders(testManager)
    await createAuthUsers(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("listAuthUsers", () => {
    it("should list authUsers", async () => {
      const authUsers = await service.listAuthUsers()
      const serialized = JSON.parse(JSON.stringify(authUsers))

      expect(serialized).toEqual([
        expect.objectContaining({
          provider: "manual",
        }),
        expect.objectContaining({
          provider: "manual",
        }),
        expect.objectContaining({
          provider: "store",
        }),
      ])
    })

    it("should list authUsers by id", async () => {
      const authUsers = await service.listAuthUsers({
        id: ["test-id"],
      })

      expect(authUsers).toEqual([
        expect.objectContaining({
          id: "test-id",
        }),
      ])
    })

    it("should list authUsers by provider_id", async () => {
      const authUsers = await service.listAuthUsers({
        provider_id: "manual",
      })

      const serialized = JSON.parse(JSON.stringify(authUsers))

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

  describe("listAndCountAuthUsers", () => {
    it("should list and count authUsers", async () => {
      const [authUsers, count] = await service.listAndCountAuthUsers()
      const serialized = JSON.parse(JSON.stringify(authUsers))

      expect(count).toEqual(3)
      expect(serialized).toEqual([
        expect.objectContaining({
          provider: "manual",
        }),
        expect.objectContaining({
          provider: "manual",
        }),
        expect.objectContaining({
          provider: "store",
        }),
      ])
    })

    it("should listAndCount authUsers by provider_id", async () => {
      const [authUsers, count] = await service.listAndCountAuthUsers({
        provider_id: "manual",
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
      const authUser = await service.retrieveAuthUser(id)

      expect(authUser).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when an authUser with the given id does not exist", async () => {
      let error

      try {
        await service.retrieveAuthUser("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "AuthUser with id: does-not-exist was not found"
      )
    })

    it("should not return an authUser with password hash", async () => {
      const authUser = await service.retrieveAuthUser("test-id-1")

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
        await service.retrieveAuthUser(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"authUserId" must be defined')
    })

    it("should return authUser based on config select param", async () => {
      const authUser = await service.retrieveAuthUser(id, {
        select: ["id"],
      })

      const serialized = JSON.parse(JSON.stringify(authUser))

      expect(serialized).toEqual({
        id,
      })
    })
  })

  describe("deleteAuthUser", () => {
    const id = "test-id"

    it("should delete the authUsers given an id successfully", async () => {
      await service.deleteAuthUser([id])

      const authUsers = await service.listAuthUsers({
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
        await service.updateAuthUser([
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
      await service.updateAuthUser([
        {
          id,
          provider_metadata: { email: "test@email.com" },
        },
      ])

      const [authUser] = await service.listAuthUsers({ id: [id] })
      expect(authUser).toEqual(
        expect.objectContaining({
          provider_metadata: { email: "test@email.com" },
        })
      )
    })
  })

  describe("createAuthUser", () => {
    it("should create a authUser successfully", async () => {
      await service.createAuthUser([
        {
          id: "test",
          provider_id: "manual",
        },
      ])

      const [authUser, count] = await service.listAndCountAuthUsers({
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
