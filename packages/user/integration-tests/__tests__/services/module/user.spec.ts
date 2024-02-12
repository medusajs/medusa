import { IUserModuleService } from "@medusajs/types/dist/user"
import { MikroOrmWrapper } from "../../../utils"
import { Modules } from "@medusajs/modules-sdk"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { createUsers } from "../../../__fixtures__/user"
import { getInitModuleConfig } from "../../../utils/get-init-module-config"
import { initModules } from "medusa-test-utils"

jest.setTimeout(30000)

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

    await createUsers(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  afterAll(async () => {
    await shutdownFunc()
  })

  describe("listUsers", () => {
    it("should list users", async () => {
      const users = await service.list()
      const serialized = JSON.parse(JSON.stringify(users))

      expect(serialized).toEqual([
        expect.objectContaining({
          id: "1",
        }),
      ])
    })

    it("should list users by id", async () => {
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

  describe("listAndCountUsers", () => {
    it("should list and count users", async () => {
      const [users, count] = await service.listAndCount()
      const serialized = JSON.parse(JSON.stringify(users))

      expect(count).toEqual(1)
      expect(serialized).toEqual([
        expect.objectContaining({
          id: "1",
        }),
      ])
    })

    it("should listAndCount Users by id", async () => {
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

  describe("retrieveUser", () => {
    const id = "1"

    it("should return an user for the given id", async () => {
      const user = await service.retrieve(id)

      expect(user).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when an user with the given id does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "User with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a userId is not provided", async () => {
      let error

      try {
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual("user - id must be defined")
    })

    it("should return user based on config select param", async () => {
      const User = await service.retrieve(id, {
        select: ["id"],
      })

      const serialized = JSON.parse(JSON.stringify(User))

      expect(serialized).toEqual({
        id,
      })
    })
  })

  describe("deleteUser", () => {
    const id = "1"

    it("should delete the Users given an id successfully", async () => {
      await service.delete([id])

      const users = await service.list({
        id: [id],
      })

      expect(users).toHaveLength(0)
    })
  })

  describe("updateUser", () => {
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

      expect(error.message).toEqual('User with id "does-not-exist" not found')
    })
  })

  describe("createUser", () => {
    it("should create a User successfully", async () => {
      await service.create([
        {
          id: "2",
        },
      ])

      const [User, count] = await service.listAndCount({
        id: ["2"],
      })

      expect(count).toEqual(1)
      expect(User[0]).toEqual(
        expect.objectContaining({
          id: "2",
        })
      )
    })
  })
})
