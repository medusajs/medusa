import type {
  DMLSchema,
  EntityConstructor,
  IDmlEntity,
  Infer,
  PropertyType,
} from "@medusajs/types"

import { Entity, Filter } from "@mikro-orm/core"
import { mikroOrmSoftDeletableFilterOptions } from "../../dal"
import { DmlEntity } from "../entity"
import { parseEntityName } from "./entity-builder/parse-entity-name"
import { applyEntityIndexes, applyIndexes } from "./mikro-orm/apply-indexes"
import { defineProperty } from "./entity-builder/define-property"
import { applySearchable } from "./entity-builder/apply-searchable"
import { defineRelationship } from "./entity-builder/define-relationship"

/**
 * Factory function to create the mikro orm entity builder. The return
 * value is a function that can be used to convert DML entities
 * to Mikro ORM entities.
 */
export function createMikrORMEntity() {
  /**
   * The following property is used to track many to many relationship
   * between two entities. It is needed because we have to mark one
   * of them as the owner of the relationship without exposing
   * any user land APIs to explicitly define an owner.
   *
   * The object contains values as follows.
   * - [modelName.relationship]: true // true means, it is already marked as owner
   *
   * Example:
   * - [user.teams]: true // the teams relationship on user is an owner
   * - [team.users] // cannot be an owner
   */
  // TODO: if we use the util toMikroOrmEntities then a new builder will be used each time, lets think about this. Currently if means that with many to many we need to use the same builder
  const MANY_TO_MANY_TRACKED_REALTIONS: Record<string, boolean> = {}

  /**
   * A helper function to define a Mikro ORM entity from a
   * DML entity.
   */
  return function createEntity<T extends DmlEntity<any, any>>(
    entity: T
  ): Infer<T> {
    class MikroORMEntity {}

    const { schema, cascades, indexes: entityIndexes = [] } = entity.parse()
    const { modelName, tableName } = parseEntityName(entity)

    /**
     * Assigning name to the class constructor, so that it matches
     * the DML entity name
     */
    Object.defineProperty(MikroORMEntity, "name", {
      get: function () {
        return modelName
      },
    })

    const context = {
      MANY_TO_MANY_TRACKED_REALTIONS,
    }

    /**
     * Processing schema fields
     */
    Object.entries(schema as DMLSchema).forEach(([name, property]) => {
      const field = property.parse(name)

      if ("fieldName" in field) {
        defineProperty(MikroORMEntity, name, property as PropertyType<any>)
        applyIndexes(MikroORMEntity, tableName, field)
        applySearchable(MikroORMEntity, field)
      } else {
        defineRelationship(MikroORMEntity, field, cascades, context)
      }
    })

    applyEntityIndexes(MikroORMEntity, tableName, entityIndexes)

    /**
     * Converting class to a MikroORM entity
     */
    return Entity({ tableName })(
      Filter(mikroOrmSoftDeletableFilterOptions)(MikroORMEntity)
    ) as Infer<T>
  }
}

/**
 * Takes a DML entity and returns a Mikro ORM entity otherwise
 * return the input idempotently
 * @param entity
 */
export const toMikroORMEntity = <T>(
  entity: T
): T extends IDmlEntity<any, any> ? Infer<T> : T => {
  let mikroOrmEntity: T | EntityConstructor<any> = entity

  if (DmlEntity.isDmlEntity(entity)) {
    mikroOrmEntity = createMikrORMEntity()(entity)
  }

  return mikroOrmEntity as T extends IDmlEntity<any, any> ? Infer<T> : T
}

/**
 * Takes any DmlEntity or mikro orm entities and return mikro orm entities only.
 * This action is idempotent if non of the entities are DmlEntity
 * @param entities
 */
export const toMikroOrmEntities = function <T extends any[]>(entities: T) {
  const entityBuilder = createMikrORMEntity()

  return entities.map((entity) => {
    if (DmlEntity.isDmlEntity(entity)) {
      return entityBuilder(entity)
    }

    return entity
  }) as {
    [K in keyof T]: T[K] extends IDmlEntity<any, any> ? Infer<T[K]> : T[K]
  }
}
