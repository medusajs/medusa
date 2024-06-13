import formatConnectionString from "../format-connection-string.js"

const CONNECTION_STRING_REGEX = /(postgresql|postgres):\/\/([^:@\s]*(?::[^@\s]*)?@)?(?<server>[^\/\?\s]+)\b/

describe("format-connection-string", () => {
  it("should format string correctly", () => {
    const connectionString = formatConnectionString({
      user: "postgres",
      password: "postgres",
      host: "localhost",
      db: "medusa"
    })

    expect(connectionString).toMatch(CONNECTION_STRING_REGEX)
  })

  it("should format string correctly with symbols", () => {
    const connectionString = formatConnectionString({
      user: "postgres",
      password: "%123",
      host: "localhost",
      db: "medusa"
    })

    expect(connectionString).toMatch(CONNECTION_STRING_REGEX)
  })
})