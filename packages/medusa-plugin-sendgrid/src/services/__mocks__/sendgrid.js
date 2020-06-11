export const SendGridServiceMock = {
  sendEmail: jest.fn().mockImplementation((event, order) => {
    if (event === "order.placed") {
      return Promise.resolve(202)
    }
    return Promise.resolve(undefined)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return SendGridServiceMock
})

export default mock
