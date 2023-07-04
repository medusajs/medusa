export const EventBusServiceMock = {
  emit: jest.fn(),
  subscribe: jest.fn(),
  withTransaction: function() {
    return this
  },
}

const mock = jest.fn().mockImplementation(() => {
  return EventBusServiceMock
})

export default mock
