import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ConfigModule } from "@medusajs/framework/types"
import { validateScopeProviderAssociation } from "../validate-scope-provider-association"

const buildRequest = (
  params: Record<string, string>,
  authMethodsPerActor?: Record<string, string[]>
) =>
  ({
    params,
    scope: {
      resolve: () =>
        ({
          projectConfig: {
            http: authMethodsPerActor ? { authMethodsPerActor } : {},
          },
        } as unknown as ConfigModule),
    },
  } as unknown as MedusaRequest)

const run = async (req: MedusaRequest, actorType?: string) => {
  const next = jest.fn()
  await validateScopeProviderAssociation(actorType)(
    req,
    {} as MedusaResponse,
    next
  )
  return next
}

describe("validateScopeProviderAssociation", () => {
  it("reads the actor type from the path when none is pinned", async () => {
    const req = buildRequest(
      { actor_type: "customer", auth_provider: "google" },
      { user: ["emailpass"] }
    )

    expect(await run(req)).toHaveBeenCalled()
  })

  it("rejects a provider missing from the path actor's allowlist", async () => {
    const req = buildRequest(
      { actor_type: "user", auth_provider: "google" },
      { user: ["emailpass"] }
    )

    await expect(run(req)).rejects.toThrow(
      "The actor type user is not allowed to use the auth provider google"
    )
  })

  it("uses the pinned actor type on routes without an actor_type param", async () => {
    const req = buildRequest(
      { auth_provider: "google" },
      { user: ["emailpass"] }
    )

    await expect(run(req, "user")).rejects.toThrow(
      "The actor type user is not allowed to use the auth provider google"
    )
  })

  it("allows a pinned actor type whose allowlist includes the provider", async () => {
    const req = buildRequest(
      { auth_provider: "oidc-okta" },
      { user: ["emailpass", "oidc-okta"] }
    )

    expect(await run(req, "user")).toHaveBeenCalled()
  })
})
