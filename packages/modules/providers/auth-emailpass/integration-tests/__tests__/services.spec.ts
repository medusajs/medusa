import { MedusaError } from "@medusajs/framework/utils"
import Scrypt from "scrypt-kdf"
import { EmailPassAuthService } from "../../src/services/emailpass"

jest.setTimeout(100000)

describe("Email password auth provider", () => {
  let emailpassService: EmailPassAuthService
  let verifyingEmailpassService: EmailPassAuthService

  beforeAll(() => {
    emailpassService = new EmailPassAuthService(
      {
        logger: console as any,
      },
      {}
    )
    verifyingEmailpassService = new EmailPassAuthService(
      {
        logger: console as any,
      },
      {
        require_verification: ["customer", "user"],
      }
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

  it("marks new identities as unverified when actor_type is in require_verification", async () => {
    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
      }),
      create: jest.fn().mockImplementation((data) => {
        return {
          provider_identities: [
            {
              entity_id: data.entity_id,
              provider: "emailpass",
              provider_metadata: data.provider_metadata,
            },
          ],
        }
      }),
    }

    const resp = await verifyingEmailpassService.register(
      {
        body: { email: "test@admin.com", password: "test" },
        actor_type: "customer",
      },
      authServiceSpies
    )

    expect(authServiceSpies.create).toHaveBeenCalledWith(
      expect.objectContaining({
        provider_metadata: expect.objectContaining({
          password: expect.any(String),
          requires_verification: true,
        }),
      })
    )
    expect(resp.authIdentity?.provider_identities?.[0]).toEqual(
      expect.objectContaining({
        entity_id: "test@admin.com",
        provider_metadata: {
          requires_verification: true,
        },
      })
    )
  })

  it("skips verification when actor_type is not in require_verification", async () => {
    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
      }),
      create: jest.fn().mockImplementation((data) => {
        return {
          provider_identities: [
            {
              entity_id: data.entity_id,
              provider: "emailpass",
              provider_metadata: data.provider_metadata,
            },
          ],
        }
      }),
    }

    // verifyingEmailpassService is configured with ["customer", "user"];
    // "vendor" is not in the list, so verification should be skipped.
    await verifyingEmailpassService.register(
      {
        body: { email: "vendor@admin.com", password: "test" },
        actor_type: "vendor",
      },
      authServiceSpies
    )

    expect(authServiceSpies.create).toHaveBeenCalledWith(
      expect.objectContaining({
        provider_metadata: expect.not.objectContaining({
          requires_verification: expect.anything(),
        }),
      })
    )
  })

  it("requires verification for every actor type listed in require_verification", async () => {
    const customService = new EmailPassAuthService(
      {
        logger: console as any,
      },
      {
        require_verification: ["customer", "vendor", "service"],
      }
    )

    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
      }),
      create: jest.fn().mockImplementation((data) => {
        return {
          provider_identities: [
            {
              entity_id: data.entity_id,
              provider: "emailpass",
              provider_metadata: data.provider_metadata,
            },
          ],
        }
      }),
    }

    for (const actor_type of ["customer", "vendor", "service"]) {
      const resp = await customService.register(
        {
          body: { email: `${actor_type}@admin.com`, password: "test" },
          actor_type,
        },
        authServiceSpies
      )

      expect(resp).toEqual(
        expect.objectContaining({
          success: true,
          authIdentity: expect.objectContaining({
            provider_identities: [
              expect.objectContaining({
                entity_id: `${actor_type}@admin.com`,
                provider_metadata: expect.objectContaining({
                  requires_verification: true,
                }),
              }),
            ],
          }),
        })
      )
    }
  })

  it("skips verification for actor types not listed in require_verification", async () => {
    const customService = new EmailPassAuthService(
      {
        logger: console as any,
      },
      {
        require_verification: ["customer"],
      }
    )

    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
      }),
      create: jest.fn().mockImplementation((data) => {
        return {
          provider_identities: [
            {
              entity_id: data.entity_id,
              provider: "emailpass",
              provider_metadata: data.provider_metadata,
            },
          ],
        }
      }),
    }

    for (const actor_type of ["user", "vendor", "anything-else"]) {
      const resp = await customService.register(
        {
          body: { email: `${actor_type}@admin.com`, password: "test" },
          actor_type,
        },
        authServiceSpies
      )

      expect(resp).toEqual(
        expect.objectContaining({
          success: true,
          authIdentity: expect.objectContaining({
            provider_identities: [
              expect.objectContaining({
                entity_id: `${actor_type}@admin.com`,
                provider_metadata: expect.not.objectContaining({
                  requires_verification: expect.anything(),
                }),
              }),
            ],
          }),
        })
      )
    }

    for (const call of authServiceSpies.create.mock.calls) {
      expect(call[0].provider_metadata).not.toHaveProperty(
        "requires_verification"
      )
    }
  })

  it("never requires verification when require_verification is an empty array", async () => {
    const customService = new EmailPassAuthService(
      {
        logger: console as any,
      },
      {
        require_verification: [],
      }
    )

    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
      }),
      create: jest.fn().mockImplementation((data) => {
        return {
          provider_identities: [
            {
              entity_id: data.entity_id,
              provider: "emailpass",
              provider_metadata: data.provider_metadata,
            },
          ],
        }
      }),
    }

    await customService.register(
      {
        body: { email: "customer@admin.com", password: "test" },
        actor_type: "customer",
      },
      authServiceSpies
    )

    expect(authServiceSpies.create).toHaveBeenCalledWith(
      expect.objectContaining({
        provider_metadata: expect.not.objectContaining({
          requires_verification: expect.anything(),
        }),
      })
    )
  })

  it("never requires verification when require_verification is omitted", async () => {
    const defaultService = new EmailPassAuthService(
      {
        logger: console as any,
      },
      {}
    )

    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
      }),
      create: jest.fn().mockImplementation((data) => {
        return {
          provider_identities: [
            {
              entity_id: data.entity_id,
              provider: "emailpass",
              provider_metadata: data.provider_metadata,
            },
          ],
        }
      }),
    }

    for (const actor_type of ["customer", "user", "vendor"]) {
      await defaultService.register(
        {
          body: { email: `${actor_type}@admin.com`, password: "test" },
          actor_type,
        },
        authServiceSpies
      )

      expect(authServiceSpies.create).toHaveBeenLastCalledWith(
        expect.objectContaining({
          provider_metadata: expect.not.objectContaining({
            requires_verification: expect.anything(),
          }),
        })
      )
    }
  })

  it("skips verification when actor_type is not provided", async () => {
    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Not found")
      }),
      create: jest.fn().mockImplementation((data) => {
        return {
          provider_identities: [
            {
              entity_id: data.entity_id,
              provider: "emailpass",
              provider_metadata: data.provider_metadata,
            },
          ],
        }
      }),
    }

    await verifyingEmailpassService.register(
      { body: { email: "no-actor@admin.com", password: "test" } },
      authServiceSpies
    )

    expect(authServiceSpies.create).toHaveBeenCalledWith(
      expect.objectContaining({
        provider_metadata: expect.not.objectContaining({
          requires_verification: expect.anything(),
        }),
      })
    )
  })

  it("returns unverified state after password authentication when configured", async () => {
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
                requires_verification: true,
              },
            },
          ],
        }
      }),
    }

    const resp = await verifyingEmailpassService.authenticate(
      { body: { email: "test@admin.com", password: "somepass" } },
      authServiceSpies as any
    )

    expect(resp).toEqual(
      expect.objectContaining({
        success: true,
        authIdentity: expect.objectContaining({
          provider_identities: [
            expect.objectContaining({
              provider_metadata: {
                requires_verification: true,
              },
            }),
          ],
        }),
      })
    )
  })

  it("preserves verification state when updating a password", async () => {
    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        return {
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: {
                password: "old-hash",
                verified_at: "2026-05-25T10:00:00.000Z",
                requires_verification: false,
              },
            },
          ],
        }
      }),
      update: jest.fn().mockImplementation((_, data) => {
        return {
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: data.provider_metadata,
            },
          ],
        }
      }),
    }

    await emailpassService.update(
      { entity_id: "test@admin.com", password: "updated" },
      authServiceSpies as any
    )

    expect(authServiceSpies.update).toHaveBeenCalledWith(
      "test@admin.com",
      expect.objectContaining({
        provider_metadata: expect.objectContaining({
          password: expect.any(String),
          verified_at: "2026-05-25T10:00:00.000Z",
          requires_verification: false,
        }),
      })
    )
  })

  it("preserves provider metadata when claiming an existing unassigned identity", async () => {
    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        return {
          app_metadata: {},
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: {
                password: "old-hash",
                verified_at: "2026-05-25T10:00:00.000Z",
                requires_verification: false,
                custom: "keep-me",
              },
            },
          ],
        }
      }),
      update: jest.fn().mockImplementation((_, data) => {
        return {
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: data.provider_metadata,
            },
          ],
        }
      }),
    }

    const resp = await verifyingEmailpassService.register(
      { body: { email: "test@admin.com", password: "updated" } },
      authServiceSpies as any
    )

    expect(authServiceSpies.update).toHaveBeenCalledWith(
      "test@admin.com",
      expect.objectContaining({
        provider_metadata: expect.objectContaining({
          password: expect.any(String),
          verified_at: "2026-05-25T10:00:00.000Z",
          requires_verification: false,
          custom: "keep-me",
        }),
      })
    )
    expect(resp.authIdentity?.provider_identities?.[0]).toEqual(
      expect.objectContaining({
        entity_id: "test@admin.com",
        provider_metadata: {
          verified_at: "2026-05-25T10:00:00.000Z",
          requires_verification: false,
          custom: "keep-me",
        },
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

  it("updates identity if it exists but doesnt have app_metadata", async () => {
    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        return {
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: {
                password: "old-hash",
                custom: "keep-me",
              },
            },
          ],
        }
      }),
      update: jest.fn().mockImplementation((_, data) => {
        return {
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: data.provider_metadata,
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
    expect(authServiceSpies.update).toHaveBeenCalled()

    expect(resp.authIdentity?.provider_identities?.[0]).toEqual(
      expect.objectContaining({
        entity_id: "test@admin.com",
        provider_metadata: {
          custom: "keep-me",
        },
      })
    )
  })

  it("updates identity if it exists but app_metadata is empty", async () => {
    const authServiceSpies = {
      retrieve: jest.fn().mockImplementation(() => {
        return {
          app_metadata: {},
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: {
                password: "old-hash",
                custom: "keep-me",
              },
            },
          ],
        }
      }),
      update: jest.fn().mockImplementation((_, data) => {
        return {
          provider_identities: [
            {
              entity_id: "test@admin.com",
              provider: "emailpass",
              provider_metadata: data.provider_metadata,
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
    expect(authServiceSpies.update).toHaveBeenCalled()

    expect(resp.authIdentity?.provider_identities?.[0]).toEqual(
      expect.objectContaining({
        entity_id: "test@admin.com",
        provider_metadata: {
          custom: "keep-me",
        },
      })
    )
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
})
