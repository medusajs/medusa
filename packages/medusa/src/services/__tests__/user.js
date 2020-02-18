import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { IdMap } from "medusa-test-utils"
import UserService from "../user"
import { UserModelMock, users } from "../../models/__mocks__/user"

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

    it("calls cart model functions", () => {
      expect(UserModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(UserModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("test-user"),
      })
    })

    it("returns the user", () => {
      expect(result).toEqual(users.testUser)
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
    })
  })
})
