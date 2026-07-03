import { CrossModuleJoinSpec, FindConfigOrder } from "@medusajs/types"
import { raw } from "@medusajs/deps/mikro-orm/core"
import { isObject } from "../../../common"
import {
  buildJoinCorrelationSql,
  buildJoinSoftDeleteSql,
  buildLinkToTargetJoinSql,
  qualifyTable,
  quoteIdentifier,
} from "./helpers"

export function transformOrderByForCrossModuleJoins(
  orderBy: FindConfigOrder | FindConfigOrder[] | undefined,
  crossModuleJoins: CrossModuleJoinSpec[],
  primaryKey: string,
  rootAlias: string,
  defaultSchema: string,
  withDeleted: boolean
): FindConfigOrder | FindConfigOrder[] | undefined {
  if (!orderBy) {
    return orderBy
  }

  if (Array.isArray(orderBy)) {
    return orderBy.map((entry) =>
      transformOrderByObject(
        entry,
        crossModuleJoins,
        primaryKey,
        rootAlias,
        defaultSchema,
        withDeleted
      )
    )
  }

  return transformOrderByObject(
    orderBy,
    crossModuleJoins,
    primaryKey,
    rootAlias,
    defaultSchema,
    withDeleted
  )
}

function transformOrderByObject(
  orderBy: FindConfigOrder,
  crossModuleJoins: CrossModuleJoinSpec[],
  primaryKey: string,
  rootAlias: string,
  defaultSchema: string,
  withDeleted: boolean
): FindConfigOrder {
  const transformed: FindConfigOrder = {}

  for (const [key, direction] of Object.entries(orderBy)) {
    if (direction === "ASC" || direction === "DESC") {
      const [alias, ...rest] = key.split(".")
      const join =
        rest.length > 0
          ? getJoinSpecByAlias(crossModuleJoins, alias)
          : undefined

      if (join) {
        transformed[
          buildOrderByScalarSubquery(
            join.joinSpec,
            join.index,
            rest.join("."),
            primaryKey,
            rootAlias,
            defaultSchema,
            withDeleted
          ) as unknown as string
        ] = direction
      } else {
        transformed[key] = direction
      }
      continue
    }

    if (isObject(direction)) {
      transformed[key] = transformOrderByObject(
        direction as FindConfigOrder,
        crossModuleJoins,
        primaryKey,
        rootAlias,
        defaultSchema,
        withDeleted
      )
    }
  }

  return transformed
}

function buildOrderByScalarSubquery(
  joinSpec: CrossModuleJoinSpec,
  index: number,
  field: string,
  primaryKey: string,
  rootAlias: string,
  defaultSchema: string,
  withDeleted: boolean
): ReturnType<typeof raw> {
  const linkAlias = `cm_order_link_${index}`
  const targetAlias = joinSpec.alias
  const linkTable = qualifyTable(
    joinSpec.link.schema,
    joinSpec.link.table,
    defaultSchema
  )
  const targetTable = qualifyTable(
    joinSpec.target.schema,
    joinSpec.target.table,
    defaultSchema
  )
  const targetPrimaryKey = joinSpec.target.primaryKey ?? "id"

  const clauses = [
    buildJoinCorrelationSql(joinSpec, linkAlias, rootAlias, primaryKey),
    buildLinkToTargetJoinSql(
      linkAlias,
      targetAlias,
      joinSpec.link.targetKey,
      targetPrimaryKey
    ),
    buildJoinSoftDeleteSql(linkAlias, targetAlias, withDeleted),
  ].filter(Boolean)

  // For to-many links more than one target row can match. Order by the
  // target primary key so the single picked value is deterministic across
  // executions instead of relying on the storage engine's row order.
  const sql = `(select ${quoteIdentifier(targetAlias)}.${quoteIdentifier(
    field
  )} from ${linkTable} as ${quoteIdentifier(
    linkAlias
  )} inner join ${targetTable} as ${quoteIdentifier(
    targetAlias
  )} on true where ${clauses.join(" and ")} order by ${quoteIdentifier(
    targetAlias
  )}.${quoteIdentifier(targetPrimaryKey)} limit 1)`

  return raw(sql)
}

function getJoinSpecByAlias(
  crossModuleJoins: CrossModuleJoinSpec[],
  alias: string
): { joinSpec: CrossModuleJoinSpec; index: number } | undefined {
  const index = crossModuleJoins.findIndex((join) => join.alias === alias)
  if (index === -1) {
    return undefined
  }

  return {
    joinSpec: crossModuleJoins[index],
    index,
  }
}
