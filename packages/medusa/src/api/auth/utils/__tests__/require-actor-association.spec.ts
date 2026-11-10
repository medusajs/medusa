import { ConfigModule } from "@medusajs/framework/types"
import { isActorAssociationRequired } from "../require-actor-association"

const buildConfig = (
  requireActorAssociation?: Record<string, boolean>
): ConfigModule =>
  ({
    projectConfig: {
      http: requireActorAssociation ? { requireActorAssociation } : {},
    },
  }) as unknown as ConfigModule

describe("isActorAssociationRequired", () => {
  it("returns false when not configured", () => {
    expect(isActorAssociationRequired(buildConfig(), "emailpass")).toBe(false)
  })

  it("returns false when the provider is disabled", () => {
    const config = buildConfig({ emailpass: false })

    expect(isActorAssociationRequired(config, "emailpass")).toBe(false)
  })

  it("returns true when the provider is enabled", () => {
    const config = buildConfig({ emailpass: true })

    expect(isActorAssociationRequired(config, "emailpass")).toBe(true)
    expect(isActorAssociationRequired(config, "google")).toBe(false)
  })
})
