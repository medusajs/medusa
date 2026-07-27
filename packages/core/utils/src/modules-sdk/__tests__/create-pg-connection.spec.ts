import { buildConnectionConfig } from "../build-connection-config"

describe("buildConnectionConfig", () => {
  const defaultArgs = {
    ssl: false,
    connectionTimeoutMillis: 5000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  }

  describe("static path (no dynamicPassword)", () => {
    it("returns connectionString when dynamicPassword is not provided", () => {
      const result = buildConnectionConfig(
        "postgres://user@localhost:5432/mydb",
        defaultArgs.ssl,
        {},
        defaultArgs.connectionTimeoutMillis,
        defaultArgs.keepAlive,
        defaultArgs.keepAliveInitialDelayMillis
      )

      expect(result).toHaveProperty("connectionString", "postgres://user@localhost:5432/mydb")
      expect(result).not.toHaveProperty("host")
      expect(result).not.toHaveProperty("port")
      expect(result).not.toHaveProperty("user")
      expect(result).not.toHaveProperty("database")
      expect(result).not.toHaveProperty("password")
    })

    it("preserves connectionString when driverOptions is undefined", () => {
      const result = buildConnectionConfig(
        "postgres://user:pass@db.example.com:5433/production",
        defaultArgs.ssl,
        undefined,
        defaultArgs.connectionTimeoutMillis,
        defaultArgs.keepAlive,
        defaultArgs.keepAliveInitialDelayMillis
      )

      expect(result).toHaveProperty(
        "connectionString",
        "postgres://user:pass@db.example.com:5433/production"
      )
    })

    it("includes shared config fields", () => {
      const result = buildConnectionConfig(
        "postgres://user@localhost:5432/mydb",
        { rejectUnauthorized: true },
        { idle_in_transaction_session_timeout: 30000 },
        5000,
        true,
        10000
      )

      expect(result).toMatchObject({
        ssl: { rejectUnauthorized: true },
        connectionTimeoutMillis: 5000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
        idle_in_transaction_session_timeout: 30000,
      })
    })
  })

  describe("dynamicPassword path (discrete fields)", () => {
    const passwordFn = async () => "dynamic-token"

    it("parses URL into discrete fields and includes password function", () => {
      const result = buildConnectionConfig(
        "postgres://myuser@db.internal:5432/medusa",
        defaultArgs.ssl,
        { dynamicPassword: passwordFn },
        defaultArgs.connectionTimeoutMillis,
        defaultArgs.keepAlive,
        defaultArgs.keepAliveInitialDelayMillis
      )

      expect(result).not.toHaveProperty("connectionString")
      expect(result).toMatchObject({
        host: "db.internal",
        port: 5432,
        user: "myuser",
        database: "medusa",
        password: passwordFn,
      })
    })

    it("handles non-standard port", () => {
      const result = buildConnectionConfig(
        "postgres://app@db.example.com:5433/hermes",
        defaultArgs.ssl,
        { dynamicPassword: passwordFn },
        defaultArgs.connectionTimeoutMillis,
        defaultArgs.keepAlive,
        defaultArgs.keepAliveInitialDelayMillis
      )

      expect(result).toMatchObject({
        host: "db.example.com",
        port: 5433,
        user: "app",
        database: "hermes",
      })
    })

    it("defaults port to 5432 when not specified in URL", () => {
      const result = buildConnectionConfig(
        "postgres://app@db.internal/medusa",
        defaultArgs.ssl,
        { dynamicPassword: passwordFn },
        defaultArgs.connectionTimeoutMillis,
        defaultArgs.keepAlive,
        defaultArgs.keepAliveInitialDelayMillis
      )

      expect(result).toMatchObject({
        host: "db.internal",
        port: 5432,
      })
    })

    it("decodes URL-encoded username", () => {
      const result = buildConnectionConfig(
        "postgres://my%40user@db.internal:5432/medusa",
        defaultArgs.ssl,
        { dynamicPassword: passwordFn },
        defaultArgs.connectionTimeoutMillis,
        defaultArgs.keepAlive,
        defaultArgs.keepAliveInitialDelayMillis
      )

      expect(result).toMatchObject({
        user: "my@user",
      })
    })

    it("includes shared config fields", () => {
      const result = buildConnectionConfig(
        "postgres://user@localhost:5432/mydb",
        { rejectUnauthorized: true },
        {
          dynamicPassword: passwordFn,
          idle_in_transaction_session_timeout: 30000,
          expirationChecker: () => true,
        },
        5000,
        true,
        10000
      )

      expect(result).toMatchObject({
        ssl: { rejectUnauthorized: true },
        connectionTimeoutMillis: 5000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
        idle_in_transaction_session_timeout: 30000,
      })
      expect(result).toHaveProperty("expirationChecker")
    })

    it("throws on undefined clientUrl", () => {
      expect(() =>
        buildConnectionConfig(
          undefined as any,
          defaultArgs.ssl,
          { dynamicPassword: passwordFn },
          defaultArgs.connectionTimeoutMillis,
          defaultArgs.keepAlive,
          defaultArgs.keepAliveInitialDelayMillis
        )
      ).toThrow()
    })

    it("throws on malformed URL", () => {
      expect(() =>
        buildConnectionConfig(
          "not-a-valid-url",
          defaultArgs.ssl,
          { dynamicPassword: passwordFn },
          defaultArgs.connectionTimeoutMillis,
          defaultArgs.keepAlive,
          defaultArgs.keepAliveInitialDelayMillis
        )
      ).toThrow()
    })
  })
})
