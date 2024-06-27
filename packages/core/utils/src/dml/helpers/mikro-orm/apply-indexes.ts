import {
  EntityConstructor,
  EntityIndex,
  PropertyMetadata,
} from "@medusajs/types"
import { MetadataStorage } from "@mikro-orm/core"
import { createPsqlIndexStatementHelper } from "../../../common"
import { validateIndexFields } from "../mikro-orm/build-indexes"

/**
 * Creates indexes for a given field
 */
export function applyIndexes(
  MikroORMEntity: EntityConstructor<any>,
  tableName: string,
  field: PropertyMetadata
) {
  field.indexes.forEach((index) => {
    const providerEntityIdIndexStatement = createPsqlIndexStatementHelper({
      tableName,
      columns: [field.fieldName],
      unique: index.type === "unique",
      where: "deleted_at IS NULL",
    })

    providerEntityIdIndexStatement.MikroORMIndex()(MikroORMEntity)
  })
}

/**
 * Creates indexes for a MikroORM entity
 *
 * Default Indexes:
 *  - Foreign key indexes will be applied to all manyToOne relationships.
 */
export function applyEntityIndexes(
  MikroORMEntity: EntityConstructor<any>,
  tableName: string,
  entityIndexes: EntityIndex[]
) {
  const foreignKeyIndexes = applyForeignKeyIndexes(MikroORMEntity)
  const indexes = [...entityIndexes, ...foreignKeyIndexes]

  indexes.forEach((index) => {
    validateIndexFields(MikroORMEntity, index)

    const entityIndexStatement = createPsqlIndexStatementHelper({
      tableName,
      name: index.name,
      columns: index.on as string[],
      unique: index.unique,
      where: index.where,
    })

    entityIndexStatement.MikroORMIndex()(MikroORMEntity)
  })
}

/*
  When a "oneToMany" relationship is found on the MikroORM entity, we create an index by default
  on the foreign key property.
*/
function applyForeignKeyIndexes(MikroORMEntity: EntityConstructor<any>) {
  const foreignKeyIndexes: EntityIndex[] = []

  for (const foreignKey of getEntityForeignKeys(MikroORMEntity)) {
    foreignKeyIndexes.push({
      on: [foreignKey],
      where: "deleted_at IS NULL",
    })
  }

  return foreignKeyIndexes
}

function getEntityForeignKeys(MikroORMEntity: EntityConstructor<any>) {
  const properties =
    MetadataStorage.getMetadataFromDecorator(MikroORMEntity).properties

  return Object.keys(properties).filter(
    (propertyName) => properties[propertyName].isForeignKey
  )
}
