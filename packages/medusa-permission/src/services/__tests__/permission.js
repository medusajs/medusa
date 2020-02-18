import mongoose from "mongoose"
import { IdMap } from "medusa-test-utils"
import PermissionService from "../permission"
import { PermissionModelMock } from "../../models/__mocks__/permission"

describe("PermissionService", () => {
  describe("hasPermission", () => {
    let result
    let user = {
      _id: IdMap.getId("test-user"),
      email: "oliver@medusa.test",
      passwordHash: "123456789",
      metadata: {
        roles: ["product_editor"],
      },
    }

    beforeAll(async () => {
      jest.clearAllMocks()
      const permissionService = new PermissionService({
        permissionModel: PermissionModelMock,
      })

      result = await permissionService.hasPermission(user, "POST", "/products")
    })

    it("calls permission model functions", () => {
      expect(PermissionModelMock.findOne).toHaveBeenCalledTimes(
        user.metadata.roles.length
      )
    })

    it("successfully grants access to user", () => {
      expect(result).toEqual(true)
    })
  })
})
