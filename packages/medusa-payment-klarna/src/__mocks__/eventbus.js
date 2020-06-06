export const EventBusServiceMock = {
  emit: jest.fn(),
  subscribe: jest.fn(),
}

const mock = jest.fn().mockImplementation(() => {
  return EventBusServiceMock
})

export default mock
