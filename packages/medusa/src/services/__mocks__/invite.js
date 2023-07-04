export const InviteServiceMock = {
  withTransaction: function () {
    return this
  },

  list: jest.fn().mockImplementation((selector, config) => {
    return Promise.resolve({})
  }),

  create: jest.fn().mockImplementation(data => {
    return Promise.resolve({})
  }),

  accept: jest.fn().mockImplementation((token, user_id) => {
    return Promise.resolve({})
  }),

  resend: jest.fn().mockImplementation((id, inviter) => {
    return Promise.resolve({})
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return InviteServiceMock
})

export default mock
