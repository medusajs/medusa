import { IdMap } from "medusa-test-utils"

export const permissions = {
  productEditorPermission: {
    _id: IdMap.getId("product_editor"),
    name: "product_editor",
    permissions: [
      {
        method: "POST",
        endpoint: "/products",
      },
      {
        method: "GET",
        endpoint: "/products",
      },
      {
        method: "PUT",
        endpoint: "/products",
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
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
}
