import InviteService from "../invite"
import { MockManager, MockRepository, IdMap } from "medusa-test-utils"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import { MedusaError } from "medusa-core-utils"

describe("InviteService", () => {
  describe("list", () => {
    const inviteRepo = MockRepository({
      find: q => {
        return Promise.resolve([{ id: "invite-test-id" }])
      },
    })

    const inviteService = new InviteService({
      manager: MockManager,
      userService: {},
      userRepository: {},
      inviteRepository: inviteRepo,
      eventBusService: EventBusServiceMock,
    })

    it("calls invite repository find", async () => {
      const result = await inviteService.list({ id: "test" })

      expect(inviteRepo.find).toHaveBeenCalledTimes(1)
      expect(inviteRepo.find).toHaveBeenCalledWith({
        where: {
          id: "test",
        },
      })
    })
  })

  describe("token generation and validation", () => {
    const inviteService = new InviteService({
      manager: MockManager,
      userService: {},
      userRepository: {},
      inviteRepository: {},
      eventBusService: EventBusServiceMock,
    })

    it("validating a signed token succeeds", () => {
      const res = inviteService.verifyToken(
        inviteService.generateToken({ data: "test" })
      )

      expect(res).toEqual(expect.objectContaining({ data: "test" }))
    })
  })

  describe("create", () => {
    const a = {}
  })

  describe("accept", () => {
    const inviteRepo = MockRepository({
      findOne: q => {
        if (q.where.id === "accepted") {
          return Promise.resolve({
            accepted: true,
          })
        }
        return Promise.resolve({
          id: q.where.id,
          role: "admin",
          user_email: "test@test.com",
        })
      },
    })

    const userRepo = MockRepository({
      findOne: q => {
        if (q.where.user_id === "test_user") {
          return Promise.resolve({})
        }
        return Promise.resolve(null)
      },
    })

    const createMock = {
      create: jest.fn().mockImplementation(data => {
        return Promise.resolve({ ...data, email: "test@test.com" })
      }),
    }

    const userServiceMock = {
      withTransaction: jest.fn().mockImplementation(m => {
        return createMock
      }),
    }

    const inviteService = new InviteService({
      manager: MockManager,
      userService: userServiceMock,
      userRepository: userRepo,
      inviteRepository: inviteRepo,
      eventBusService: EventBusServiceMock,
    })

    it("fails to accept an invite already accepted", async () => {
      expect.assertions(1)
      await inviteService
        .accept(inviteService.generateToken({ invite_id: "accepted" }), {})
        .catch(err => {
          expect(err).toEqual(
            new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "Invite already accepted"
            )
          )
        })
    })

    it("fails to accept an with an invalid token", async () => {
      expect.assertions(2)
      await inviteService.accept("totally.valid.token", {}).catch(err => {
        expect(err.message).toEqual("invalid token")
        expect(err.name).toEqual("JsonWebTokenError")
      })
    })

    it("fails to accept an with an existing user", async () => {
      expect.assertions(1)
      await inviteService
        .accept(
          inviteService.generateToken({ invite_id: "not yet accepted" }),
          { id: "test_user" }
        )
        .catch(err => {
          expect(err).toEqual(
            new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "User already joined"
            )
          )
        })
    })
    it("accepts an invite", async () => {
      await inviteService.accept(
        inviteService.generateToken({ invite_id: "not yet accepted" }),
        { id: "test_id" }
      )
      expect(createMock.create).toHaveBeenCalledTimes(1)
      expect(createMock.create).toHaveBeenCalledWith({
        role: "admin",
        user_id: "test_id",
      })

      expect(inviteRepo.save).toHaveBeenCalledTimes(1)
      expect(inviteRepo.save).toHaveBeenCalledWith({
        id: "not yet accepted",
        role: "admin",
        user_email: "test@test.com",
        accepted: true,
      })
    })
  })

  describe("resend", () => {
    const inviteRepo = MockRepository({
      findOne: q => {
        return Promise.resolve({
          id: q.id,
          role: "admin",
          user_email: "test@test.com",
        })
      },
    })

    const inviteService = new InviteService({
      manager: MockManager,
      userService: {},
      userRepository: {},
      inviteRepository: inviteRepo,
      eventBusService: EventBusServiceMock,
    })

    inviteService.generateToken = jest.fn()

    it("generates a token with the retreived invite", async () => {
      await inviteService.resend("invite-test-id")

      expect(inviteRepo.findOne).toHaveBeenCalledTimes(1)
      expect(inviteService.generateToken).toHaveBeenCalledTimes(1)
      expect(inviteService.generateToken).toHaveBeenCalledWith({
        invite_id: "invite-test-id",
        role: "admin",
        user_email: "test@test.com",
      })
    })
  })
})
