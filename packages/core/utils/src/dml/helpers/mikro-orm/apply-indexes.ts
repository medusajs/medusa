import {
  EntityConstructor,
  EntityIndex,
  PropertyMetadata,
} from "@zjedene-medusa/types"
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
      name: index.name,
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
  entityIndexes: EntityIndex[] = []
) {
  const indexes = [...entityIndexes]

  indexes.forEach((index) => {
    validateIndexFields(MikroORMEntity, index)

    const entityIndexStatement = createPsqlIndexStatementHelper({
      tableName,
      name: index.name,
      columns: index.on as string[],
      unique: index.unique,
      where: index.where,
      type: index.type,
    })

    entityIndexStatement.MikroORMIndex()(MikroORMEntity)
  })
}
