import { ConfigModule } from "@medusajs/framework/types"
import {
  getAllowedAuthProvidersForActor,
  isAuthProviderAllowedForActor,
} from "../auth-methods-per-actor"

const buildConfig = (
  authMethodsPerActor?: Record<string, string[]>
): ConfigModule =>
  ({
    projectConfig: {
      http: authMethodsPerActor ? { authMethodsPerActor } : {},
    },
  } as unknown as ConfigModule)

describe("getAllowedAuthProvidersForActor", () => {
  it("returns undefined when no allowlist is configured for the actor", () => {
    const config = buildConfig()

    expect(getAllowedAuthProvidersForActor(config, "user")).toBeUndefined()
  })

  it("returns undefined when a different actor type is configured", () => {
    const config = buildConfig({ customer: ["emailpass"] })

    expect(getAllowedAuthProvidersForActor(config, "user")).toBeUndefined()
  })

  it("returns the configured allowlist for the actor", () => {
    const config = buildConfig({ user: ["okta", "emailpass"] })

    expect(getAllowedAuthProvidersForActor(config, "user")).toEqual([
      "okta",
      "emailpass",
    ])
  })
})

describe("isAuthProviderAllowedForActor", () => {
  it("allows any provider when no allowlist is configured", () => {
    const config = buildConfig()

    expect(isAuthProviderAllowedForActor(config, "user", "okta")).toBe(true)
    expect(isAuthProviderAllowedForActor(config, "user", "emailpass")).toBe(
      true
    )
  })

  it("allows only providers in the actor's allowlist", () => {
    const config = buildConfig({ user: ["okta"] })

    expect(isAuthProviderAllowedForActor(config, "user", "okta")).toBe(true)
    expect(isAuthProviderAllowedForActor(config, "user", "emailpass")).toBe(
      false
    )
  })
})
