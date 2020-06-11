export const SendGridMock = {
  send: jest.fn().mockReturnValue(Promise.resolve(202)),
}

// const SendGrid = jest.genMockFromModule("@sendgrid/mail")

const SendGrid = jest.fn(() => SendGridMock)

export default SendGrid
