import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { IdMap } from "medusa-test-utils"
import UserService from "../user"
import { UserModelMock, users } from "../../models/__mocks__/user"
import { EventBusServiceMock } from "../__mocks__/event-bus"

describe("UserService", () => {
  describe("retrieve", () => {
    let result

    beforeAll(async () => {
      jest.clearAllMocks()
      const userService = new UserService({
        userModel: UserModelMock,
      })
      result = await userService.retrieve(IdMap.getId("test-user"))
    })

    it("calls user model functions", () => {
      expect(UserModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(UserModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("test-user"),
      })
    })

    it("returns the user", () => {
      expect(result).toEqual(users.testUser)
    })
  })

  describe("create", () => {
    let result

    const userService = new UserService({
      userModel: UserModelMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls user model functions", async () => {
      result = await userService.create(
        {
          email: "oliver@test.dk",
          name: "Oliver",
          password_hash: "hashedpassword",
        },
        "password"
      )
      expect(UserModelMock.create).toHaveBeenCalledTimes(1)
      expect(UserModelMock.create).toHaveBeenCalledWith({
        email: "oliver@test.dk",
        name: "Oliver",
        password_hash: expect.stringMatching(/.{128}$/),
      })
    })
  })

  describe("update", () => {
    const userService = new UserService({
      userModel: UserModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      await userService.update(IdMap.getId("test-user"), {
        name: "new name",
      })

      expect(UserModelMock.updateOne).toBeCalledTimes(1)
      expect(UserModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("test-user") },
        { $set: { name: "new name" } },
        { runValidators: true }
      )
    })
  })

  describe("setMetadata", () => {
    const userService = new UserService({
      userModel: UserModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = mongoose.Types.ObjectId()
      await userService.setMetadata(`${id}`, "metadata", "testMetadata")

      expect(UserModelMock.updateOne).toBeCalledTimes(1)
      expect(UserModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { "metadata.metadata": "testMetadata" } }
      )
    })

    it("throw error on invalid key type", async () => {
      const id = mongoose.Types.ObjectId()

      try {
        await userService.setMetadata(`${id}`, 1234, "nono")
      } catch (err) {
        expect(err.message).toEqual(
          "Key type is invalid. Metadata keys must be strings"
        )
      }
    })
  })

  describe("setPassword", () => {
    const userService = new UserService({
      userModel: UserModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      await userService.setPassword(IdMap.getId("test-user"), "123456789")
      expect(UserModelMock.updateOne).toBeCalledTimes(1)
      expect(UserModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("test-user") },
        {
          $set: {
            // Since bcrypt hashing always varies, we are testing the password
            // match by using a regular expression.
            password_hash: expect.stringMatching(/^.{128}$/),
          },
        }
      )
    })
  })

  describe("generateResetPasswordToken", () => {
    const userService = new UserService({
      eventBusService: EventBusServiceMock,
      userModel: UserModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("generates a token successfully", async () => {
      const token = await userService.generateResetPasswordToken(
        IdMap.getId("test-user")
      )

      expect(token).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
      )
    })
  })
})
