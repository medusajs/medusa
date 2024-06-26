import {
  EntityConstructor,
  EntityIndex,
  PropertyMetadata,
} from "@medusajs/types"
import { createPsqlIndexStatementHelper } from "../../../common"
import { validateIndexFields } from "../mikro-orm/build-indexes"

/**
 * Prepares indexes for a given field
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
 * Prepares indexes for a given field
 */
export function applyEntityIndexes(
  MikroORMEntity: EntityConstructor<any>,
  tableName: string,
  indexes: EntityIndex[]
) {
  indexes.forEach((index) => {
    validateIndexFields(MikroORMEntity, index)

    const providerEntityIdIndexStatement = createPsqlIndexStatementHelper({
      tableName,
      name: index.name,
      columns: index.on as string[],
      unique: index.unique,
      where: index.where,
    })

    providerEntityIdIndexStatement.MikroORMIndex()(MikroORMEntity)
  })
}
