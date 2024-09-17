import { JoinerServiceConfig, JoinerServiceConfigAlias } from "@medusajs/types"
import { isObject } from "@medusajs/utils"
import { cleanGraphQLSchema } from "../utils"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { MedusaModule } from "../medusa-module"

function makeSchemaExecutable(inputSchema: string) {
  const { schema: cleanedSchema } = cleanGraphQLSchema(inputSchema)

  return makeExecutableSchema({ typeDefs: cleanedSchema })
}

/**
 * Parse and assign filters to remote query object to the corresponding relation level
 * @param entryPoint
 * @param filters
 * @param remoteQueryObject
 */
export function parseAndAssignFilters({
  entryPoint,
  filters,
  remoteQueryObject,
}: {
  remoteQueryObject: object
  entryPoint: string
  filters: object
}) {
  const joinerConfigs = MedusaModule.getAllJoinerConfigs()

  const executableSchemaMapCache = new Map()

  for (const [filterKey, filterValue] of Object.entries(filters)) {
    let executableSchema // : GraphqlSchema
    let entryAlias!: JoinerServiceConfigAlias
    let entryJoinerConfig!: JoinerServiceConfig

    if (!executableSchemaMapCache.has(filterKey)) {
      const { joinerConfig, alias } = retrieveJoinerConfigFromPropertyName({
        entryPoint: entryPoint,
        joinerConfigs,
      })

      if (!joinerConfig) {
        remoteQueryObject["__args"] ??= {}
        remoteQueryObject["__args"]["filters"] ??= {}
        remoteQueryObject["__args"]["filters"][entryPoint] = filters
        return
      }

      entryAlias = alias
      entryJoinerConfig = joinerConfig

      executableSchema = makeSchemaExecutable(joinerConfig.schema)
      executableSchemaMapCache.set(joinerConfig.serviceName, {
        executableSchema,
        alias,
      })
    } else {
      const data = executableSchemaMapCache.get(filterKey)
      executableSchema = data.executableSchema
      entryAlias = data.alias
    }

    const entitiesMap = executableSchema.getTypeMap()

    const entryEntity = entitiesMap[entryAlias.entity!]

    if (!entryEntity) {
      throw new Error(
        `Entity ${entryAlias.entity} not found in the public schema of the joiner config from ${entryJoinerConfig.serviceName}`
      )
    }

    const entryEntityFields = entryEntity.astNode?.fields?.map(
      (field) => field.name.value
    )

    if (isObject(filterValue)) {
      remoteQueryObject[entryPoint] ??= {}

      parseAndAssignFilters({
        entryPoint: filterKey,
        filters: filterValue,
        remoteQueryObject: remoteQueryObject[entryPoint],
      })
      continue
    }

    if (entryEntityFields?.includes(filterKey)) {
      remoteQueryObject[entryPoint] ??= {}
      remoteQueryObject[entryPoint].__args ??= {}
      remoteQueryObject[entryPoint].__args["filters"] ??= {}
      remoteQueryObject[entryPoint].__args["filters"][filterKey] = filterValue
    }
  }
}

function retrieveJoinerConfigFromPropertyName({ entryPoint, joinerConfigs }) {
  for (const joinerConfig of joinerConfigs) {
    const aliases = joinerConfig.alias
    const entryPointAlias = aliases.find((alias) => {
      const aliasNames = Array.isArray(alias.name) ? alias.name : [alias.name]
      return aliasNames.includes(entryPoint)
    })

    if (entryPointAlias) {
      return { joinerConfig, alias: entryPointAlias }
    }
  }

  return {}
}
