import type { DMLSchema, PropertyType } from "@medusajs/types"
import { DmlEntity } from "../entity"
import { parseEntityName } from "./entity-builder/parse-entity-name"
import { getGraphQLAttributeFromDMLPropety } from "./graphql-builder/get-attribute"
import { setGraphQLRelationship } from "./graphql-builder/set-relationship"

export function generateGraphQLFromEntity() {
  const MANY_TO_MANY_TRACKED_RELATIONS: Record<string, boolean> = {}

  return function <T extends DmlEntity<any, any>>(entity: T): string {
    const { schema } = entity.parse()
    const { modelName } = parseEntityName(entity)

    let extra: string[] = []

    let gqlSchema: string[] = []

    const context = {
      MANY_TO_MANY_TRACKED_RELATIONS,
    }

    Object.entries(schema as DMLSchema).forEach(([name, property]) => {
      const field = property.parse(name)

      if ("fieldName" in field) {
        const prop = getGraphQLAttributeFromDMLPropety(
          name,
          property as PropertyType<any>
        )
        if (prop.enum) {
          extra.push(prop.enum)
        }

        gqlSchema.push(`${prop.attribute}`)
      } else {
        const prop = setGraphQLRelationship(modelName, field, context)
        if (prop.pivotSchema) {
          extra.push(prop.pivotSchema)
        }

        gqlSchema.push(`${prop.attribute}`)
      }
    })

    return `
      ${extra.join("\n")}
      type ${modelName} {
        ${gqlSchema.join("\n")}
      }
    `
  }
}

/**
 * Takes a DML entity and returns a GraphQL schema string.
 * @param entity
 */
export const toGraphQLSchema = <T extends any[]>(entities: T): string => {
  const gqlSchemas = entities.map((entity) => {
    if (DmlEntity.isDmlEntity(entity)) {
      return generateGraphQLFromEntity()(entity)
    }

    return entity
  })

  return gqlSchemas.join("\n")
}
