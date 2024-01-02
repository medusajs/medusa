import { SqlEntityManager } from "@mikro-orm/postgresql"
import { AuthProviderRepository } from "@repositories"
import { AuthProviderService } from "@services"

import { MikroOrmWrapper } from "../../../utils"
import { createAuthProviders } from "../../../__fixtures__/auth-provider"

jest.setTimeout(30000)

describe("AuthProvider Service", () => {
  let service: AuthProviderService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()
    testManager = await MikroOrmWrapper.forkManager()

    const authProviderRepository = new AuthProviderRepository({
      manager: repositoryManager,
    })

    service = new AuthProviderService({
      authProviderRepository,
    })

    await createAuthProviders(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("list", () => {
    it("should list AuthProviders", async () => {
      const authProviders = await service.list()
      const serialized = JSON.parse(JSON.stringify(authProviders))

      expect(serialized).toEqual([
        expect.objectContaining({
          provider: "manual",
        }),
        expect.objectContaining({
          provider: "disabled",
        }),
        expect.objectContaining({
          provider: "store",
        }),
        expect.objectContaining({
          provider: "admin",
        }),
      ])
    })

    it("should list authProviders by provider id", async () => {
      const authProviders = await service.list({
        provider: ["manual"],
      })

      expect(authProviders).toEqual([
        expect.objectContaining({
          provider: "manual",
        }),
      ])
    })

    it("should list active authProviders", async () => {
      const authProviders = await service.list({
        is_active: true,
      })

      const serialized = JSON.parse(JSON.stringify(authProviders))

      expect(serialized).toEqual([
        expect.objectContaining({
          provider: "manual",
        }),
        expect.objectContaining({
          provider: "store",
        }),
        expect.objectContaining({
          provider: "admin",
        }),
      ])
    })
  })

  describe("listAndCount", () => {
    it("should list AuthProviders", async () => {
      const [authProviders, count] = await service.listAndCount()
      const serialized = JSON.parse(JSON.stringify(authProviders))

      expect(count).toEqual(4)
      expect(serialized).toEqual([
        expect.objectContaining({
          provider: "manual",
        }),
        expect.objectContaining({
          provider: "disabled",
        }),
        expect.objectContaining({
          provider: "store",
        }),
        expect.objectContaining({
          provider: "admin",
        }),
      ])
    })

    it("should listAndCount authProviders by provider", async () => {
      const [authProviders, count] = await service.listAndCount({
        provider: ["manual"],
      })

      expect(count).toEqual(1)
      expect(authProviders).toEqual([
        expect.objectContaining({
          provider: "manual",
        }),
      ])
    })

    it("should listAndCount active authProviders", async () => {
      const [authProviders, count] = await service.listAndCount({
        is_active: true,
      })

      const serialized = JSON.parse(JSON.stringify(authProviders))

      expect(count).toEqual(3)
      expect(serialized).toEqual([
        expect.objectContaining({
          provider: "manual",
        }),
        expect.objectContaining({
          provider: "store",
        }),
        expect.objectContaining({
          provider: "admin",
        }),
      ])
    })
  })

  describe("retrieve", () => {
    const provider = "manual"

    it("should return an authProvider for the given provider", async () => {
      const authProvider = await service.retrieve(provider)

      expect(authProvider).toEqual(
        expect.objectContaining({
          provider,
        })
      )
    })

    it("should throw an error when an authProvider with the given provider does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "AuthProvider with provider: does-not-exist was not found"
      )
    })

    it("should throw an error when a provider is not provided", async () => {
      let error

      try {
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"authProviderProvider" must be defined')
    })

    it("should return authProvider based on config select param", async () => {
      const authProvider = await service.retrieve(provider, {
        select: ["provider"],
      })

      const serialized = JSON.parse(JSON.stringify(authProvider))

      expect(serialized).toEqual({
        provider,
      })
    })
  })

  describe("delete", () => {
    const provider = "manual"

    it("should delete the authProviders given a provider successfully", async () => {
      await service.delete([provider])

      const authProviders = await service.list({
        provider: [provider],
      })

      expect(authProviders).toHaveLength(0)
    })
  })

  describe("update", () => {
    const provider = "manual"

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.update([
          {
            provider: "does-not-exist",
          },
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        'AuthProvider with provider "does-not-exist" not found'
      )
    })

    it("should update authProvider", async () => {
      await service.update([
        {
          provider: "manual",
          name: "test",
        },
      ])

      const [provider] = await service.list({ provider: ["manual"] })
      expect(provider).toEqual(
        expect.objectContaining({
          name: "test",
        })
      )
    })
  })

  describe("create", () => {
    it("should create a authProvider successfully", async () => {
      await service.create([
        {
          provider: "test",
          name: "test provider",
        },
      ])

      const [authProvider] = await service.list({
        provider: ["test"],
      })

      expect(authProvider).toEqual(
        expect.objectContaining({
          provider: "test",
        })
      )
    })
  })
})
