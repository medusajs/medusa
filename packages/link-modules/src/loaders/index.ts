import { JoinerRelationship, ModuleJoinerConfig } from "@medusajs/types"

import { EntitySchema } from "@mikro-orm/core"
import { composeTableName } from "../utils"
import { connectionLoader } from "./connection"
import { containerLoader } from "./container"

function getClass(...properties) {
  return class PivotModel {
    constructor(...values) {
      properties.forEach((name, idx) => {
        this[name] = values[idx]
      })
    }
  }
}

function generateEntity(
  primary: JoinerRelationship,
  foreign: JoinerRelationship
) {
  const fieldNames = primary.foreignKey
    .split(",")
    .concat(foreign.foreignKey.split(","))

  const tableName = composeTableName(
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
        default: "CURRENT_TIMESTAMP",
        nullable: false,
      },
      updated_at: {
        type: "Date",
        default: "CURRENT_TIMESTAMP",
        nullable: false,
      },
      deleted_at: { type: "Date", nullable: true },
    },
    indexes: [
      {
        properties: primary.foreignKey.includes(",")
          ? primary.foreignKey.split(",")
          : primary.foreignKey,
        name: "IDX_" + primary.foreignKey.split(",").join("_"),
      },
      {
        properties: foreign.foreignKey.includes(",")
          ? foreign.foreignKey.split(",")
          : foreign.foreignKey,
        name: "IDX_" + foreign.foreignKey.split(",").join("_"),
      },
    ],
  })
}

export function getLoaders({
  primary,
  foreign,
  joinerConfig,
}: {
  joinerConfig: ModuleJoinerConfig
  primary: JoinerRelationship
  foreign: JoinerRelationship
}) {
  const entity = generateEntity(primary, foreign)
  return [connectionLoader(entity), containerLoader(entity, joinerConfig)]
}
