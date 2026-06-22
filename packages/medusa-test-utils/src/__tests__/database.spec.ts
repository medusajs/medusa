import { getDatabaseURL } from "../database"

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
