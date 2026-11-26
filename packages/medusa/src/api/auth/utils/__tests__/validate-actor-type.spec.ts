import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ConfigModule } from "@medusajs/framework/types"
import { validateActorType } from "../validate-actor-type"

const buildRequest = (
  actorType: string,
  authMethodsPerActor?: Record<string, string[]>
) =>
  ({
    params: { actor_type: actorType },
    scope: {
      resolve: () =>
        ({
          projectConfig: {
            http: authMethodsPerActor ? { authMethodsPerActor } : {},
          },
        }) as unknown as ConfigModule,
    },
  }) as unknown as MedusaRequest

const run = async (req: MedusaRequest) => {
  const next = jest.fn()
  await validateActorType()(req, {} as MedusaResponse, next)
  return next
}

describe("validateActorType", () => {
  it("allows a built-in actor type without an entry", async () => {
    expect(await run(buildRequest("customer"))).toHaveBeenCalled()
  })

  it("allows a custom actor type with an entry", async () => {
    expect(
      await run(buildRequest("manager", { manager: ["emailpass"] }))
    ).toHaveBeenCalled()
  })

  it("rejects an actor type the app doesn't know", async () => {
    await expect(run(buildRequest("banana"))).rejects.toThrow(
      "The actor type banana is not supported. Add it to projectConfig.http.authMethodsPerActor to use it"
    )
  })
})
