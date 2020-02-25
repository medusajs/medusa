import { IdMap } from "medusa-test-utils"

export const permissions = {
  productEditorPermission: {
    role: "product_editor",
    actions: [
      {
        method: "POST",
        route: "/products",
      },
      {
        method: "GET",
        route: "/products",
      },
      {
        method: "PUT",
        route: "/products",
      },
    ],
  },
}

export const RoleModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query.name === "product_editor") {
      return Promise.resolve(permissions.productEditorPermission)
    }
    return Promise.resolve(undefined)
  }),
}
