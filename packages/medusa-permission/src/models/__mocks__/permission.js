import { IdMap } from "medusa-test-utils"

const permissions = {
  productEditorPermission: {
    role: "product_editor",
    actions: [
      {
        method: "POST",
        route: "/products",
      },
    ],
  },
}

export const PermissionModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    return Promise.resolve(permissions.productEditorPermission)
  }),
}
