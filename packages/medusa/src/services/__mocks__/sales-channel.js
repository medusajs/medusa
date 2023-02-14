import { IdMap } from "medusa-test-utils"

export const SalesChannelServiceMock = {
  withTransaction: function () {
    return this
  },

  retrieve: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve({
      id: id,
      name: "sales channel 1 name",
      description: "sales channel 1 description",
      is_disabled: false,
    })
  }),
  update: jest.fn().mockImplementation((id, data) => {
    return Promise.resolve({ id, ...data })
  }),

  listAndCount: jest.fn().mockImplementation(() => {
    return Promise.resolve([
      [
        {
          id: IdMap.getId("sales_channel_1"),
          name: "sales channel 1 name",
          description: "sales channel 1 description",
          is_disabled: false,
        },
      ],
      1,
    ])
  }),

  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve({
      id: id,
      ...data,
    })
  }),

  delete: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  createDefault: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      name: "sales channel 1 name",
      description: "sales channel 1 description",
      is_disabled: false,
    })
  }),

  retrieveDefault: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      name: "sales channel 1 name",
      description: "sales channel 1 description",
      is_disabled: false,
    })
  }),

  removeProducts: jest.fn().mockImplementation((id, productIds) => {
    return Promise.resolve()
  }),

  addProducts: jest.fn().mockImplementation((id, productIds) => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return SalesChannelServiceMock
})

export default mock
