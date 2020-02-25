import mongoose from "mongoose"
import { IdMap } from "medusa-test-utils"
import PermissionService from "../permission"
import { permissions, RoleModelMock } from "../../models/__mocks__/role"

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
        roleModel: RoleModelMock,
      })

      result = await permissionService.hasPermission(user, "POST", "/products")
    })

    it("calls permission model functions", () => {
      expect(RoleModelMock.findOne).toHaveBeenCalledTimes(
        user.metadata.roles.length
      )
    })

    it("successfully grants access to user", () => {
      expect(result).toEqual(true)
    })
  })

  describe("retrieveRole", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const permissionService = new PermissionService({
        roleModel: RoleModelMock,
      })

      result = await permissionService.retrieveRole("product_editor")
    })

    it("calls permission model functions", () => {
      expect(RoleModelMock.findOne).toHaveBeenCalledTimes(1)
    })

    it("successfully fetches product editor permissions", () => {
      expect(result).toEqual(permissions.productEditorPermission)
    })
  })

  describe("createRole", () => {
    beforeAll(async () => {
      jest.clearAllMocks()
      const permissionService = new PermissionService({
        roleModel: RoleModelMock,
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

      await permissionService.createRole("content_editor", contentEditorActions)
    })

    it("calls permission model functions", () => {
      expect(RoleModelMock.create).toHaveBeenCalledTimes(1)
      expect(RoleModelMock.create).toHaveBeenCalledWith({
        name: "content_editor",
        permissions: [
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

  describe("grantRole", () => {
    const setMetadataMock = jest.fn().mockReturnValue(Promise.resolve())
    const userRetrieveMock = jest.fn().mockReturnValue(
      Promise.resolve({
        _id: IdMap.getId("permission-user"),
        email: "oliver@test.dk",
        metadata: {
          roles: ["content_editor"],
        },
      })
    )
    const permissionService = new PermissionService({
      roleModel: RoleModelMock,
      userService: {
        setMetadata: setMetadataMock,
        retrieve: userRetrieveMock,
      },
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("successfully grants role to user", async () => {
      await permissionService.grantRole(
        IdMap.getId("permission-user"),
        "product_editor"
      )

      expect(setMetadataMock).toHaveBeenCalledTimes(1)
      expect(setMetadataMock).toHaveBeenCalledWith(
        IdMap.getId("permission-user"),
        "product_editor"
      )
    })

    it("throws if user already has role", async () => {
      try {
        await permissionService.grantRole(
          IdMap.getId("permission-user"),
          "content_editor"
        )
      } catch (err) {
        expect(err.message).toEqual("User already has role: content_editor")
      }
    })
  })
})
