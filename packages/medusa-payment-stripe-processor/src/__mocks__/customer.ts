import { IdMap } from "medusa-test-utils"

export const CustomerServiceMock = {
  withTransaction: function () {
    return this
  },
  retrieve: jest.fn().mockImplementation((id) => {
    if (id === IdMap.getId("lebron")) {
      return Promise.resolve({
        _id: IdMap.getId("lebron"),
        first_name: "LeBron",
        last_name: "James",
        email: "lebron@james.com",
        password_hash: "1234",
        metadata: {
          stripe_id: "cus_123456789_new",
        },
      })
    }
    if (id === IdMap.getId("vvd")) {
      return Promise.resolve({
        _id: IdMap.getId("vvd"),
        first_name: "Virgil",
        last_name: "Van Dijk",
        email: "virg@vvd.com",
        password_hash: "1234",
        metadata: {},
      })
    }
    return Promise.resolve(undefined)
  }),
  setMetadata: jest.fn().mockReturnValue(Promise.resolve()),
}

const mock = jest.fn().mockImplementation(() => {
  return CustomerServiceMock
})

export default mock
