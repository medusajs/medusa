import { IUserModuleService } from "@medusajs/types/dist/user"
import { MikroOrmWrapper } from "../../../utils"
import { MockEventBusService } from "medusa-test-utils"
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
    email: "user_1@test.com",
    token: "test",
    expires_at: expireDate,
  },
  {
    id: "2",
    email: "user_2@test.com",
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
    jest.clearAllMocks()
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

      expect(invites).toEqual([
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

      expect(count).toEqual(2)
      expect(invites).toEqual([
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
      await createInvites(testManager, defaultInviteData)
      const invite = await service.retrieveInvite(id)

      expect(invite).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when an invite with the given id does not exist", async () => {
      const error = await service
        .retrieveInvite("does-not-exist")
        .catch((e) => e)

      expect(error.message).toEqual(
        "Invite with id: does-not-exist was not found"
      )
    })

    it("should throw an error when inviteId is not provided", async () => {
      const error = await service
        .retrieveInvite(undefined as unknown as string)
        .catch((e) => e)

      expect(error.message).toEqual("invite - id must be defined")
    })

    it("should return invite based on config select param", async () => {
      await createInvites(testManager, defaultInviteData)
      const invite = await service.retrieveInvite(id, {
        select: ["id"],
      })

      expect(invite).toEqual({
        id,
      })
    })
  })

  describe("updateInvite", () => {
    it("should throw an error when an id does not exist", async () => {
      const error = await service
        .updateInvites([
          {
            id: "does-not-exist",
          },
        ])
        .catch((e) => e)

      expect(error.message).toEqual('Invite with id "does-not-exist" not found')
    })

    it("should emit invite updated events", async () => {
      await createInvites(testManager, defaultInviteData)

      jest.clearAllMocks()

      const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
      await service.updateInvites([
        {
          id: "1",
          accepted: true,
        },
      ])

      expect(eventBusSpy).toHaveBeenCalledTimes(1)
      expect(eventBusSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          body: expect.objectContaining({
            data: { id: "1" },
          }),
          eventName: "invite.updated",
        }),
      ])
    })
  })

  describe("createInvitie", () => {
    it("should create an invite successfully", async () => {
      await service.createInvites(defaultInviteData)

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

    it("should emit invite created events", async () => {
      const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
      await service.createInvites(defaultInviteData)

      expect(eventBusSpy).toHaveBeenCalledTimes(1)
      expect(eventBusSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          body: expect.objectContaining({
            data: { id: "1" },
          }),
          eventName: "invite.created",
        }),
        expect.objectContaining({
          body: expect.objectContaining({
            data: { id: "2" },
          }),
          eventName: "invite.created",
        }),
      ])
    })
  })
})
