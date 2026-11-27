import { defineConfig } from "@medusajs/deps/mikro-orm/postgresql"
import { mikroOrmCreateConnection } from "../mikro-orm-create-connection"

jest.mock("@medusajs/deps/mikro-orm/postgresql", () => ({
  defineConfig: jest.fn((config: any) => config),
  MikroORM: {
    init: jest.fn(async () => ({
      em: {
        getConnection: () => ({
          getKnex: () => ({ client: { connectionSettings: {} } }),
        }),
      },
    })),
  },
}))

const defineConfigMock = defineConfig as unknown as jest.Mock

const clientUrl = "postgres://user:urlpassword@localhost:5432/medusa"

function lastDefineConfigCall(): Record<string, any> {
  return defineConfigMock.mock.calls[0][0]
}

describe("mikroOrmCreateConnection", function () {
  beforeEach(() => {
    defineConfigMock.mockClear()
  })

  describe("when driverOptions.dynamicPassword is not set", function () {
    it("should pass the driver options through and not set a password", async function () {
      const driverOptions = { connection: { ssl: false } }

      await mikroOrmCreateConnection(
        { clientUrl, driverOptions } as any,
        [],
        "migrations"
      )

      const config = lastDefineConfigCall()
      expect(config.driverOptions).toBe(driverOptions)
      expect(config).not.toHaveProperty("password")
    })
  })

  describe("when driverOptions.dynamicPassword is set", function () {
    const dynamicPassword = jest.fn(() => "fresh-token")

    it("should pass the password function to MikroORM instead of the driver options", async function () {
      await mikroOrmCreateConnection(
        { clientUrl, driverOptions: { dynamicPassword } } as any,
        [],
        "migrations"
      )

      const config = lastDefineConfigCall()
      expect(config.password).toBe(dynamicPassword)
      expect(config.driverOptions).not.toHaveProperty("dynamicPassword")
      expect(config.clientUrl).toBe(clientUrl)
    })
  })

  describe("when an existing connection is reused", function () {
    it("should fall back to the database client url when the shared pool has no connection string", async function () {
      const sharedConnection = {
        context: {
          client: {
            config: {
              connection: {
                host: "localhost",
                port: 5432,
                user: "user",
                database: "medusa",
                password: jest.fn(() => "fresh-token"),
              },
              searchPath: "public",
            },
          },
        },
      }

      await mikroOrmCreateConnection(
        { clientUrl, connection: sharedConnection } as any,
        [],
        "migrations"
      )

      const config = lastDefineConfigCall()
      expect(config.clientUrl).toBe(clientUrl)
      expect(config.dbName).toBe("medusa")
      expect(config.driverOptions).toBe(sharedConnection)
    })

    it("should use the shared connection string when the pool has one", async function () {
      const sharedConnection = {
        context: {
          client: {
            config: {
              connection: { connectionString: clientUrl },
              searchPath: "public",
            },
          },
        },
      }

      await mikroOrmCreateConnection(
        { clientUrl, connection: sharedConnection } as any,
        [],
        "migrations"
      )

      const config = lastDefineConfigCall()
      expect(config.clientUrl).toBe(clientUrl)
      expect(config).not.toHaveProperty("dbName")
    })
  })
})
