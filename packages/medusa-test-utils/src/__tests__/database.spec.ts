import { getDatabaseCredentials, getDatabaseURL } from "../database"

describe("getDatabaseCredentials", () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      DB_HOST: "first-host",
      DB_PORT: "5432",
      DB_USERNAME: "first-user",
      DB_PASSWORD: "first-password",
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it("reads credentials when called", () => {
    expect(getDatabaseCredentials()).toEqual({
      host: "first-host",
      port: 5432,
      user: "first-user",
      password: "first-password",
    })

    process.env.DB_HOST = "second-host"
    process.env.DB_USERNAME = "second-user"
    process.env.DB_PASSWORD = "second-password"
    process.env.DB_PORT = "6543"

    expect(getDatabaseCredentials()).toEqual({
      host: "second-host",
      port: 6543,
      user: "second-user",
      password: "second-password",
    })
  })
})

describe("getDatabaseURL", () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      DB_HOST: "localhost",
      DB_PORT: "5432",
      DB_TEMP_NAME: "test_db",
    }
    delete process.env.DB_USERNAME
    delete process.env.DB_PASSWORD
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it("should build a valid URL with plain credentials", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = "password"

    const url = getDatabaseURL()

    expect(url).toBe("postgres://postgres:password@localhost:5432/test_db")
    expect(() => new URL(url)).not.toThrow()
  })

  it("should encode a # in the password", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = "pass#word"

    const url = getDatabaseURL()

    expect(url).toBe("postgres://postgres:pass%23word@localhost:5432/test_db")
    expect(() => new URL(url)).not.toThrow()
    expect(decodeURIComponent(new URL(url).password)).toBe("pass#word")
  })

  it("should encode @ in the password", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = "pass@word"

    const url = getDatabaseURL()

    expect(() => new URL(url)).not.toThrow()
    expect(decodeURIComponent(new URL(url).password)).toBe("pass@word")
  })

  it("should encode : in the password", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = "pass:word"

    const url = getDatabaseURL()

    expect(() => new URL(url)).not.toThrow()
    expect(decodeURIComponent(new URL(url).password)).toBe("pass:word")
  })

  it("should encode / in the password", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = "pass/word"

    const url = getDatabaseURL()

    expect(() => new URL(url)).not.toThrow()
    expect(decodeURIComponent(new URL(url).password)).toBe("pass/word")
  })

  it("should omit the password segment when DB_PASSWORD is empty", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = ""

    const url = getDatabaseURL()

    expect(url).toBe("postgres://postgres@localhost:5432/test_db")
    expect(() => new URL(url)).not.toThrow()
  })

  it("should encode special characters in the username", () => {
    process.env.DB_USERNAME = "user@domain"
    process.env.DB_PASSWORD = ""

    const url = getDatabaseURL()

    expect(() => new URL(url)).not.toThrow()
    expect(decodeURIComponent(new URL(url).username)).toBe("user@domain")
  })

  it("should use the dbName argument when provided", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = ""

    const url = getDatabaseURL("my_custom_db")

    expect(url).toContain("/my_custom_db")
    expect(() => new URL(url)).not.toThrow()
  })
})
