import { LoadedModule } from "@medusajs/types"
import { isPresent } from "@medusajs/utils"
import { LinkDefinition } from "../remote-link"

export const convertRecordsToLinkDefinition = (
  links: object[],
  service: LoadedModule
): LinkDefinition[] => {
  const linkRelations = service.__joinerConfig.relationships || []
  const linkExtraFields = service.__joinerConfig.extraFields || []

  const results: LinkDefinition[] = []

  for (const link of links) {
    const result: LinkDefinition = {}

    for (const relation of linkRelations) {
      result[relation.serviceName] = {
        [relation.foreignKey]: link[relation.foreignKey],
      }
    }

    const data: LinkDefinition["data"] = {}

    for (const extraField of linkExtraFields) {
      data[extraField] = link[extraField]
    }

    if (isPresent(data)) {
      result.data = data
    }

    results.push(result)
  }

  return results
}
