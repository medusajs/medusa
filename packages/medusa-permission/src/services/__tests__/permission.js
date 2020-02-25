import mongoose from "mongoose"
import { IdMap } from "medusa-test-utils"
import PermissionService from "../permission"
import {
  PermissionModelMock,
  permissions,
} from "../../models/__mocks__/permission"

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

  describe("getPermissions", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const permissionService = new PermissionService({
        permissionModel: PermissionModelMock,
      })

      result = await permissionService.getPermissions("product_editor")
    })

    it("calls permission model functions", () => {
      expect(PermissionModelMock.findOne).toHaveBeenCalledTimes(1)
    })

    it("successfully fetches product editor permissions", () => {
      expect(result).toEqual(permissions.productEditorPermission)
    })
  })

  describe("createPermissions", () => {
    beforeAll(async () => {
      jest.clearAllMocks()
      const permissionService = new PermissionService({
        permissionModel: PermissionModelMock,
      })

      const contentEditorActions = [
        {
          method: "POST",
          route: "/contents",
        },
        {
          method: "GET",
          route: "/contents",
        },
        {
          method: "PUT",
          route: "/contents",
        },
      ]

      await permissionService.createPermissions(
        "content_editor",
        contentEditorActions
      )
    })

    it("calls permission model functions", () => {
      expect(PermissionModelMock.create).toHaveBeenCalledTimes(1)
      expect(PermissionModelMock.create).toHaveBeenCalledWith({
        role: "content_editor",
        actions: [
          {
            method: "POST",
            route: "/contents",
          },
          {
            method: "GET",
            route: "/contents",
          },
          {
            method: "PUT",
            route: "/contents",
          },
        ],
      })
    })
  })

  describe("grantPermissions", () => {
    beforeAll(async () => {
      jest.clearAllMocks()
      const setMetadataMock = jest.fn().mockReturnValue(Promise.resolve())
      const permissionService = new PermissionService({
        permissionModel: PermissionModelMock,
        userService: {
          setMetadata: setMetadataMock
        }
      })

      await permissionService.grantPersissionRole(
        IdMap.getId("permission-user"),
        "product_editor"
      )
    })

    it("calls permission model functions", () => {
      expect(PermissionModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(PermissionModelMock.create).toHaveBeenCalledWith({
        ""
      })

      expect(setMetadataMock).toHaveBeenCalledTimes(1)
    })
  })
})
