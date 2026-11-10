import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { buildAuthzContext } from "../build-authz-context"

const createContainer = (root: unknown) => {
  const graph = jest.fn().mockResolvedValue({ data: root ? [root] : [] })

  const container = {
    resolve: jest.fn((key: string) =>
      key === ContainerRegistrationKeys.QUERY ? { graph } : undefined
    ),
  } as unknown as MedusaContainer

  return { container, graph }
}

describe("buildAuthzContext", () => {
  it("reads the actor from the entity named by the actor type", async () => {
    const { container, graph } = createContainer({ id: "usr_1" })

    const context = await buildAuthzContext({
      actor_type: "user",
      actor_id: "usr_1",
      config: { grantees: [{ entity: "user", path: "id" }] },
      container,
    })

    expect(graph).toHaveBeenCalledWith({
      entity: "user",
      fields: ["id"],
      filters: { id: "usr_1" },
    })
    expect(context).toEqual({ grantees: [{ type: "user", id: "usr_1" }] })
  })

  it("reads the actor from `actor_entity` when the actor type is not an entity name", async () => {
    const { container, graph } = createContainer({
      id: "apk_1",
      created_by: "usr_1",
    })

    const context = await buildAuthzContext({
      actor_type: "api-key",
      actor_id: "apk_1",
      config: {
        actor_entity: "api_key",
        grantees: [{ entity: "user", path: "created_by" }],
      },
      container,
    })

    expect(graph).toHaveBeenCalledWith(
      expect.objectContaining({ entity: "api_key", fields: ["created_by"] })
    )
    expect(context).toEqual({ grantees: [{ type: "user", id: "usr_1" }] })
  })

  it("flattens to-many paths and drops missing leaves", async () => {
    const { container } = createContainer({
      id: "usr_1",
      teams: [{ id: "team_1" }, { id: "team_2" }, { id: null }],
    })

    const context = await buildAuthzContext({
      actor_type: "user",
      actor_id: "usr_1",
      config: {
        grantees: [
          { entity: "user", path: "id" },
          { entity: "team", path: "teams.id" },
        ],
      },
      container,
    })

    expect(context.grantees).toEqual([
      { type: "user", id: "usr_1" },
      { type: "team", id: "team_1" },
      { type: "team", id: "team_2" },
    ])
  })

  it("returns no grantees when the actor does not exist", async () => {
    const { container } = createContainer(undefined)

    const context = await buildAuthzContext({
      actor_type: "user",
      actor_id: "missing",
      config: { grantees: [{ entity: "user", path: "id" }] },
      container,
    })

    expect(context).toEqual({ grantees: [] })
  })
})
