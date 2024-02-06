import { IUserModuleService } from "@medusajs/types/dist/user"
import { MikroOrmWrapper } from "../../../utils"
import { Modules } from "@medusajs/modules-sdk"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { createInvites } from "../../../__fixtures__/invite"
import { getInitModuleConfig } from "../../../utils/get-init-module-config"
import { initModules } from "medusa-test-utils"

jest.setTimeout(30000)

const today = new Date()
const expireDate = new Date(today.setDate(today.getDate() + 10))

const defaultInviteData = [
  {
    id: "1",
    user_identifier: "user_1@test.com",
    token: "test",
    expires_at: expireDate,
  },
  {
    id: "2",
    user_identifier: "user_2@test.com",
    token: "test",
    expires_at: expireDate,
  },
]

describe("UserModuleService - Invite", () => {
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

  describe("listInvites", () => {
    it("should list invites", async () => {
      await createInvites(testManager, defaultInviteData)

      const invites = await service.listInvites()
      const serialized = JSON.parse(JSON.stringify(invites))

      expect(serialized).toEqual([
        expect.objectContaining({
          id: "1",
        }),
        expect.objectContaining({
          id: "2",
        }),
      ])
    })

    it("should list invites by id", async () => {
      await createInvites(testManager, defaultInviteData)
      const invites = await service.listInvites({
        id: ["1"],
      })

      expect(invites).toEqual([
        expect.objectContaining({
          id: "1",
        }),
      ])
    })
  })

  describe("listAndCountInvites", () => {
    it("should list and count invites", async () => {
      await createInvites(testManager, defaultInviteData)
      const [invites, count] = await service.listAndCountInvites()
      const serialized = JSON.parse(JSON.stringify(invites))

      expect(count).toEqual(2)
      expect(serialized).toEqual([
        expect.objectContaining({
          id: "1",
        }),
        expect.objectContaining({
          id: "2",
        }),
      ])
    })

    it("should listAndCount invites by id", async () => {
      await createInvites(testManager, defaultInviteData)
      const [invites, count] = await service.listAndCountInvites({
        id: "1",
      })

      expect(count).toEqual(1)
      expect(invites).toEqual([
        expect.objectContaining({
          id: "1",
        }),
      ])
    })
  })

  describe("retrieveInvite", () => {
    const id = "1"

    it("should return an invite for the given id", async () => {
      await createInvites(testManager, [
        {
          id,
          user_identifier: "user_1@test.com",
          token: "test",
          expires_at: expireDate,
        },
      ])
      const invite = await service.retrieveInvite(id)

      expect(invite).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when an invite with the given id does not exist", async () => {
      let error

      try {
        await service.retrieveInvite("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "Invite with id: does-not-exist was not found"
      )
    })

    it("should throw an error when inviteId is not provided", async () => {
      let error

      try {
        await service.retrieveInvite(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual("invite - id must be defined")
    })

    it("should return invite based on config select param", async () => {
      await createInvites(testManager, [
        {
          id,
          user_identifier: "user_1@test.com",
          token: "test",
          expires_at: expireDate,
        },
      ])
      const invite = await service.retrieveInvite(id, {
        select: ["id"],
      })

      const serialized = JSON.parse(JSON.stringify(invite))

      expect(serialized).toEqual({
        id,
      })
    })
  })

  describe("deleteInvite", () => {
    const id = "1"

    it("should delete the Invite given an id successfully", async () => {
      await createInvites(testManager, [
        {
          id,
          user_identifier: "user_1@test.com",
          token: "test",
          expires_at: expireDate,
        },
      ])
      await service.deleteInvites([id])

      const invites = await service.listInvites({
        id: [id],
      })

      expect(invites).toHaveLength(0)
    })
  })

  describe("updateInvite", () => {
    it("should throw an error when an id does not exist", async () => {
      let error

      try {
        await service.updateInvite([
          {
            id: "does-not-exist",
          },
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('Invite with id "does-not-exist" not found')
    })
  })

  describe("createInvitie", () => {
    it("should create an invite successfully", async () => {
      await service.createInvite([
        {
          id: "1",
          user_identifier: "user_1@test.com",
          token: "test",
          expires_at: expireDate,
        },
      ])

      const [invites, count] = await service.listAndCountInvites({
        id: ["1"],
      })

      expect(count).toEqual(1)
      expect(invites[0]).toEqual(
        expect.objectContaining({
          id: "1",
        })
      )
    })
  })
})
