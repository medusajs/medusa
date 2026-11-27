import { Client } from "@medusajs/deps/pg"
import { createPgConnection } from "../create-pg-connection"

const clientUrlWithPassword =
  "postgres://user:urlpassword@localhost:5432/medusa"
const clientUrlWithoutPassword = "postgres://user@localhost:5432/medusa"

function connectionSettingsOf(
  options: Parameters<typeof createPgConnection>[0]
): Record<string, any> {
  const connection = createPgConnection(options)
  return (connection.client as any).connectionSettings
}

function effectivePgPassword(settings: Record<string, any>) {
  return (new Client(settings as any) as any).connectionParameters.password
}

describe("createPgConnection", function () {
  describe("when driverOptions.dynamicPassword is not set", function () {
    it("should pass the client url as a connection string", function () {
      const settings = connectionSettingsOf({
        clientUrl: clientUrlWithPassword,
        driverOptions: { connection: { ssl: false } },
      })

      expect(settings).toEqual(
        expect.objectContaining({ connectionString: clientUrlWithPassword })
      )
      expect(settings).not.toHaveProperty("password")
    })
  })

  describe("when driverOptions.dynamicPassword is set", function () {
    const dynamicPassword = jest.fn(() => "fresh-token")

    it("should keep the password function when the client url contains a password", function () {
      const settings = connectionSettingsOf({
        clientUrl: clientUrlWithPassword,
        driverOptions: { dynamicPassword },
      })

      expect(settings).not.toHaveProperty("connectionString")
      expect(settings.password).toBe(dynamicPassword)

      // pg replaces an explicit password with the one parsed from
      // connectionString, which would silently drop the function
      expect(effectivePgPassword(settings)).toBe(dynamicPassword)
    })

    it("should keep the password function when the client url has no password", function () {
      const settings = connectionSettingsOf({
        clientUrl: clientUrlWithoutPassword,
        driverOptions: { dynamicPassword },
      })

      expect(settings).not.toHaveProperty("connectionString")
      expect(effectivePgPassword(settings)).toBe(dynamicPassword)
    })

    it("should pass the remaining client url details as discrete fields", function () {
      const settings = connectionSettingsOf({
        clientUrl: clientUrlWithPassword,
        driverOptions: { dynamicPassword },
      })

      expect(settings).toEqual(
        expect.objectContaining({
          host: "localhost",
          port: 5432,
          user: "user",
          database: "medusa",
        })
      )
    })

    it("should only set the password when no client url is provided", function () {
      const settings = connectionSettingsOf({
        driverOptions: { dynamicPassword },
      })

      expect(settings.password).toBe(dynamicPassword)
      expect(settings).not.toHaveProperty("connectionString")
      expect(settings).not.toHaveProperty("host")
    })
  })
})
