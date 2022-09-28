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
  delete: jest.fn().mockImplementation(() => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return orderEditItemChangeServiceMock
})

export default mock
