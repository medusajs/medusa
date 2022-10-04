export const orderEditItemChangeServiceMock = {
  withTransaction: function () {
    return this
  },
  retrieveItemChangeByOrderEdit: jest
    .fn()
    .mockImplementation((itemChangeId, orderEditId) => {
      return Promise.resolve({
        id: itemChangeId,
        order_edit_id: orderEditId,
      })
    }),
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve(data)
  }),
  delete: jest.fn().mockImplementation(() => {
    return Promise.resolve()
  }),
  create: jest.fn().mockImplementation(() => {
    return Promise.resolve({})
  }),
  list: jest.fn().mockImplementation(() => {
    return Promise.resolve([])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return orderEditItemChangeServiceMock
})

export default mock
