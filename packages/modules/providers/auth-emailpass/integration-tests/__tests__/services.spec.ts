import { MedusaError } from "@medusajs/framework/utils"
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
      {} as any
    )

    expect(resp).toEqual({
      error: "Email should be a string",
      success: false,
    })
  })

  it("return error if password is not passed", async () => {
    const resp = await emailpassService.authenticate(
      { body: { email: "test@admin.com" } },
      {} as any
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
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: {
                password: passwordHash.toString("base64"),
              },
            },
          ],
        }
      }),
    }

    const resp = await emailpassService.authenticate(
      { body: { email: "test@admin.com", password: "otherpass" } },
      authServiceSpies as any
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
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: {
                password: passwordHash.toString("base64"),
              },
            },
          ],
        }
      }),
    }

    const resp = await emailpassService.authenticate(
      { body: { email: "test@admin.com", password: "somepass" } },
      authServiceSpies as any
    )

    expect(authServiceSpies.retrieve).toHaveBeenCalled()
    expect(resp).toEqual(
      expect.objectContaining({
        success: true,
        authIdentity: expect.objectContaining({
          provider_identities: [
            expect.objectContaining({
              entity_id: "test@admin.com",
              provider_metadata: {},
            }),
          ],
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
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: {
                password: "somehash",
              },
            },
          ],
        }
      }),
    }

    const resp = await emailpassService.register(
      { body: { email: "test@admin.com", password: "test" } },
      authServiceSpies
    )

    expect(authServiceSpies.retrieve).toHaveBeenCalled()
    expect(authServiceSpies.create).toHaveBeenCalled()

    expect(resp.authIdentity?.provider_identities?.[0]).toEqual(
      expect.objectContaining({
        entity_id: "test@admin.com",
        provider_metadata: {},
      })
    )
  })

  it("returns the existing identity if it has no app_metadata and the password matches", async () => {
    const config = { logN: 15, r: 8, p: 1 }
    const passwordHash = await Scrypt.kdf("somepass", config)

    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        return {
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: {
                password: passwordHash.toString("base64"),
                custom: "keep-me",
              },
            },
          ],
        }
      }),
      update: jest.fn(),
    }

    const resp = await emailpassService.register(
      { body: { email: "test@admin.com", password: "somepass" } },
      authServiceSpies as any
    )

    expect(authServiceSpies.retrieve).toHaveBeenCalled()
    expect(authServiceSpies.update).not.toHaveBeenCalled()

    expect(resp.success).toBe(true)
    expect(resp.authIdentity?.provider_identities?.[0]).toEqual(
      expect.objectContaining({
        entity_id: "test@admin.com",
        provider_metadata: {
          custom: "keep-me",
        },
      })
    )
  })

  it("returns the existing identity if app_metadata is empty and the password matches", async () => {
    const config = { logN: 15, r: 8, p: 1 }
    const passwordHash = await Scrypt.kdf("somepass", config)

    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        return {
          app_metadata: {},
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: {
                password: passwordHash.toString("base64"),
              },
            },
          ],
        }
      }),
      update: jest.fn(),
    }

    const resp = await emailpassService.register(
      { body: { email: "test@admin.com", password: "somepass" } },
      authServiceSpies as any
    )

    expect(authServiceSpies.retrieve).toHaveBeenCalled()
    expect(authServiceSpies.update).not.toHaveBeenCalled()
    expect(resp.success).toBe(true)
  })

  it("throw if it has no app_metadata and the password does not match", async () => {
    const config = { logN: 15, r: 8, p: 1 }
    const passwordHash = await Scrypt.kdf("somepass", config)

    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        return {
          app_metadata: {},
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: {
                password: passwordHash.toString("base64"),
              },
            },
          ],
        }
      }),
      update: jest.fn(),
      create: jest.fn(),
    }

    const resp = await emailpassService.register(
      { body: { email: "test@admin.com", password: "otherpass" } },
      authServiceSpies as any
    )

    expect(authServiceSpies.retrieve).toHaveBeenCalled()
    expect(authServiceSpies.update).not.toHaveBeenCalled()
    expect(authServiceSpies.create).not.toHaveBeenCalled()

    expect(resp).toEqual({
      success: false,
      error: "Identity with email already exists",
    })
  })

  it("throw if auth identity with email already exists and has app_metadata", async () => {
    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        return { success: true, app_metadata: { user_id: "some-id" } }
      }),
      create: jest.fn().mockImplementation(() => {
        return {
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: {
                password: "somehash",
              },
            },
          ],
        }
      }),
    }

    const resp = await emailpassService.register(
      { body: { email: "test@admin.com", password: "test" } },
      authServiceSpies
    )

    expect(authServiceSpies.retrieve).toHaveBeenCalled()

    expect(resp.error).toEqual("Identity with email already exists")
  })

  it("throws if auth identity with email doesn't exist", async () => {
    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
      }),
      create: jest.fn().mockImplementation(() => {}),
    }

    const resp = await emailpassService.authenticate(
      { body: { email: "test@admin.com", password: "test" } },
      authServiceSpies
    )

    expect(authServiceSpies.retrieve).toHaveBeenCalled()

    expect(resp.error).toEqual("Invalid email or password")
  })

  describe("with requireActorAssociation", () => {
    let strictEmailpassService: EmailPassAuthService
    let authServiceSpies

    beforeAll(async () => {
      strictEmailpassService = new EmailPassAuthService(
        {
          logger: console as any,
        },
        { requireActorAssociation: true }
      )

      const passwordHash = await Scrypt.kdf("somepass", {
        logN: 15,
        r: 8,
        p: 1,
      })

      authServiceSpies = {
        retrieve: jest.fn().mockImplementation(() => {
          return {
            app_metadata: { customer_id: "cus_123" },
            provider_identities: [
              {
                entity_id: "test@customer.com",
                provider: "emailpass",
                provider_metadata: {
                  password: passwordHash.toString("base64"),
                },
              },
            ],
          }
        }),
      }
    })

    it("authenticates an identity associated with the actor type", async () => {
      const resp = await strictEmailpassService.authenticate(
        {
          actor_type: "customer",
          body: { email: "test@customer.com", password: "somepass" },
        },
        authServiceSpies
      )

      expect(resp).toEqual(
        expect.objectContaining({
          success: true,
          authIdentity: expect.objectContaining({
            app_metadata: { customer_id: "cus_123" },
          }),
        })
      )
    })

    it("refuses an identity that isn't associated with the actor type", async () => {
      const resp = await strictEmailpassService.authenticate(
        {
          actor_type: "user",
          body: { email: "test@customer.com", password: "somepass" },
        },
        authServiceSpies
      )

      expect(resp).toEqual({
        success: false,
        error: "Invalid email or password",
      })
    })

    it("refuses when no actor type is passed", async () => {
      const resp = await strictEmailpassService.authenticate(
        { body: { email: "test@customer.com", password: "somepass" } },
        authServiceSpies
      )

      expect(resp).toEqual({
        success: false,
        error: "Invalid email or password",
      })
    })
  })

  it("authenticates an identity on any actor type by default", async () => {
    const passwordHash = await Scrypt.kdf("somepass", {
      logN: 15,
      r: 8,
      p: 1,
    })

    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        return {
          app_metadata: { customer_id: "cus_123" },
          provider_identities: [
            {
              entity_id: "test@customer.com",
              provider: "emailpass",
              provider_metadata: {
                password: passwordHash.toString("base64"),
              },
            },
          ],
        }
      }),
    }

    const resp = await emailpassService.authenticate(
      {
        actor_type: "user",
        body: { email: "test@customer.com", password: "somepass" },
      },
      authServiceSpies as any
    )

    expect(resp.success).toEqual(true)
  })
})
