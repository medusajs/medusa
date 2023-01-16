import InviteService from "../invite"
import { MockManager, MockRepository } from "medusa-test-utils"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import { MedusaError } from "medusa-core-utils"

// const _MockManager

describe("InviteService", () => {
  describe("list", () => {
    const inviteRepo = MockRepository({
      find: (q) => {
        return Promise.resolve([{ id: "invite-test-id" }])
      },
    })

    const inviteService = new InviteService({
      manager: { getCustomRepository: jest.fn(() => inviteRepo) },
      userService: {},
      userRepository: {},
      inviteRepository: inviteRepo,
      eventBusService: EventBusServiceMock,
    }, {
      projectConfig: { jwt_secret: 'superSecret' }
    })

    it("calls invite repository find", async () => {
      await inviteService.list({ id: "test" })

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
    }, {
      projectConfig: { jwt_secret: 'superSecret' }
    })

    it("validating a signed token succeeds", () => {
      const res = inviteService.verifyToken(
        inviteService.generateToken({ data: "test" })
      )

      expect(res).toEqual(expect.objectContaining({ data: "test" }))
    })
  })

  describe("accept", () => {
    const inviteRepo = MockRepository({
      findOne: (q) => {
        if (q.where.id === "accepted") {
          return Promise.resolve(null)
        }
        if (q.where.id === "existingUser") {
          return Promise.resolve({
            user_email: "existing@medusa-commerce.com",
            token: inviteService.generateToken({
              user_email: "existing@medusa-commerce.com",
              invite_id: "existingUser",
            }),
          })
        }
        return Promise.resolve({
          id: q.where.id,
          role: "admin",
          user_email: "test@test.com",
          token: inviteService.generateToken({
            user_email: "test@test.com",
            invite_id: q.where.id,
          }),
        })
      },
    })

    const userRepo = MockRepository({
      findOne: (q) => {
        if (q.where.user_id === "test_user") {
          return Promise.resolve({})
        }
        if (q.where.email === "existing@medusa-commerce.com") {
          return Promise.resolve("usr_test123")
        }
        return Promise.resolve(null)
      },
    })

    const createMock = {
      create: jest.fn().mockImplementation((data) => {
        return Promise.resolve({ ...data, email: "test@test.com" })
      }),
    }

    const userServiceMock = {
      withTransaction: jest.fn().mockImplementation((m) => {
        return createMock
      }),
    }

    const inviteService = new InviteService({
      manager: MockManager,
      userService: userServiceMock,
      userRepository: userRepo,
      inviteRepository: inviteRepo,
      eventBusService: EventBusServiceMock,
    }, {
      projectConfig: { jwt_secret: 'superSecret' }
    })

    beforeEach(() => jest.clearAllMocks())

    it("fails to accept an invite already accepted", async () => {
      expect.assertions(1)
      await inviteService
        .accept(
          inviteService.generateToken({
            user_email: "accepted@medusa-commerce.com",
            invite_id: "accepted",
          }),
          {}
        )
        .catch((err) => {
          expect(err).toEqual(
            new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid invite")
          )
        })
    })

    it("fails to accept an with an invalid token", async () => {
      expect.assertions(2)
      await inviteService.accept("totally.valid.token", {}).catch((err) => {
        expect(err.message).toEqual("Token is not valid")
        expect(err.type).toEqual("invalid_data")
      })
    })

    it("fails to accept an with an existing user", async () => {
      expect.assertions(1)
      await inviteService
        .accept(
          inviteService.generateToken({
            user_email: "existing@medusa-commerce.com",
            invite_id: "existingUser",
          }),
          {}
        )
        .catch((err) => {
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
        inviteService.generateToken({
          user_email: "test@test.com",
          invite_id: "not yet accepted",
        }),
        { first_name: "John", last_name: "Doe", password: "test stuff" }
      )
      expect(createMock.create).toHaveBeenCalledTimes(1)
      expect(createMock.create).toHaveBeenCalledWith(
        {
          email: "test@test.com",
          role: "admin",
          first_name: "John",
          last_name: "Doe",
        },
        "test stuff"
      )

      expect(inviteRepo.delete).toHaveBeenCalledTimes(1)
      expect(inviteRepo.delete).toHaveBeenCalledWith({
        id: "not yet accepted",
      })
    })
  })

  describe("resend", () => {
    const inviteRepo = MockRepository({
      findOne: (q) => {
        return Promise.resolve({
          id: q.id,
          role: "admin",
          user_email: "test@test.com",
        })
      },
    })

    const inviteService = new InviteService({
      manager: { getCustomRepository: jest.fn(() => inviteRepo) },
      userService: {},
      userRepository: {},
      inviteRepository: inviteRepo,
      eventBusService: EventBusServiceMock,
    }, {
      projectConfig: { jwt_secret: 'superSecret' }
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
