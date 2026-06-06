import type { PropertyType } from "@zjedene-medusa/types"
import { DmlEntity } from "../entity"
import { getForeignKey } from "./entity-builder"
import { parseEntityName } from "./entity-builder/parse-entity-name"
import { getGraphQLAttributeFromDMLPropety } from "./graphql-builder/get-attribute"
import { setGraphQLRelationship } from "./graphql-builder/set-relationship"

export function generateGraphQLFromEntity<T extends DmlEntity<any, any>>(
  entity: T
): string {
  const { schema } = entity.parse()
  const { modelName } = parseEntityName(entity)

  let extra: string[] = []
  let gqlSchema: string[] = []

  Object.entries(schema).forEach(([name, property]) => {
    const field = property.parse(name)

    if ("fieldName" in field) {
      const prop = getGraphQLAttributeFromDMLPropety(
        modelName,
        name,
        property as PropertyType<any>
      )

      if (prop.enum) {
        extra.push(prop.enum)
      }

      gqlSchema.push(`${prop.attribute}`)
    } else {
      if (["belongsTo", "hasOneWithFK"].includes(field.type)) {
        const foreignKeyName = getForeignKey(field)
        const fkProp = getGraphQLAttributeFromDMLPropety(
          modelName,
          field.name,
          {
            $dataType: "",
            parse() {
              return {
                fieldName: foreignKeyName,
                computed: false,
                dataType: { name: "text" as const },
                nullable: field.nullable || false,
                indexes: [],
                relationships: [],
              }
            },
          }
        )
        gqlSchema.push(`${fkProp.attribute}`)
      }

      const prop = setGraphQLRelationship(modelName, field)
      if (prop.extra) {
        extra.push(prop.extra)
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

/**
 * Takes a DML entity and returns a GraphQL schema string.
 * @param entity
 */
export const toGraphQLSchema = <T extends any[]>(entities: T): string => {
  const gqlSchemas = entities.map((entity) => {
    if (DmlEntity.isDmlEntity(entity)) {
      return generateGraphQLFromEntity(entity)
    }

    return entity
  })

  const defaultMedusaSchema =
    gqlSchemas.length > 0
      ? `
    scalar DateTime
    scalar JSON
    directive @enumValue(value: String) on ENUM_VALUE
  `
      : ""

  return defaultMedusaSchema + gqlSchemas.join("\n")
}
