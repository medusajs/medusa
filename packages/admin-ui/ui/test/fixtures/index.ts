import data from "./fixtures.json"

const resources = data["resources"]

export type Resources = typeof resources

type ResourcesWithKey<Entity extends string, T> = {
  [K in keyof T]: { [_ in Entity]: K } & T[K]
}

type KeyedResources = ResourcesWithKey<"entity", Resources>

export const fixtures = {
  get<Entity extends keyof Resources>(
    entity: Entity
  ): Omit<KeyedResources[Entity], "entity"> {
    return (resources as any)[entity]
  },
  list<Entity extends keyof Resources>(
    entity: Entity,
    number = 2
  ): Omit<KeyedResources[Entity], "entity">[] {
    return Array(number)
      .fill(null)
      .map((_) => fixtures.get(entity))
  },
} as const
