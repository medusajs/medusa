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
  app_metadata: { user_id: "user_01", foo: "bar" },
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
            // Spread the base app_metadata — foo: "bar" comes in without being declared
            // explicitly below, so we can assert it survives the merge.
            ...baseAuthIdentity.app_metadata,
            // Override user_id with a value different from baseAuthIdentity ("user_01")
            // to assert it is resolved from the auth_identity and not left as the base value.
            user_id: "user_02",
            is_verified: true,
          },
        },
        actorType: "user",
        authProvider: "emailpass",
      },
      JWT_CONFIG
    )

    const decoded = jwt.decode(token) as Record<string, unknown>
    const appMeta = decoded.app_metadata as Record<string, unknown>
    // actor_id is resolved from this auth_identity's app_metadata ("user_02"),
    // not overridden back to the base value ("user_01").
    expect(appMeta.user_id).toEqual("user_02")
    expect(appMeta.user_id).not.toEqual("user_01")
    // foo: "bar" was in baseAuthIdentity.app_metadata but not re-declared in the
    // explicit override — it must still be present after the merge.
    expect(appMeta.foo).toEqual("bar")
    expect(appMeta.is_verified).toEqual(true)
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
