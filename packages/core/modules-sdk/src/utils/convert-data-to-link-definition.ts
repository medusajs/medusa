import { LoadedModule } from "@medusajs/types"
import { isPresent } from "@medusajs/utils"
import { LinkDefinition } from "../remote-link"

export const convertRecordsToLinkDefinition = (
  links: object[],
  service: LoadedModule
): LinkDefinition[] => {
  const linkRelations = service.__joinerConfig.relationships || []
  const linkDataFields = service.__joinerConfig.extraDataFields || []

  const results: LinkDefinition[] = []

  for (const link of links) {
    const result: LinkDefinition = {}

    for (const relation of linkRelations) {
      result[relation.serviceName] = {
        [relation.foreignKey]: link[relation.foreignKey],
      }
    }

    const data: LinkDefinition["data"] = {}

    for (const dataField of linkDataFields) {
      data[dataField] = link[dataField]
    }

    if (isPresent(data)) {
      result.data = data
    }

    results.push(result)
  }

  return results
}
