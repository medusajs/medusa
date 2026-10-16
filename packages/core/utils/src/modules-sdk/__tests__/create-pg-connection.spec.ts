import { Client } from "@medusajs/deps/pg"
import { createPgConnection } from "../create-pg-connection"

const dynamicPassword = async () => "token"
const knexInstances: ReturnType<typeof createPgConnection>[] = []

function connectionConfig(
  clientUrl?: string,
  driverOptions?: Record<string, unknown>
) {
  const knex = createPgConnection({ clientUrl, driverOptions })
  knexInstances.push(knex)
  return knex.client.config.connection
}

// pg's resolved settings; connectionParameters is missing from pg's types
function resolvedParameters(config: Record<string, unknown>) {
  return (new Client(config as any) as any).connectionParameters
}

describe("createPgConnection", () => {
  afterAll(async () => {
    await Promise.all(knexInstances.map((knex) => knex.destroy()))
  })

  it("passes the connection string through without dynamicPassword", () => {
    expect(connectionConfig("postgres://u:secret@db/medusa")).toEqual({
      connectionString: "postgres://u:secret@db/medusa",
      ssl: false,
      idle_in_transaction_session_timeout: undefined,
      connectionTimeoutMillis: 5000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    })
  })

  it.each([
    ["a URL without a password", "postgres://u@db/medusa", dynamicPassword],
    ["a URL with a password", "postgres://u:static@db/medusa", dynamicPassword],
    ["a synchronous function", "postgres://u@db/medusa", () => "token"],
    ["no URL", undefined, dynamicPassword],
  ])("gives pg the password function for %s", (_, clientUrl, password) => {
    const config = connectionConfig(clientUrl, { dynamicPassword: password })

    expect(config).not.toHaveProperty("connectionString")
    expect(new Client(config).password).toBe(password)
  })

  it("keeps the shared settings and drops expirationChecker", () => {
    const config = connectionConfig("postgres://u@db/medusa", {
      dynamicPassword,
      expirationChecker: () => true,
      idle_in_transaction_session_timeout: 30000,
      connection: { ssl: { ca: "ca" }, connectionTimeoutMillis: 2000 },
    })

    expect(config).toMatchObject({
      ssl: { ca: "ca" },
      idle_in_transaction_session_timeout: 30000,
      connectionTimeoutMillis: 2000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    })
    expect(config).not.toHaveProperty("expirationChecker")
  })

  it.each([
    ["a plain URL", "postgres://u@db:5432/medusa"],
    ["no port", "postgres://u@db/medusa"],
    ["a non-default port", "postgres://u@db:6543/medusa"],
    ["an encoded database", "postgres://u@db/my%20db"],
    ["an encoded user", "postgres://my%40u@db/medusa"],
    ["sslmode=require", "postgres://u@db/medusa?sslmode=require"],
    ["sslmode=no-verify", "postgres://u@db/medusa?sslmode=no-verify"],
    ["sslmode=disable", "postgres://u@db/medusa?sslmode=disable"],
    ["application_name", "postgres://u@db/medusa?application_name=medusa"],
    ["options", "postgres://u@db/medusa?options=-c%20search_path%3Dfoo"],
    ["a socket host", "postgres://u@/medusa?host=/var/run/postgresql"],
  ])("resolves the same settings as without it for %s", (_, url) => {
    for (const connection of [undefined, { ssl: { ca: "ca" } }]) {
      const withoutIt = connectionConfig(url, { connection })
      const withIt = connectionConfig(url, { connection, dynamicPassword })

      expect(resolvedParameters(withIt)).toEqual(resolvedParameters(withoutIt))
    }
  })
})
