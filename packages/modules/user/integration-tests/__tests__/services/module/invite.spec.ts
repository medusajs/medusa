import { Modules } from "@medusajs/modules-sdk"
import { IUserModuleService } from "@medusajs/types/dist/user"
import { UserEvents } from "@medusajs/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
  SuiteOptions,
} from "medusa-test-utils"
import { createInvites } from "../../../__fixtures__/invite"

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

moduleIntegrationTestRunner({
  moduleName: Modules.USER,
  moduleOptions: {
    jwt_secret: "test",
  },
  injectedDependencies: {
    eventBusModuleService: new MockEventBusService(),
  },
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IUserModuleService>) => {
    describe("UserModuleService - Invite", () => {
      beforeEach(async () => {
        jest.clearAllMocks()
      })

      describe("listInvites", () => {
        it("should list invites", async () => {
          await createInvites(MikroOrmWrapper.forkManager(), defaultInviteData)

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
          await createInvites(MikroOrmWrapper.forkManager(), defaultInviteData)
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
          await createInvites(MikroOrmWrapper.forkManager(), defaultInviteData)
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
          await createInvites(MikroOrmWrapper.forkManager(), defaultInviteData)
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
          await createInvites(MikroOrmWrapper.forkManager(), defaultInviteData)
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
          await createInvites(MikroOrmWrapper.forkManager(), defaultInviteData)
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

          expect(error.message).toEqual(
            'Invite with id "does-not-exist" not found'
          )
        })

        it("should emit invite updated events", async () => {
          await createInvites(MikroOrmWrapper.forkManager(), defaultInviteData)

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
              data: { id: "1" },
              eventName: UserEvents.invite_updated,
            }),
          ])
        })
      })

      describe("resendInvite", () => {
        it("should emit token generated event for invites", async () => {
          await createInvites(MikroOrmWrapper.forkManager(), defaultInviteData)
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")

          await service.refreshInviteTokens(["1"])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith([
            expect.objectContaining({
              data: { id: "1" },
              eventName: UserEvents.invite_token_generated,
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
              data: { id: "1" },
              eventName: UserEvents.invite_created,
            }),
            expect.objectContaining({
              data: { id: "2" },
              eventName: UserEvents.invite_created,
            }),
            expect.objectContaining({
              data: { id: "1" },
              eventName: UserEvents.invite_token_generated,
            }),
            expect.objectContaining({
              data: { id: "2" },
              eventName: UserEvents.invite_token_generated,
            }),
          ])
        })
      })
    })
  },
})
