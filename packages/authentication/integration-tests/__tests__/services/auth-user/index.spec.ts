import { SqlEntityManager } from "@mikro-orm/postgresql"
import { AuthUserRepository } from "@repositories"
import { AuthUserService } from "@services"

import { MikroOrmWrapper } from "../../../utils"
import { createAuthProviders } from "../../../__fixtures__/auth-provider"
import { createAuthUsers } from "../../../__fixtures__/auth-user"

jest.setTimeout(30000)

describe("AuthUser Service", () => {
  let service: AuthUserService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()
    testManager = await MikroOrmWrapper.forkManager()

    const authUserRepository = new AuthUserRepository({
      manager: repositoryManager,
    })

    service = new AuthUserService({
      authUserRepository,
    })

    await createAuthProviders(testManager)
    await createAuthUsers(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("list", () => {
    it("should list authUsers", async () => {
      const authUsers = await service.list()
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
      const authUsers = await service.list({
        id: ["test-id"],
      })

      expect(authUsers).toEqual([
        expect.objectContaining({
          id: "test-id",
        }),
      ])
    })

    it("should list authUsers by provider_id", async () => {
      const authUsers = await service.list({
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

  describe("listAndCount", () => {
    it("should list authUsers", async () => {
      const [authUsers, count] = await service.listAndCount()
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
      const [authUsers, count] = await service.listAndCount({
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

  describe("retrieve", () => {
    const id = "test-id"

    it("should return an authUser for the given id", async () => {
      const authUser = await service.retrieve(id)

      expect(authUser).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should return authUser based on config select param", async () => {
      const authUser = await service.retrieve(id, {
        select: ["id"],
      })

      const serialized = JSON.parse(JSON.stringify(authUser))

      expect(serialized).toEqual({
        id,
      })
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

    it("should throw an error when a authUserId is not provided", async () => {
      let error

      try {
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"authUserId" must be defined')
    })
  })

  describe("delete", () => {
    it("should delete the authUsers given an id successfully", async () => {
      const id = "test-id"

      await service.delete([id])

      const authUsers = await service.list({
        id: [id],
      })

      expect(authUsers).toHaveLength(0)
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
        'AuthUser with id "does-not-exist" not found'
      )
    })

    it("should update authUser", async () => {
      const id = "test-id"

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

  describe("create", () => {
    it("should create a authUser successfully", async () => {
      await service.create([
        {
          id: "test",
          provider_id: "manual",
        },
      ])

      const [authUser] = await service.list({
        id: ["test"],
      })

      expect(authUser).toEqual(
        expect.objectContaining({
          id: "test",
        })
      )
    })
  })
})
