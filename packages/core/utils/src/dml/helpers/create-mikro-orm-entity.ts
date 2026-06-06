import type {
  Constructor,
  DMLSchema,
  EntityConstructor,
  IDmlEntity,
  Infer,
  PropertyType,
} from "@zjedene-medusa/types"
import { Entity, Filter, MetadataStorage } from "@zjedene-medusa/deps/mikro-orm/core"

import {
  mikroOrmFreeTextSearchFilterOptionsFactory,
  mikroOrmSoftDeletableFilterOptions,
} from "../../dal"
import { DmlEntity } from "../entity"
import { DuplicateIdPropertyError } from "../errors"
import { IdProperty } from "../properties/id"
import { applySearchable } from "./entity-builder/apply-searchable"
import { defineProperty } from "./entity-builder/define-property"
import { defineRelationship } from "./entity-builder/define-relationship"
import { parseEntityName } from "./entity-builder/parse-entity-name"
import { applyChecks } from "./mikro-orm/apply-checks"
import { applyEntityIndexes, applyIndexes } from "./mikro-orm/apply-indexes"

/**
 * Factory function to create the mikro orm entity builder. The return
 * value is a function that can be used to convert DML entities
 * to Mikro ORM entities.
 */
function createMikrORMEntity() {
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
  let MANY_TO_MANY_TRACKED_RELATIONS: Record<string, boolean> = {}
  let ENTITIES: Record<string, Constructor<any>> = {}

  /**
   * A helper function to define a Mikro ORM entity from a
   * DML entity.
   */
  function createEntity<T extends DmlEntity<any, any>>(entity: T): Infer<T> {
    class MikroORMEntity {}

    const {
      schema,
      cascades,
      indexes: entityIndexes = [],
      //params,
      checks,
    } = entity.parse()

    const { modelName, tableName } = parseEntityName(entity)

    if (ENTITIES[modelName]) {
      return ENTITIES[modelName] as Infer<T>
    }

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
      MANY_TO_MANY_TRACKED_RELATIONS,
    }

    let hasIdAlreadyDefined = false

    /**
     * Processing schema fields
     */
    Object.entries(schema as DMLSchema).forEach(([name, property]) => {
      const field = property.parse(name)

      if ("fieldName" in field) {
        if (IdProperty.isIdProperty(field)) {
          if (hasIdAlreadyDefined) {
            throw new DuplicateIdPropertyError(modelName)
          }
          hasIdAlreadyDefined = true
        }

        defineProperty(MikroORMEntity, property as PropertyType<any>, {
          propertyName: name,
          tableName,
        })
        applyIndexes(MikroORMEntity, tableName, field)
        applySearchable(MikroORMEntity, field)
      } else {
        defineRelationship(MikroORMEntity, entity, field, cascades, context)
        applySearchable(MikroORMEntity, field)
      }
    })

    applyEntityIndexes(MikroORMEntity, tableName, entityIndexes)
    applyChecks(MikroORMEntity, checks)

    /**
     * Converting class to a MikroORM entity
     */
    Filter(mikroOrmFreeTextSearchFilterOptionsFactory(modelName))(
      MikroORMEntity
    )

    Entity({ tableName })(
      Filter(mikroOrmSoftDeletableFilterOptions)(MikroORMEntity)
    ) as any

    const entityMetadata =
      MetadataStorage.getMetadataFromDecorator(MikroORMEntity)

    ENTITIES[modelName] = entityMetadata.class as Constructor<any>
    return entityMetadata.class as Infer<T>
  }

  /**
   * Clear the internally tracked entities and relationships
   */
  createEntity.clear = function () {
    MANY_TO_MANY_TRACKED_RELATIONS = {}
    ENTITIES = {}
  }
  return createEntity
}

/**
 * Helper function to convert DML entities to MikroORM entity. Use
 * "toMikroORMEntity" if you are ensure the input is a DML entity
 * or not.
 */
export const mikroORMEntityBuilder = createMikrORMEntity()

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
    mikroOrmEntity = mikroORMEntityBuilder(entity)
  }

  return mikroOrmEntity as T extends IDmlEntity<any, any> ? Infer<T> : T
}

/**
 * Takes any DmlEntity or mikro orm entities and return mikro orm entities only.
 * This action is idempotent if non of the entities are DmlEntity
 * @param entities
 */
export const toMikroOrmEntities = function <T extends any[]>(entities: T) {
  return entities.map((entity) => {
    if (DmlEntity.isDmlEntity(entity)) {
      return mikroORMEntityBuilder(entity)
    }

    return entity
  }) as {
    [K in keyof T]: T[K] extends IDmlEntity<any, any> ? Infer<T[K]> : T[K]
  }
}
