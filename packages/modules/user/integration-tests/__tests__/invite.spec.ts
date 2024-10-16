import { IUserModuleService } from "@medusajs/framework/types/dist/user"
import { Modules, UserEvents } from "@medusajs/framework/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "@medusajs/test-utils"

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

moduleIntegrationTestRunner<IUserModuleService>({
  moduleName: Modules.USER,
  moduleOptions: {
    jwt_secret: "test",
  },
  injectedDependencies: {
    [Modules.EVENT_BUS]: new MockEventBusService(),
  },
  testSuite: ({ service }) => {
    describe("UserModuleService - Invite", () => {
      beforeEach(async () => {
        jest.clearAllMocks()
      })

      describe("listInvites", () => {
        it("should list invites", async () => {
          await service.createInvites(defaultInviteData)
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
          await service.createInvites(defaultInviteData)
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
          await service.createInvites(defaultInviteData)
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
          await service.createInvites(defaultInviteData)
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
          await service.createInvites(defaultInviteData)
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
          await service.createInvites(defaultInviteData)
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
          await service.createInvites(defaultInviteData)

          jest.clearAllMocks()

          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
          await service.updateInvites([
            {
              id: "1",
              accepted: true,
            },
          ])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              expect.objectContaining({
                data: { id: "1" },
                name: UserEvents.INVITE_UPDATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })
      })

      describe("resendInvite", () => {
        it("should emit token generated event for invites", async () => {
          await service.createInvites(defaultInviteData)
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")

          await service.refreshInviteTokens(["1"])

          expect(eventBusSpy).toHaveBeenCalledTimes(2)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              expect.objectContaining({
                data: { id: "1" },
                name: UserEvents.INVITE_TOKEN_GENERATED,
              }),
            ],
            {
              internal: true,
            }
          )
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

        it("should throw if there is an existing user with the invite email", async () => {
          let error
          await service.createUsers([
            {
              email: "existing@email.com",
            },
          ])

          try {
            await service.createInvites([
              {
                email: "existing@email.com",
              },
            ])
          } catch (e) {
            error = e
          }

          expect(error.message).toBe(
            `User account for following email(s) already exist: existing@email.com`
          )
        })

        it("should emit invite created events", async () => {
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
          await service.createInvites(defaultInviteData)

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              expect.objectContaining({
                data: { id: "1" },
                name: UserEvents.INVITE_CREATED,
              }),
              expect.objectContaining({
                data: { id: "2" },
                name: UserEvents.INVITE_CREATED,
              }),
              expect.objectContaining({
                data: { id: "1" },
                name: UserEvents.INVITE_TOKEN_GENERATED,
              }),
              expect.objectContaining({
                data: { id: "2" },
                name: UserEvents.INVITE_TOKEN_GENERATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })
      })
    })
  },
})
