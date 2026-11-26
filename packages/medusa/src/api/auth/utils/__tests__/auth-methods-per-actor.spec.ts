import { ConfigModule } from "@medusajs/framework/types"
import {
  getAllowedAuthProvidersForActor,
  isAuthProviderAllowedForActor,
  isKnownActorType,
} from "../auth-methods-per-actor"

const buildConfig = (
  authMethodsPerActor?: Record<string, string[]>
): ConfigModule =>
  ({
    projectConfig: {
      http: authMethodsPerActor ? { authMethodsPerActor } : {},
    },
  }) as unknown as ConfigModule

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

  it("refuses an actor type without an entry that isn't built in", () => {
    const config = buildConfig({ user: ["emailpass"] })

    expect(isAuthProviderAllowedForActor(config, "manager", "emailpass")).toBe(
      false
    )
  })

  it("allows a custom actor type with an entry", () => {
    const config = buildConfig({ manager: ["emailpass"] })

    expect(isAuthProviderAllowedForActor(config, "manager", "emailpass")).toBe(
      true
    )
  })
})

describe("isKnownActorType", () => {
  it("knows the built-in actor types without any config", () => {
    const config = buildConfig()

    expect(isKnownActorType(config, "user")).toBe(true)
    expect(isKnownActorType(config, "customer")).toBe(true)
  })

  it("knows a custom actor type only when it has an entry", () => {
    expect(isKnownActorType(buildConfig(), "manager")).toBe(false)
    expect(isKnownActorType(buildConfig({ manager: [] }), "manager")).toBe(true)
  })

  it("doesn't treat Object.prototype keys as entries", () => {
    const config = buildConfig({ user: ["emailpass"] })

    expect(isKnownActorType(config, "constructor")).toBe(false)
    expect(isKnownActorType(config, "__proto__")).toBe(false)
    expect(getAllowedAuthProvidersForActor(config, "toString")).toBeUndefined()
  })
})
