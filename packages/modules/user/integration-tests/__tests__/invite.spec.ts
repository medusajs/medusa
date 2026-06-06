import { IUserModuleService } from "@zjedene-medusa/framework/types"
import { Modules, UserEvents } from "@zjedene-medusa/framework/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "@zjedene-medusa/test-utils"
import jwt, { JwtPayload } from "jsonwebtoken"

jest.setTimeout(30000)

const defaultInviteData = [
  {
    id: "1",
    email: "user_1@test.com",
    token: "test",
  },
  {
    id: "2",
    email: "user_2@test.com",
    token: "test",
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

          const tokenContent = jwt.decode(invite.token) as JwtPayload
          expect(tokenContent.exp).toBeLessThanOrEqual(
            Date.now() / 1000 + 60 * 60 * 24
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

          // 2 events: 1 invite updated, 1 invite token generated
          const events = eventBusSpy.mock.calls[0][0]
          expect(events).toHaveLength(2)
          expect(events).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                data: { id: "1" },
                name: UserEvents.INVITE_UPDATED,
              }),
              expect.objectContaining({
                data: { id: "1" },
                name: UserEvents.INVITE_TOKEN_GENERATED,
              }),
            ])
          )
        })
      })

      describe("resendInvite", () => {
        it("should emit token generated event for invites", async () => {
          await service.createInvites(defaultInviteData)

          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
          eventBusSpy.mockClear()

          await service.refreshInviteTokens(["1"])

          const events = eventBusSpy.mock.calls[0][0]
          expect(events).toHaveLength(2)
          expect(events).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                name: UserEvents.INVITE_UPDATED,
                data: { id: "1" },
              }),
              expect.objectContaining({
                name: UserEvents.INVITE_TOKEN_GENERATED,
                data: { id: "1" },
              }),
            ])
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

          // 4 events: 2 invites created, 2 invite token generated
          const events = eventBusSpy.mock.calls[0][0]
          expect(events).toHaveLength(3)

          expect(events).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                data: { id: "1" },
                name: UserEvents.INVITE_CREATED,
              }),
              expect.objectContaining({
                data: { id: "2" },
                name: UserEvents.INVITE_CREATED,
              }),
              expect.objectContaining({
                data: { id: ["1", "2"] },
                name: UserEvents.INVITE_TOKEN_GENERATED,
              }),
            ])
          )
        })
      })
    })
  },
})
