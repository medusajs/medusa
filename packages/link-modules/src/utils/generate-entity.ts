import { JoinerRelationship, ModuleJoinerConfig } from "@medusajs/types"
import { SoftDeletableFilterKey, simpleHash } from "@medusajs/utils"

import { EntitySchema } from "@mikro-orm/core"
import { composeTableName } from "./compose-link-name"

function getClass(...properties) {
  return class PivotModel {
    constructor(...values) {
      properties.forEach((name, idx) => {
        this[name] = values[idx]
      })
    }
  }
}

interface FilterArguments {
  withDeleted?: boolean
}

export function generateEntity(
  joinerConfig: ModuleJoinerConfig,
  primary: JoinerRelationship,
  foreign: JoinerRelationship
) {
  const fieldNames = primary.foreignKey.split(",").concat(foreign.foreignKey)

  const tableName =
    joinerConfig.tableName ??
    composeTableName(
      primary.serviceName,
      primary.foreignKey,
      foreign.serviceName,
      foreign.foreignKey
    )

  const fields = fieldNames.reduce((acc, curr) => {
    acc[curr] = {
      type: "string",
      nullable: false,
      primary: true,
    }
    return acc
  }, {})

  return new EntitySchema({
    class: getClass(
      ...fieldNames.concat("created_at", "updated_at", "deleted_at")
    ) as any,
    tableName,
    properties: {
      ...fields,
      created_at: {
        type: "Date",
        nullable: false,
        defaultRaw: "CURRENT_TIMESTAMP",
      },
      updated_at: {
        type: "Date",
        nullable: false,
        defaultRaw: "CURRENT_TIMESTAMP",
      },
      deleted_at: { type: "Date", nullable: true },
    },
    filters: {
      notDeleted: {
        name: SoftDeletableFilterKey,
        cond: ({ withDeleted }: FilterArguments = {}) => {
          if (withDeleted) {
            return {}
          }
          return {
            deleted_at: null,
          }
        },
        default: true,
      },
    },
    indexes: [
      {
        properties: primary.foreignKey.split(","),
        name:
          "IDX_" +
          primary.foreignKey.split(",").join("_") +
          "_" +
          simpleHash(tableName),
      },
      {
        properties: foreign.foreignKey,
        name: "IDX_" + foreign.foreignKey + "_" + simpleHash(tableName),
      },
      {
        properties: ["deleted_at"],
        name: "IDX_deleted_at_" + simpleHash(tableName),
      },
    ],
  })
}
