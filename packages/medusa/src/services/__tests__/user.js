import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import UserService from "../user"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function() {
    return this
  },
}

describe("UserService", () => {
  describe("retrieve", () => {
    const userRepository = MockRepository({
      findOne: () => Promise.resolve({ id: IdMap.getId("ironman") }),
    })
    const userService = new UserService({
      manager: MockManager,
      userRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully retrieves a user", async () => {
      const result = await userService.retrieve(IdMap.getId("ironman"))

      expect(userRepository.findOne).toHaveBeenCalledTimes(1)
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("ironman") },
      })

      expect(result.id).toEqual(IdMap.getId("ironman"))
    })
  })

  describe("create", () => {
    const userRepository = MockRepository({
      create: (any) => Promise.resolve({ id: IdMap.getId("ironman") }),
      save: (any) => Promise.resolve({ id: IdMap.getId("ironman") }),
    })

    const userService = new UserService({
      manager: MockManager,
      userRepository,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully create a user", async () => {
      await userService.create(
        {
          email: "oliver@test.dk",
          name: "Oliver",
          password_hash: "hashedpassword",
        },
        "password"
      )

      expect(userRepository.create).toHaveBeenCalledTimes(1)
      expect(userRepository.create).toHaveBeenCalledWith({
        email: "oliver@test.dk",
        name: "Oliver",
        password_hash: expect.stringMatching(/.{128}$/),
      })

      expect(eventBusService.emit).toHaveBeenCalledWith(
        UserService.Events.CREATED,
        {
          id: expect.any(String),
        }
      )
    })
  })

  describe("update", () => {
    const userRepository = MockRepository({
      findOne: () => Promise.resolve({ id: IdMap.getId("ironman") }),
    })
    const userService = new UserService({
      manager: MockManager,
      userRepository,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully updates user", async () => {
      await userService.update(IdMap.getId("ironman"), {
        first_name: "Tony",
        last_name: "Stark",
      })

      expect(userRepository.save).toBeCalledTimes(1)
      expect(userRepository.save).toBeCalledWith({
        id: IdMap.getId("ironman"),
        first_name: "Tony",
        last_name: "Stark",
      })

      expect(eventBusService.emit).toHaveBeenCalledWith(
        UserService.Events.UPDATED,
        {
          id: IdMap.getId("ironman"),
        }
      )
    })

    it("successfully updates user metadata", async () => {
      await userService.update(IdMap.getId("ironman"), {
        metadata: {
          company: "Stark Industries",
        },
      })

      expect(userRepository.save).toBeCalledTimes(1)
      expect(userRepository.save).toBeCalledWith({
        id: IdMap.getId("ironman"),
        metadata: {
          company: "Stark Industries",
        },
      })

      expect(eventBusService.emit).toHaveBeenCalledWith(
        UserService.Events.UPDATED,
        {
          id: IdMap.getId("ironman"),
        }
      )
    })

    it("fails on email update", async () => {
      try {
        await userService.update(IdMap.getId("ironman"), {
          email: "tony@stark.com",
        })
      } catch (error) {
        expect(error.message).toBe("You are not allowed to update email")
      }
    })

    it("fails on password update", async () => {
      try {
        await userService.update(IdMap.getId("ironman"), {
          password_hash: "lol",
        })
      } catch (error) {
        expect(error.message).toBe(
          "Use dedicated methods, `setPassword`, `generateResetPasswordToken` for password operations"
        )
      }
    })
  })

  describe("generateResetPasswordToken", () => {
    const userRepository = MockRepository({
      findOne: () =>
        Promise.resolve({ id: IdMap.getId("ironman"), password_hash: "lol" }),
    })

    const userService = new UserService({
      manager: MockManager,
      userRepository,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("generates a token successfully", async () => {
      const token = await userService.generateResetPasswordToken(
        IdMap.getId("ironman")
      )

      expect(token).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
      )
    })
  })
})
