import {
  EntityCascades,
  EntityConstructor,
  PropertyType,
  RelationshipMetadata,
  RelationshipType,
} from "@zjedene-medusa/types"
import {
  BeforeCreate,
  BeforeUpdate,
  Cascade,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  OneToOneOptions,
  OnInit,
  Property,
  rel,
} from "@zjedene-medusa/deps/mikro-orm/core"
import { camelToSnakeCase, pluralize } from "../../../common"
import { DmlEntity } from "../../entity"
import { BelongsTo } from "../../relations"
import { HasMany } from "../../relations/has-many"
import { HasOne } from "../../relations/has-one"
import { HasOneWithForeignKey } from "../../relations/has-one-fk"
import { ManyToMany as DmlManyToMany } from "../../relations/many-to-many"
import { applyEntityIndexes } from "../mikro-orm/apply-indexes"
import { parseEntityName } from "./parse-entity-name"
import { getForeignKey } from "./relationship-helpers"

type Context = {
  MANY_TO_MANY_TRACKED_RELATIONS: Record<string, boolean>
}

function retrieveOtherSideRelationshipManyToMany({
  relationship,
  relatedEntity,
  relatedModelName,
  entity,
}: {
  relationship: RelationshipMetadata
  relatedEntity: DmlEntity<
    Record<string, PropertyType<any> | RelationshipType<any>>,
    any
  >
  relatedModelName: string
  entity: DmlEntity<any, any>
}): [string, RelationshipType<any>] {
  if (relationship.mappedBy) {
    return [
      relationship.mappedBy,
      relatedEntity.parse().schema[relationship.mappedBy],
    ] as [string, RelationshipType<any>]
  }

  /**
   * Since we don't have the information about the other side of the
   * relationship, we will try to find all the other side many to many that refers to the current entity.
   * If there is any, we will try to find if at least one of them has a mappedBy.
   */
  const potentialOtherSide = Object.entries(relatedEntity.schema)
    .filter(([, propConfig]) => DmlManyToMany.isManyToMany(propConfig))
    .filter(([prop, propConfig]) => {
      const parsedProp = propConfig.parse(prop) as RelationshipMetadata

      const relatedEntity =
        typeof parsedProp.entity === "function"
          ? parsedProp.entity()
          : undefined

      if (!relatedEntity) {
        throw new Error(
          `Invalid relationship reference for "${relatedModelName}.${prop}". Make sure to define the relationship using a factory function`
        )
      }

      return (
        (parsedProp.mappedBy === relationship.name &&
          parseEntityName(relatedEntity).modelName ===
            parseEntityName(entity).modelName) ||
        parseEntityName(relatedEntity).modelName ===
          parseEntityName(entity).modelName
      )
    }) as unknown as [string, RelationshipType<any>][]

  if (potentialOtherSide.length > 1) {
    throw new Error(
      `Invalid relationship reference for "${entity.name}.${relationship.name}". Make sure to set the mappedBy property on one side or the other or both.`
    )
  }

  return potentialOtherSide[0] ?? []
}

/**
 * Validates a many to many relationship without mappedBy and checks if the other side of the relationship is defined and possesses mappedBy.
 * @param MikroORMEntity
 * @param relationship
 * @param relatedEntity
 * @param relatedModelName
 */
function validateManyToManyRelationshipWithoutMappedBy({
  MikroORMEntity,
  relationship,
  relatedEntity,
  relatedModelName,
  entity,
}: {
  MikroORMEntity: EntityConstructor<any>
  relationship: RelationshipMetadata
  relatedEntity: DmlEntity<
    Record<string, PropertyType<any> | RelationshipType<any>>,
    any
  >
  relatedModelName: string
  entity: DmlEntity<any, any>
}) {
  /**
   * Since we don't have the information about the other side of the
   * relationship, we will try to find all the other side many to many that refers to the current entity.
   * If there is any, we will try to find if at least one of them has a mappedBy.
   */
  const [, potentialOtherSide] = retrieveOtherSideRelationshipManyToMany({
    relationship,
    relatedEntity,
    relatedModelName,
    entity,
  })

  if (!potentialOtherSide) {
    throw new Error(
      `Invalid relationship reference for "${MikroORMEntity.name}.${relationship.name}". "mappedBy" should be defined on one side or the other.`
    )
  }
}

/**
 * Defines has one relationship on the Mikro ORM entity.
 */
export function defineHasOneRelationship(
  MikroORMEntity: EntityConstructor<any>,
  relationship: RelationshipMetadata,
  relatedEntity: DmlEntity<
    Record<string, PropertyType<any> | RelationshipType<any>>,
    any
  >,
  { relatedModelName }: { relatedModelName: string },
  cascades: EntityCascades<string[], string[]>
) {
  const shouldRemoveRelated = !!cascades.delete?.includes(relationship.name)
  const { schema: relationSchema } = relatedEntity.parse()

  let mappedBy: string | undefined = camelToSnakeCase(MikroORMEntity.name)
  if ("mappedBy" in relationship) {
    mappedBy = relationship.mappedBy
  }

  const isOthersideBelongsTo =
    !!mappedBy && BelongsTo.isBelongsTo(relationSchema[mappedBy])

  const oneToOneOptions = {
    entity: relatedModelName,
    ...(relationship.nullable ? { nullable: relationship.nullable } : {}),
    ...(mappedBy ? { mappedBy } : {}),
    deleteRule: shouldRemoveRelated ? "cascade" : undefined,
  } as OneToOneOptions<any, any>

  if (shouldRemoveRelated && !isOthersideBelongsTo) {
    oneToOneOptions.cascade = ["persist", "soft-remove"] as any
  }

  OneToOne(oneToOneOptions)(MikroORMEntity.prototype, relationship.name)
}

/**
 * Defines has one relationship with Foreign key on the MikroORM
 * entity
 */
export function defineHasOneWithFKRelationship(
  MikroORMEntity: EntityConstructor<any>,
  entity: DmlEntity<any, any>,
  relationship: RelationshipMetadata,
  { relatedModelName }: { relatedModelName: string },
  cascades: EntityCascades<string[], string[]>
) {
  const foreignKeyName = getForeignKey(relationship)
  const shouldRemoveRelated = !!cascades.delete?.includes(relationship.name)

  let mappedBy: string | undefined = camelToSnakeCase(MikroORMEntity.name)
  if ("mappedBy" in relationship) {
    mappedBy = relationship.mappedBy
  }

  const oneToOneOptions = {
    entity: relatedModelName,
    fieldName: foreignKeyName,
    ...(relationship.nullable ? { nullable: relationship.nullable } : {}),
    ...(mappedBy ? { mappedBy } : {}),
    unique: false,
    //orphanRemoval: true,
  } as OneToOneOptions<any, any>

  if (shouldRemoveRelated) {
    oneToOneOptions.cascade = ["persist", "soft-remove"] as any
  }

  OneToOne(oneToOneOptions)(MikroORMEntity.prototype, relationship.name)

  Property({
    type: "string",
    columnType: "text",
    nullable: relationship.nullable,
    persist: false,
    formula(alias) {
      return alias + "." + foreignKeyName
    },
  })(MikroORMEntity.prototype, foreignKeyName)

  const hookFactory = function (
    name: string,
    type: "init" | "create" | "update",
    hookFn: Function
  ) {
    MikroORMEntity.prototype[name] = function (
      this: typeof MikroORMEntity.prototype
    ) {
      if (type !== "update") {
        // During creation
        const relationMeta = this.__meta.relations.find(
          (relation) => relation.name === relationship.name
        ).targetMeta
        this[relationship.name] ??= rel(
          relationMeta.class,
          this[foreignKeyName]
        )
        this[foreignKeyName] ??= this[relationship.name]?.id

        return
      }

      if (this[relationship.name]) {
        this[foreignKeyName] = this[relationship.name].id
      }

      if (this[relationship.name] === null) {
        this[foreignKeyName] = null
      }

      return
    }
    hookFn()(MikroORMEntity.prototype, name)
  }

  /**
   * Hook to handle foreign key assignation
   */
  hookFactory(
    `assignRelationFromForeignKeyValue${foreignKeyName}_init`,
    "init",
    OnInit
  )
  hookFactory(
    `assignRelationFromForeignKeyValue${foreignKeyName}_create`,
    "create",
    BeforeCreate
  )
  hookFactory(
    `assignRelationFromForeignKeyValue${foreignKeyName}_update`,
    "update",
    BeforeUpdate
  )
}

/**
 * Defines has many relationship on the Mikro ORM entity
 */
export function defineHasManyRelationship(
  MikroORMEntity: EntityConstructor<any>,
  relationship: RelationshipMetadata,
  { relatedModelName }: { relatedModelName: string },
  cascades: EntityCascades<string[], string[]>
) {
  const shouldRemoveRelated = !!cascades.delete?.includes(relationship.name)

  const options: Parameters<typeof OneToMany>[0] = {
    entity: relatedModelName,
    orphanRemoval: true,
    mappedBy: relationship.mappedBy || camelToSnakeCase(MikroORMEntity.name),
  }

  if (shouldRemoveRelated) {
    options.cascade = ["persist", "soft-remove"] as any
  }

  OneToMany(options)(MikroORMEntity.prototype, relationship.name)
}

/**
 * Defines belongs to relationship on the Mikro ORM entity. The belongsTo
 * relationship inspects the related entity for the other side of
 * the relationship and then uses one of the following Mikro ORM
 * relationship.
 *
 * - OneToOne: When the other side uses "hasOne" with "owner: true"
 * - ManyToOne: When the other side uses "hasMany"
 */
export function defineBelongsToRelationship(
  MikroORMEntity: EntityConstructor<any>,
  entity: DmlEntity<any, any>,
  relationship: RelationshipMetadata,
  relatedEntity: DmlEntity<
    Record<string, PropertyType<any> | RelationshipType<any>>,
    any
  >,
  { relatedModelName }: { relatedModelName: string }
) {
  const mappedBy =
    relationship.mappedBy || camelToSnakeCase(MikroORMEntity.name)
  const { schema: relationSchema, cascades: relationCascades } =
    relatedEntity.parse()

  const otherSideRelation = relationSchema[mappedBy]

  /**
   * In DML the relationships are cascaded from parent to child. A belongsTo
   * relationship is always a child, therefore we look at the parent and
   * define a deleteRule: cascade when we are included in the delete
   * list of parent cascade.
   */
  const shouldCascade = !!relationCascades.delete?.includes(mappedBy)

  function applyForeignKeyAssignationHooks(foreignKeyName: string) {
    const hookFactory = function (
      name: string,
      type: "init" | "create" | "update",
      hookFn: Function
    ) {
      MikroORMEntity.prototype[name] = function (
        this: typeof MikroORMEntity.prototype
      ) {
        /**
         * In case of has one relation, in order to be able to have both ways
         * to associate a relation (through the relation or the foreign key) we need to handle it
         * specifically
         */
        if (
          HasOne.isHasOne(otherSideRelation) ||
          HasOneWithForeignKey.isHasOneWithForeignKey(otherSideRelation)
        ) {
          if (type !== "update") {
            // During creation
            const relationMeta = this.__meta.relations.find(
              (relation) => relation.name === relationship.name
            ).targetMeta
            this[relationship.name] ??= rel(
              relationMeta.class,
              this[foreignKeyName]
            )
            this[foreignKeyName] ??= this[relationship.name]?.id

            return
          }

          if (this[relationship.name]) {
            this[foreignKeyName] = this[relationship.name].id
          }

          if (this[relationship.name] === null) {
            this[foreignKeyName] = null
          }

          return
        }

        /**
         * Do not override the existing foreign key value if
         * exists
         */
        if (this[foreignKeyName] !== undefined) {
          return
        }

        /**
         * Set the foreign key when the relationship is initialized
         * as null
         */
        if (this[relationship.name] === null) {
          this[foreignKeyName] = null
          return
        }

        /**
         * Set the foreign key when the relationship is initialized
         * and as the id
         */
        if (this[relationship.name] && "id" in this[relationship.name]) {
          this[foreignKeyName] = this[relationship.name].id
        }
      }
      hookFn()(MikroORMEntity.prototype, name)
    }

    /**
     * Hook to handle foreign key assignation
     */
    hookFactory(
      `assignRelationFromForeignKeyValue${foreignKeyName}_init`,
      "init",
      OnInit
    )
    hookFactory(
      `assignRelationFromForeignKeyValue${foreignKeyName}_create`,
      "create",
      BeforeCreate
    )
    hookFactory(
      `assignRelationFromForeignKeyValue${foreignKeyName}_update`,
      "update",
      BeforeUpdate
    )
  }

  /**
   * Otherside is a has many. Hence we should defined a ManyToOne
   */
  if (
    !otherSideRelation ||
    HasMany.isHasMany(otherSideRelation) ||
    DmlManyToMany.isManyToMany(otherSideRelation)
  ) {
    const foreignKeyName = getForeignKey(relationship)
    const detachCascade =
      !!relationship.mappedBy &&
      relationCascades.detach?.includes(relationship.mappedBy)

    if (DmlManyToMany.isManyToMany(otherSideRelation)) {
      Property({
        type: "string",
        columnType: "text",
        fieldName: foreignKeyName,
        nullable: relationship.nullable,
      })(MikroORMEntity.prototype, foreignKeyName)

      const conf = {
        entity: relatedModelName,
        nullable: relationship.nullable,
        persist: false,
      }
      if (shouldCascade || detachCascade) {
        conf["deleteRule"] = "cascade"
      }
      ManyToOne(conf)(MikroORMEntity.prototype, relationship.name)
    } else {
      const conf = {
        entity: relatedModelName,
        columnType: "text",
        mapToPk: true,
        fieldName: foreignKeyName,
        nullable: relationship.nullable,
      }
      if (shouldCascade) {
        conf["deleteRule"] = "cascade"
      }
      ManyToOne(conf)(MikroORMEntity.prototype, foreignKeyName)

      ManyToOne({
        entity: relatedModelName,
        fieldName: foreignKeyName,
        persist: false,
        nullable: relationship.nullable,
      })(MikroORMEntity.prototype, relationship.name)
    }

    const { tableName } = parseEntityName(entity)
    applyEntityIndexes(MikroORMEntity, tableName, [
      {
        on: [foreignKeyName],
        where: "deleted_at IS NULL",
      },
    ])
    applyForeignKeyAssignationHooks(foreignKeyName)
    return
  }

  /**
   * Otherside is a has one. Hence we should defined a OneToOne
   */
  if (
    HasOne.isHasOne(otherSideRelation) ||
    HasOneWithForeignKey.isHasOneWithForeignKey(otherSideRelation)
  ) {
    const foreignKeyName = getForeignKey(relationship)
    Property({
      columnType: "text",
      type: "string",
      nullable: relationship.nullable,
      persist: false,
      formula(alias) {
        return alias + "." + foreignKeyName
      },
    })(MikroORMEntity.prototype, foreignKeyName)

    const oneToOneOptions: Parameters<typeof OneToOne>[0] = {
      entity: relatedModelName,
      nullable: relationship.nullable,
      mappedBy: mappedBy,
      fieldName: foreignKeyName,
      owner: true,
      /**
       * If we decide to support non soft deletable then this should be true and the unique index id should be removed
       */
      unique: false,
      // orphanRemoval: true,
    }

    if (shouldCascade) {
      oneToOneOptions.deleteRule = "cascade"
      oneToOneOptions.cascade = [Cascade.PERSIST, "soft-remove"] as any
    }

    OneToOne(oneToOneOptions)(MikroORMEntity.prototype, relationship.name)

    const { tableName } = parseEntityName(entity)
    applyEntityIndexes(MikroORMEntity, tableName, [
      {
        on: [foreignKeyName],
        where: "deleted_at IS NULL",
        unique: true,
      },
    ])

    applyForeignKeyAssignationHooks(foreignKeyName)
    return
  }

  /**
   * Other side is some unsupported data-type
   */
  throw new Error(
    `Invalid relationship reference for "${mappedBy}" on "${relatedModelName}" entity. Make sure to define a hasOne or hasMany relationship`
  )
}

/**
 * Defines a many to many relationship on the Mikro ORM entity
 */
export function defineManyToManyRelationship(
  MikroORMEntity: EntityConstructor<any>,
  entity: DmlEntity<any, any>,
  relationship: RelationshipMetadata,
  relatedEntity: DmlEntity<
    Record<string, PropertyType<any> | RelationshipType<any>>,
    any
  >,
  {
    relatedModelName,
    pgSchema,
  }: {
    relatedModelName: string
    pgSchema: string | undefined
  },
  { MANY_TO_MANY_TRACKED_RELATIONS }: Context
) {
  let mappedBy = relationship.mappedBy
  let inversedBy: undefined | string
  let pivotEntityName: undefined | string
  let pivotTableName: undefined | string

  const joinColumn: undefined | string = !Array.isArray(
    relationship.options.joinColumn
  )
    ? relationship.options.joinColumn
    : undefined

  const joinColumns: undefined | string[] = Array.isArray(
    relationship.options.joinColumn
  )
    ? relationship.options.joinColumn
    : undefined

  const inverseJoinColumn: undefined | string = !Array.isArray(
    relationship.options.inverseJoinColumn
  )
    ? relationship.options.inverseJoinColumn
    : undefined

  const inverseJoinColumns: undefined | string[] = Array.isArray(
    relationship.options.inverseJoinColumn
  )
    ? relationship.options.inverseJoinColumn
    : undefined

  const [otherSideRelationshipProperty, otherSideRelationship] =
    retrieveOtherSideRelationshipManyToMany({
      relationship,
      relatedEntity,
      relatedModelName,
      entity,
    })

  /**
   * Validating other side of relationship when mapped by is defined
   */
  if (mappedBy) {
    if (!otherSideRelationship) {
      throw new Error(
        `Missing property "${mappedBy}" on "${relatedModelName}" entity. Make sure to define it as a relationship`
      )
    }

    if (!DmlManyToMany.isManyToMany(otherSideRelationship)) {
      throw new Error(
        `Invalid relationship reference for "${mappedBy}" on "${relatedModelName}" entity. Make sure to define a manyToMany relationship`
      )
    }
  } else {
    validateManyToManyRelationshipWithoutMappedBy({
      MikroORMEntity,
      relationship,
      relatedEntity,
      relatedModelName,
      entity,
    })
  }

  MANY_TO_MANY_TRACKED_RELATIONS[
    `${MikroORMEntity.name}.${relationship.name}`
  ] = true

  /**
   * Validating pivot entity when it is defined and computing
   * its name
   */
  if (relationship.options.pivotEntity) {
    if (typeof relationship.options.pivotEntity !== "function") {
      throw new Error(
        `Invalid pivotEntity reference for "${MikroORMEntity.name}.${relationship.name}". Make sure to define the pivotEntity using a factory function`
      )
    }

    const pivotEntity = relationship.options.pivotEntity()
    if (!DmlEntity.isDmlEntity(pivotEntity)) {
      throw new Error(
        `Invalid pivotEntity reference for "${MikroORMEntity.name}.${relationship.name}". Make sure to return a DML entity from the pivotEntity callback`
      )
    }

    pivotEntityName = parseEntityName(pivotEntity).modelName
  }

  const tableName = parseEntityName(entity).tableNameWithoutSchema
  const relatedTableName = parseEntityName(relatedEntity).tableNameWithoutSchema
  const sortedTableNames = [tableName, relatedTableName].sort()
  const otherSideRelationOptions = otherSideRelationship.parse("").options

  if (!pivotEntityName) {
    /**
     * Pivot table name is created as follows (when not explicitly provided)
     *
     * - Combining both the entity's names.
     * - Sorting them by alphabetical order
     * - Converting them from camelCase to snake_case.
     * - And finally pluralizing the second entity name.
     */

    pivotTableName =
      relationship.options.pivotTable ??
      otherSideRelationship.parse("").options.pivotTable ??
      sortedTableNames
        .map((token, index) => {
          if (index === 1) {
            return pluralize(token)
          }
          return token
        })
        .join("_")
  }

  let isOwner: boolean | undefined = undefined

  const configuresRelationship = !!(
    joinColumn ||
    joinColumns ||
    inverseJoinColumn ||
    inverseJoinColumns ||
    relationship.options.pivotTable
  )
  const relatedOneConfiguresRelationship = !!(
    otherSideRelationOptions.pivotTable ||
    otherSideRelationOptions.joinColumn ||
    otherSideRelationOptions.inverseJoinColumn
  )

  /**
   * Both sides are configuring the properties that must be on one
   * side only
   */
  if (configuresRelationship && relatedOneConfiguresRelationship) {
    throw new Error(
      `Invalid relationship reference for "${MikroORMEntity.name}.${relationship.name}". Define "pivotTable", "joinColumn", or "inverseJoinColumn" on only one side of the relationship`
    )
  }

  /**
   * If any of the following properties are provided, we consider
   * the current side to be the owner
   */
  if (configuresRelationship) {
    isOwner = true
  }

  /**
   * If any of the properties are provided on the other side,
   * then we do not expect the current side to be the owner
   */
  if (isOwner === undefined && relatedOneConfiguresRelationship) {
    isOwner = false
  }

  /**
   * Finally, we consider the current side as owner, if it is
   * the first one in alphabetical order. The same logic is
   * applied to pivot table name as well.
   */
  isOwner ??= sortedTableNames[0] === tableName

  const mappedByProp = isOwner ? "inversedBy" : "mappedBy"
  const mappedByPropValue =
    mappedBy ?? inversedBy ?? otherSideRelationshipProperty

  const joinColumnProp = Array.isArray(relationship.options.joinColumn)
    ? "joinColumns"
    : "joinColumn"
  const inverseJoinColumnProp = Array.isArray(
    relationship.options.inverseJoinColumn
  )
    ? "inverseJoinColumns"
    : "inverseJoinColumn"

  const manytoManyOptions = {
    owner: isOwner,
    entity: relatedModelName,
    ...(pivotTableName
      ? {
          pivotTable: pgSchema
            ? `${pgSchema}.${pivotTableName}`
            : pivotTableName,
        }
      : {}),
    ...(pivotEntityName ? { pivotEntity: pivotEntityName } : {}),
    ...({ [mappedByProp]: mappedByPropValue } as any),
  } as any

  if (joinColumn || joinColumns) {
    manytoManyOptions[joinColumnProp] = joinColumn ?? joinColumns
  }

  if (inverseJoinColumn || inverseJoinColumns) {
    manytoManyOptions[inverseJoinColumnProp] =
      inverseJoinColumn ?? inverseJoinColumns
  }

  ManyToMany(manytoManyOptions)(MikroORMEntity.prototype, relationship.name)
}

/**
 * Defines a DML entity schema field as a Mikro ORM relationship
 */
export function defineRelationship(
  MikroORMEntity: EntityConstructor<any>,
  entity: DmlEntity<any, any>,
  relationship: RelationshipMetadata,
  cascades: EntityCascades<string[], string[]>,
  context: Context
) {
  /**
   * We expect the relationship.entity to be a function that
   * lazily returns the related entity
   */
  const relatedEntity =
    typeof relationship.entity === "function"
      ? (relationship.entity() as unknown)
      : undefined

  /**
   * Since we don't type-check relationships, we should validate
   * them at runtime
   */
  if (!relatedEntity) {
    throw new Error(
      `Invalid relationship reference for "${MikroORMEntity.name}.${relationship.name}". Make sure to define the relationship using a factory function`
    )
  }

  /**
   * Ensure the return value is a DML entity instance
   */
  if (!DmlEntity.isDmlEntity(relatedEntity)) {
    throw new Error(
      `Invalid relationship reference for "${MikroORMEntity.name}.${relationship.name}". Make sure to return a DML entity from the relationship callback`
    )
  }

  const { modelName, tableName, pgSchema } = parseEntityName(relatedEntity)
  const relatedEntityInfo = {
    relatedModelName: modelName,
    relatedTableName: tableName,
    pgSchema,
  }

  /**
   * Defining relationships
   */
  switch (relationship.type) {
    case "hasOne":
      defineHasOneRelationship(
        MikroORMEntity,
        relationship,
        relatedEntity,
        relatedEntityInfo,
        cascades
      )
      break
    case "hasOneWithFK":
      defineHasOneWithFKRelationship(
        MikroORMEntity,
        entity,
        relationship,
        relatedEntityInfo,
        cascades
      )
      break
    case "hasMany":
      defineHasManyRelationship(
        MikroORMEntity,
        relationship,
        relatedEntityInfo,
        cascades
      )
      break
    case "belongsTo":
      defineBelongsToRelationship(
        MikroORMEntity,
        entity,
        relationship,
        relatedEntity,
        relatedEntityInfo
      )
      break
    case "manyToMany":
      defineManyToManyRelationship(
        MikroORMEntity,
        entity,
        relationship,
        relatedEntity,
        relatedEntityInfo,
        context
      )
      break
  }
}
