import { MikroORM } from "@medusajs/deps/mikro-orm/postgresql"

import { mikroOrmCreateConnection } from "../mikro-orm-create-connection"

jest.mock("@medusajs/deps/mikro-orm/postgresql", () => {
  const actual = jest.requireActual("@medusajs/deps/mikro-orm/postgresql")
  return {
    ...actual,
    MikroORM: {
      ...actual.MikroORM,
      init: jest.fn().mockResolvedValue({ __orm: true }),
    },
  }
})

describe("mikroOrmCreateConnection", () => {
  const baseDatabase = {
    clientUrl: "postgres://iam_user@db.example.com:5433/medusa-db",
    schema: "public",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("forwards dynamicPassword as connection.password so MikroORM uses it per connection", async () => {
    const dynamicPassword = async () => "generated-token"

    await mikroOrmCreateConnection(
      {
        ...baseDatabase,
        driverOptions: { dynamicPassword },
      },
      [],
      "migrations"
    )

    const config = (MikroORM.init as jest.Mock).mock.calls[0][0]
    const driverOptions = config.driverOptions

    // MikroORM's AbstractSqlConnection.getKnexOptions only wraps a password
    // function that lives at driverOptions.connection.password
    expect(typeof driverOptions.connection?.password).toBe("function")

    const resolved = await driverOptions.connection.password()
    expect(resolved).toBe("generated-token")
  })

  it("does not leave a raw dynamicPassword key on driverOptions", async () => {
    await mikroOrmCreateConnection(
      {
        ...baseDatabase,
        driverOptions: { dynamicPassword: async () => "generated-token" },
      },
      [],
      "migrations"
    )

    const config = (MikroORM.init as jest.Mock).mock.calls[0][0]

    expect(config.driverOptions.dynamicPassword).toBeUndefined()
  })

  it("keeps working without dynamicPassword", async () => {
    await mikroOrmCreateConnection(
      {
        ...baseDatabase,
        driverOptions: { connection: { ssl: false } },
      },
      [],
      "migrations"
    )

    const config = (MikroORM.init as jest.Mock).mock.calls[0][0]

    expect(config.driverOptions.connection).toEqual({ ssl: false })
  })

  it("does not mutate when no driverOptions are provided", async () => {
    await mikroOrmCreateConnection(baseDatabase, [], "migrations")

    const config = (MikroORM.init as jest.Mock).mock.calls[0][0]

    expect(config.driverOptions).toEqual({ connection: { ssl: false } })
  })
})
