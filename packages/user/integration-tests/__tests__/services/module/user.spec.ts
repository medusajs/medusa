import { IUserModuleService } from "@medusajs/types/dist/user"
import { MikroOrmWrapper } from "../../../utils"
import { Modules } from "@medusajs/modules-sdk"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { createUsers } from "../../../__fixtures__/user"
import { getInitModuleConfig } from "../../../utils/get-init-module-config"
import { initModules } from "medusa-test-utils"

jest.setTimeout(30000)

const defaultUserData = [
  {
    id: "1",
    email: "user_1@test.com",
  },
  {
    id: "2",
    email: "user_2@test.com",
  },
]

describe("UserModuleService - User", () => {
  let service: IUserModuleService
  let testManager: SqlEntityManager
  let shutdownFunc: () => Promise<void>

  beforeAll(async () => {
    const initModulesConfig = getInitModuleConfig()

    const { medusaApp, shutdown } = await initModules(initModulesConfig)

    service = medusaApp.modules[Modules.USER]

    shutdownFunc = shutdown
  })

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    testManager = MikroOrmWrapper.forkManager()
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  afterAll(async () => {
    await shutdownFunc()
  })

  describe("list", () => {
    it("should list users", async () => {
      await createUsers(testManager, defaultUserData)

      const users = await service.list()

      expect(users).toEqual([
        expect.objectContaining({
          id: "1",
        }),
        expect.objectContaining({
          id: "2",
        }),
      ])
    })

    it("should list users by id", async () => {
      await createUsers(testManager, defaultUserData)
      const users = await service.list({
        id: ["1"],
      })

      expect(users).toEqual([
        expect.objectContaining({
          id: "1",
        }),
      ])
    })
  })

  describe("listAndCount", () => {
    it("should list and count users", async () => {
      await createUsers(testManager, defaultUserData)
      const [users, count] = await service.listAndCount()

      expect(count).toEqual(2)
      expect(users).toEqual([
        expect.objectContaining({
          id: "1",
        }),
        expect.objectContaining({
          id: "2",
        }),
      ])
    })

    it("should list and count users by id", async () => {
      await createUsers(testManager, defaultUserData)
      const [Users, count] = await service.listAndCount({
        id: "1",
      })

      expect(count).toEqual(1)
      expect(Users).toEqual([
        expect.objectContaining({
          id: "1",
        }),
      ])
    })
  })

  describe("retrieve", () => {
    const id = "1"

    it("should return an user for the given id", async () => {
      await createUsers(testManager, [
        {
          id,
          email: "user_1@test.com",
        },
      ])
      const user = await service.retrieve(id)

      expect(user).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when an user with the given id does not exist", async () => {
      const error = await service.retrieve("does-not-exist").catch((e) => e)

      expect(error.message).toEqual(
        "User with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a userId is not provided", async () => {
      const error = await service
        .retrieve(undefined as unknown as string)
        .catch((e) => e)

      expect(error.message).toEqual("user - id must be defined")
    })

    it("should return user based on config select param", async () => {
      await createUsers(testManager, [
        {
          id,
          email: "user_1@test.com",
        },
      ])
      const User = await service.retrieve(id, {
        select: ["id"],
      })

      const serialized = JSON.parse(JSON.stringify(User))

      expect(serialized).toEqual({
        id,
      })
    })
  })

  describe("delete", () => {
    const id = "1"

    it("should delete the users given an id successfully", async () => {
      await createUsers(testManager, [
        {
          id,
          email: "user_1@test.com",
        },
      ])
      await service.delete([id])

      const users = await service.list({
        id: [id],
      })

      expect(users).toHaveLength(0)
    })
  })

  describe("update", () => {
    it("should throw an error when a id does not exist", async () => {
      const error = await service
        .update([
          {
            id: "does-not-exist",
          },
        ])
        .catch((e) => e)

      expect(error.message).toEqual('User with id "does-not-exist" not found')
    })
  })

  describe("create", () => {
    it("should create a user successfully", async () => {
      await service.create([
        {
          id: "1",
          email: "test@test.com",
        },
      ])

      const [User, count] = await service.listAndCount({
        id: ["1"],
      })

      expect(count).toEqual(1)
      expect(User[0]).toEqual(
        expect.objectContaining({
          id: "1",
        })
      )
    })
  })
})
