import { FeatureFlag } from "@medusajs/framework/utils"
import jwt from "jsonwebtoken"
import { generateJwtTokenForAuthIdentity } from "../generate-jwt-token"

jest.mock("@medusajs/framework/utils", () => ({
  ...jest.requireActual("@medusajs/framework/utils"),
  FeatureFlag: {
    isFeatureEnabled: jest.fn().mockReturnValue(false),
  },
}))

const JWT_SECRET = "test-secret"
const JWT_CONFIG = { secret: JWT_SECRET, expiresIn: "1d" }

const baseAuthIdentity = {
  id: "auth_id_01",
  provider_identities: [],
  app_metadata: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

describe("generateJwtTokenForAuthIdentity", () => {
  beforeEach(() => {
    ;(FeatureFlag.isFeatureEnabled as jest.Mock).mockReturnValue(false)
  })

  it("should include auth_provider in JWT payload when provided", async () => {
    const token = await generateJwtTokenForAuthIdentity(
      {
        authIdentity: {
          ...baseAuthIdentity,
          app_metadata: { user_id: "user_01" },
          provider_identities: [
            { provider: "emailpass", entity_id: "test@test.com" } as any,
          ],
        },
        actorType: "user",
        authProvider: "emailpass",
      },
      JWT_CONFIG
    )

    const decoded = jwt.decode(token) as Record<string, unknown>
    expect(decoded.auth_provider).toEqual("emailpass")
  })

  it("should NOT include auth_provider in JWT payload when not provided", async () => {
    const token = await generateJwtTokenForAuthIdentity(
      {
        authIdentity: {
          ...baseAuthIdentity,
          app_metadata: { user_id: "user_01" },
        },
        actorType: "user",
      },
      JWT_CONFIG
    )

    const decoded = jwt.decode(token) as Record<string, unknown>
    expect(decoded.auth_provider).toBeUndefined()
  })

  it("should preserve custom app_metadata fields from authIdentity", async () => {
    const token = await generateJwtTokenForAuthIdentity(
      {
        authIdentity: {
          ...baseAuthIdentity,
          app_metadata: {
            user_id: "user_01",
            is_verified: true,
            custom_role: "manager",
          },
        },
        actorType: "user",
        authProvider: "emailpass",
      },
      JWT_CONFIG
    )

    const decoded = jwt.decode(token) as Record<string, unknown>
    const appMeta = decoded.app_metadata as Record<string, unknown>
    expect(appMeta.is_verified).toEqual(true)
    expect(appMeta.custom_role).toEqual("manager")
    // entityIdKey must still be present
    expect(appMeta.user_id).toEqual("user_01")
  })

  it("should populate user_metadata from the matching provider identity", async () => {
    const token = await generateJwtTokenForAuthIdentity(
      {
        authIdentity: {
          ...baseAuthIdentity,
          app_metadata: { user_id: "user_01" },
          provider_identities: [
            {
              provider: "emailpass",
              entity_id: "test@test.com",
              user_metadata: { email: "test@test.com", name: "Test User" },
            } as any,
          ],
        },
        actorType: "user",
        authProvider: "emailpass",
      },
      JWT_CONFIG
    )

    const decoded = jwt.decode(token) as Record<string, unknown>
    expect(decoded.user_metadata).toEqual({
      email: "test@test.com",
      name: "Test User",
    })
  })

  it("should fall back to empty user_metadata when authProvider is not provided", async () => {
    const token = await generateJwtTokenForAuthIdentity(
      {
        authIdentity: {
          ...baseAuthIdentity,
          app_metadata: { user_id: "user_01" },
          provider_identities: [
            {
              provider: "emailpass",
              entity_id: "test@test.com",
              user_metadata: { email: "test@test.com" },
            } as any,
          ],
        },
        actorType: "user",
        // authProvider intentionally omitted (simulates old tokens without auth_provider claim)
      },
      JWT_CONFIG
    )

    const decoded = jwt.decode(token) as Record<string, unknown>
    expect(decoded.user_metadata).toEqual({})
  })
})
