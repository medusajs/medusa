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
    const permissionService = new PermissionService({
      roleModel: RoleModelMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
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

    it("succesfully denies access to user", async () => {
      const accessDenied = await permissionService.hasPermission(
        user,
        "CREATE",
        "/orders"
      )
      expect(accessDenied).toEqual(false)
    })
  })

  describe("retrieveRole", () => {
    let result
    const permissionService = new PermissionService({
      roleModel: RoleModelMock,
    })
    beforeAll(async () => {
      jest.clearAllMocks()

      result = await permissionService.retrieveRole("product_editor")
    })

    it("calls permission model functions", () => {
      expect(RoleModelMock.findOne).toHaveBeenCalledTimes(1)
    })

    it("successfully fetches product editor permissions", () => {
      expect(result).toEqual(permissions.productEditorPermission)
    })

    it("throws if role with name does not exist", async () => {
      try {
        await permissionService.retrieveRole("product_editor")
      } catch (error) {
        expect(error.message).toEqual(
          "test_editor does not exist. Use method createRole to create it."
        )
      }
    })
  })

  describe("createRole", () => {
    const permissionService = new PermissionService({
      roleModel: RoleModelMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()

      const contentEditorPermissions = [
        {
          method: "POST",
          endpoint: "/contents",
        },
        {
          method: "GET",
          endpoint: "/contents",
        },
        {
          method: "PUT",
          endpoint: "/contents",
        },
      ]

      await permissionService.createRole(
        "content_editor",
        contentEditorPermissions
      )
    })

    it("calls permission model functions", () => {
      expect(RoleModelMock.create).toHaveBeenCalledTimes(1)
      expect(RoleModelMock.create).toHaveBeenCalledWith({
        name: "content_editor",
        permissions: [
          {
            method: "POST",
            endpoint: "/contents",
          },
          {
            method: "GET",
            endpoint: "/contents",
          },
          {
            method: "PUT",
            endpoint: "/contents",
          },
        ],
      })
    })

    it("throws if any permission is invalid", async () => {
      try {
        await permissionService.createRole("content_editor", [
          {
            method: "POST",
            endpoint: "/products",
          },
          {
            // Should fail since this is not a valid http request
            method: "FETCH",
            endpoint: "/products",
          },
        ])
      } catch (err) {
        expect(err.message).toEqual("Permission is not valid")
      }
    })

    it("throws if role with name already exists", async () => {
      try {
        await permissionService.createRole("product_editor", [
          {
            method: "POST",
            endpoint: "/order",
          },
        ])
      } catch (err) {
        expect(err.message).toEqual("product_editor already exists")
      }
    })
  })

  describe("grantRole", () => {
    const setMetadataMock = jest.fn().mockReturnValue(Promise.resolve())
    const userRetrieveMock = jest.fn().mockImplementation((data) => {
      if (data === IdMap.getId("permission-user")) {
        return Promise.resolve({
          _id: IdMap.getId("permission-user"),
          email: "oliver@test.dk",
          metadata: {
            roles: ["content_editor"],
          },
        })
      }
      if (data === IdMap.getId("user-without-roles")) {
        return Promise.resolve({
          _id: IdMap.getId("user-without-roles"),
          email: "oliver@test.dk",
          metadata: {},
        })
      }
      return Promise.resolve(undefined)
    })
    const permissionService = new PermissionService({
      roleModel: RoleModelMock,
      userService: {
        setMetadata: setMetadataMock,
        retrieve: userRetrieveMock,
      },
    })

    beforeEach(async () => {
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
        "roles",
        ["content_editor", "product_editor"]
      )
    })

    it("sets user metadata.roles to user that does not have metadata.roles", async () => {
      await permissionService.grantRole(
        IdMap.getId("user-without-roles"),
        "product_editor"
      )

      expect(setMetadataMock).toHaveBeenCalledTimes(1)
      expect(setMetadataMock).toHaveBeenCalledWith(
        IdMap.getId("user-without-roles"),
        "roles",
        ["product_editor"]
      )
    })

    it("throws if user already has role", async () => {
      try {
        await permissionService.grantRole(
          IdMap.getId("permission-user"),
          "product_editor"
        )
      } catch (err) {
        expect(err.message).toEqual("User already has role: product_editor")
      }
    })
  })

  describe("addPermission", () => {
    const permissionService = new PermissionService({
      roleModel: RoleModelMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("successfully adds permission", async () => {
      const toAdd = {
        method: "POST",
        endpoint: "/products",
      }
      await permissionService.addPermission("product_editor", toAdd)

      expect(RoleModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(RoleModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("product_editor") },
        {
          $push: { permissions: { method: "POST", endpoint: "/products" } },
        }
      )
    })

    it("throws if permission is not valid", async () => {
      const toAdd = {
        method: "POST",
        endpoint: 1234,
      }

      try {
        await permissionService.addPermission("product_editor", toAdd)
      } catch (err) {
        expect(err.message).toEqual("Permission is not valid")
      }
    })
  })

  describe("removePermission", () => {
    const permissionService = new PermissionService({
      roleModel: RoleModelMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("successfully removes permission", async () => {
      const toRemove = {
        method: "POST",
        endpoint: "/products",
      }
      await permissionService.removePermission("product_editor", toRemove)

      expect(RoleModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(RoleModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("product_editor") },
        {
          $pull: { permissions: { method: "POST", endpoint: "/products" } },
        }
      )
    })

    it("throws if permission is not valid", async () => {
      const update = {
        method: "FETCH",
        endpoint: "/cart",
      }

      try {
        await permissionService.addPermission("product_editor", update)
      } catch (err) {
        expect(err.message).toEqual("Permission is not valid")
      }
    })
  })

  describe("revokeRole", () => {
    const setMetadataMock = jest.fn().mockReturnValue(Promise.resolve())
    const userRetrieveMock = jest.fn().mockReturnValue(
      Promise.resolve({
        _id: IdMap.getId("product_editor"),
        email: "oliver@test.dk",
        metadata: {
          roles: ["product_editor"],
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
    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully revokes a role from user", async () => {
      await permissionService.revokeRole(
        IdMap.getId("product_editor"),
        "product_editor"
      )

      expect(setMetadataMock).toHaveBeenCalledTimes(1)
      expect(setMetadataMock).toHaveBeenCalledWith(
        IdMap.getId("product_editor"),
        "roles",
        []
      )
    })

    it("succeeds idempotently if user does not have the role to delete", async () => {
      await permissionService.revokeRole(
        IdMap.getId("product_editor"),
        "content_editor"
      )

      expect(setMetadataMock).toHaveBeenCalledTimes(0)
    })
  })
})
