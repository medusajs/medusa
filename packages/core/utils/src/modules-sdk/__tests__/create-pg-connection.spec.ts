import { createPgConnection } from "../create-pg-connection"

describe("createPgConnection", () => {
  describe("static connection (no dynamicPassword)", () => {
    it("keeps passing connectionString when dynamicPassword is absent", () => {
      const knex = createPgConnection({
        clientUrl: "postgres://user:secret@db.example.com:5433/medusa-db",
        driverOptions: {
          ssl: { rejectUnauthorized: false },
        },
      })

      const connection = knex.client.config.connection

      expect(connection.connectionString).toBe(
        "postgres://user:secret@db.example.com:5433/medusa-db"
      )
      expect(connection).not.toHaveProperty("host")
    })
  })

  describe("dynamic password", () => {
    const clientUrl = "postgres://iam_user@db.example.com:5433/medusa-db"
    const dynamicPassword = async () => "generated-token"

    it("does not pass connectionString together with a password", () => {
      const knex = createPgConnection({
        clientUrl,
        driverOptions: { dynamicPassword },
      })

      const connection = knex.client.config.connection

      // pg's ConnectionParameters overrides every other field with the parsed
      // connectionString, so a function password passed alongside it can never
      // survive. The connection must therefore be provided without one.
      expect(connection).not.toHaveProperty("connectionString")
    })

    it("provides connection as an async provider resolving discrete fields", async () => {
      const knex = createPgConnection({
        clientUrl,
        driverOptions: { dynamicPassword },
      })

      const provider = knex.client.config.connection
      expect(provider).toBeInstanceOf(Function)

      const resolved = await provider()
      expect(resolved).toMatchObject({
        host: "db.example.com",
        port: "5433",
        user: "iam_user",
        database: "medusa-db",
      })
    })

    it("invokes the dynamic password on each provider call", async () => {
      const password = jest.fn().mockResolvedValue("token-1")
      const knex = createPgConnection({
        clientUrl,
        driverOptions: { dynamicPassword: password },
      })

      await knex.client.config.connection()
      await knex.client.config.connection()

      expect(password).toHaveBeenCalledTimes(2)
      void knex.destroy()
    })

    it("preserves ssl and timeout options on the resolved connection", async () => {
      const knex = createPgConnection({
        clientUrl,
        driverOptions: {
          dynamicPassword,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 1234,
        },
      })

      const resolved = await knex.client.config.connection()

      expect(resolved.ssl).toEqual({ rejectUnauthorized: false })
      expect(resolved.connectionTimeoutMillis).toBe(1234)
      void knex.destroy()
    })

    it("propagates provider errors so pool creation fails loudly", async () => {
      const knex = createPgConnection({
        clientUrl,
        driverOptions: {
          dynamicPassword: async () => {
            throw new Error("token service down")
          },
        },
      })

      await expect(knex.client.config.connection()).rejects.toThrow(
        "token service down"
      )
      void knex.destroy()
    })
  })
})
