import {
  Entity,
  OneToMany,
  Property,
  OneToOne,
  ManyToMany,
} from "@mikro-orm/core"
import { DmlEntity } from "../entity"
import { camelToSnakeCase, pluralize } from "../../common"
import { upperCaseFirst } from "../../common/upper-case-first"
import type { Infer, RelationshipType, SchemaType } from "../types"

/**
 * A helper function to define a Mikro ORM entity from a
 * DML entity.
 */
export function createMikrORMEntity<
  T extends DmlEntity<Record<string, SchemaType<any> | RelationshipType<any>>>
>(entity: T): Infer<T> {
  class MikroORMEntity {}

  const className = upperCaseFirst(entity.name)
  const tableName = pluralize(camelToSnakeCase(className))

  /**
   * Assigning name to the class constructor, so that it matches
   * the DML entity name
   */
  Object.defineProperty(MikroORMEntity, "name", {
    get: function () {
      return className
    },
  })

  Object.keys(entity.schema).forEach((property) => {
    const field = entity.schema[property].parse(property)

    /**
     * Define field as a property on the class
     */
    if ("fieldName" in field) {
      Property({ type: field.dataType.name, columnType: field.dataType.name })(
        MikroORMEntity.prototype,
        property
      )
    } else {
      const relatedEntity =
        typeof field.entity === "function"
          ? (field.entity() as DmlEntity<
              Record<string, SchemaType<any> | RelationshipType<any>>
            >)
          : undefined

      /**
       * Since we don't type-check relationships, we should validate
       * them at runtime
       */
      if (!relatedEntity) {
        throw new Error(
          `Invalid relationship reference for "${entity.name}.${property}"`
        )
      }

      const relatedModelName = upperCaseFirst(relatedEntity.name)

      /**
       * Defining relationships
       */
      switch (field.type) {
        case "hasOne":
          OneToOne({ entity: relatedModelName, mappedBy: "" })(
            MikroORMEntity.prototype,
            property
          )
          break
        case "hasMany":
          OneToMany({ entity: relatedModelName, mappedBy: "" })(
            MikroORMEntity.prototype,
            property
          )
          break
        case "manyToMany":
          ManyToMany({ entity: relatedModelName, mappedBy: "" })(
            MikroORMEntity.prototype,
            property
          )
          break
      }
    }
  })

  return Entity({ tableName })(MikroORMEntity) as Infer<T>
}
