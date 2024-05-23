import { MedusaError } from "@medusajs/utils"
import Scrypt from "scrypt-kdf"
import { EmailPassAuthService } from "../../src/services/emailpass"
jest.setTimeout(100000)

describe("Email password auth provider", () => {
  let emailpassService: EmailPassAuthService

  beforeAll(() => {
    emailpassService = new EmailPassAuthService(
      {
        logger: console as any,
      },
      {}
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("return error if email is not passed", async () => {
    const resp = await emailpassService.authenticate(
      { body: { password: "otherpass" } },
      {}
    )

    expect(resp).toEqual({
      error: "Email should be a string",
      success: false,
    })
  })

  it("return error if password is not passed", async () => {
    const resp = await emailpassService.authenticate(
      { body: { email: "test@admin.com" } },
      {}
    )

    expect(resp).toEqual({
      error: "Password should be a string",
      success: false,
    })
  })

  it("return error if the passwords don't match", async () => {
    const config = { logN: 15, r: 8, p: 1 }
    const passwordHash = await Scrypt.kdf("somepass", config)

    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        return {
          entity_id: "test@admin.com",
          provider: "emailpass",
          provider_metadata: {
            password: passwordHash.toString("base64"),
          },
        }
      }),
    }

    const resp = await emailpassService.authenticate(
      { body: { email: "test@admin.com", password: "otherpass" } },
      authServiceSpies
    )

    expect(authServiceSpies.retrieve).toHaveBeenCalled()
    expect(resp).toEqual({
      error: "Invalid email or password",
      success: false,
    })
  })

  it("return an existing entity if the passwords match", async () => {
    const config = { logN: 15, r: 8, p: 1 }
    const passwordHash = await Scrypt.kdf("somepass", config)

    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        return {
          entity_id: "test@admin.com",
          provider: "emailpass",
          provider_metadata: {
            password: passwordHash.toString("base64"),
          },
        }
      }),
    }

    const resp = await emailpassService.authenticate(
      { body: { email: "test@admin.com", password: "somepass" } },
      authServiceSpies
    )

    expect(authServiceSpies.retrieve).toHaveBeenCalled()
    expect(resp).toEqual(
      expect.objectContaining({
        success: true,
        authIdentity: expect.objectContaining({
          entity_id: "test@admin.com",
          provider_metadata: {},
        }),
      })
    )
  })

  it("creates a new auth identity if it doesn't exist", async () => {
    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
      }),
      create: jest.fn().mockImplementation(() => {
        return {
          entity_id: "test@admin.com",
          provider: "emailpass",
          provider_metadata: {
            password: "somehash",
          },
        }
      }),
    }

    const resp = await emailpassService.authenticate(
      { body: { email: "test@admin.com", password: "test" } },
      authServiceSpies
    )

    expect(authServiceSpies.retrieve).toHaveBeenCalled()
    expect(authServiceSpies.create).toHaveBeenCalled()

    expect(resp.authIdentity).toEqual(
      expect.objectContaining({
        entity_id: "test@admin.com",
        provider_metadata: {},
      })
    )
  })
})
