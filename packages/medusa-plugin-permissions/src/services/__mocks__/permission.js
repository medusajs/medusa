import { IdMap } from "medusa-test-utils"

export const PermissionServiceMock = {
  hasPermission: jest.fn().mockImplementation((user, method, endpoint) => {
    if (user._id === IdMap.getId("test-user")) {
      return Promise.resolve(true)
    }
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return PermissionServiceMock
})

export default mock
