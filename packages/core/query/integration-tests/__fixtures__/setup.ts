import { LoadedModule, MedusaContainer, RemoteQueryFunction } from "@medusajs/types"
import { extractRelationsFromGQL } from "@medusajs/utils"
import { buildSchema } from "graphql"
import { createQuery, RelationMap, RemoteQuery } from "../../src"
import {
  createFakeLoadedModules,
  createTestModules,
  getJoinerConfigs,
  TestModules,
} from "./modules"

function createRelationMap(modulesLoaded: LoadedModule[]): RelationMap {
  const mergedSchema = getJoinerConfigs(modulesLoaded)
    .map((config) => config.schema)
    .filter(Boolean)
    .join("\n")

  const schema = buildSchema(mergedSchema)

  return extractRelationsFromGQL(schema.getTypeMap() as any)
}

export function setup() {
  const modules = createTestModules()
  const modulesLoaded = createFakeLoadedModules(modules)
  const relationMap = createRelationMap(modulesLoaded)

  const remoteQuery = new RemoteQuery({
    modulesLoaded,
    relationMap,
  })

  const container = {
    resolve: jest.fn(),
  } as unknown as MedusaContainer

  const query = createQuery({
    remoteQuery,
    indexModule: null as any,
    container,
  }) as RemoteQueryFunction

  return {
    remoteQuery,
    query,
    container,
    modules,
    modulesLoaded,
    relationMap,
  }
}

export type { TestModules }
