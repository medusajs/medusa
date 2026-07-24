import { raw } from "@medusajs/deps/mikro-orm/core"
import { FindConfigOrder } from "@medusajs/types"
import { isObject } from "../../../common"
import {
  buildLinkCorrelationSql,
  buildLinkSoftDeleteSql,
  buildLinkToTargetJoinSql,
  buildTargetCorrelationSql,
  buildTargetSoftDeleteSql,
  CorrelateSpec,
  getTargetPrimaryKey,
  inferLinkType,
  LinkType,
  qualifyTable,
  quoteIdentifier,
  ResolvedCrossModuleJoinSpec,
} from "./helpers"

export function transformOrderByForCrossModuleJoins(
  orderBy: FindConfigOrder | FindConfigOrder[] | undefined,
  crossModuleJoins: ResolvedCrossModuleJoinSpec[],
  correlateSpec: CorrelateSpec,
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
        correlateSpec,
        defaultSchema,
        withDeleted
      )
    )
  }

  return transformOrderByObject(
    orderBy,
    crossModuleJoins,
    correlateSpec,
    defaultSchema,
    withDeleted
  )
}

function transformOrderByObject(
  orderBy: FindConfigOrder,
  crossModuleJoins: ResolvedCrossModuleJoinSpec[],
  correlateSpec: CorrelateSpec,
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
            correlateSpec,
            join.index,
            rest.join("."),
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
        correlateSpec,
        defaultSchema,
        withDeleted
      )
    }
  }

  return transformed
}

function buildOrderByScalarSubquery(
  joinSpec: ResolvedCrossModuleJoinSpec,
  correlateSpec: CorrelateSpec,
  index: number,
  field: string,
  defaultSchema: string,
  withDeleted: boolean
): ReturnType<typeof raw> {
  const linkType = inferLinkType(joinSpec, correlateSpec)

  const targetPrimaryKey = getTargetPrimaryKey(joinSpec)
  if (field === targetPrimaryKey && linkType === "pivot") {
    return buildTargetIdOnlyOrderSql(
      joinSpec,
      correlateSpec,
      index,
      defaultSchema,
      withDeleted
    )
  }

  if (linkType === "pivot") {
    return buildPivotLinkOrderSql(
      joinSpec,
      correlateSpec,
      index,
      field,
      defaultSchema,
      withDeleted
    )
  } else {
    return buildNoLinkOrderSql(
      joinSpec,
      correlateSpec,
      field,
      defaultSchema,
      withDeleted,
      linkType
    )
  }
}

function buildTargetIdOnlyOrderSql(
  joinSpec: ResolvedCrossModuleJoinSpec,
  correlateSpec: CorrelateSpec,
  index: number,
  defaultSchema: string,
  withDeleted: boolean
): ReturnType<typeof raw> {
  const linkAlias = `cm_order_link_${index}`
  const linkTable = qualifyTable(
    joinSpec.link.schema,
    joinSpec.link.table,
    defaultSchema
  )

  const clauses = [
    buildLinkCorrelationSql(joinSpec, correlateSpec, linkAlias),
    buildLinkSoftDeleteSql(linkAlias, withDeleted),
  ].filter(Boolean)

  return raw(
    `(select ${quoteIdentifier(linkAlias)}.${quoteIdentifier(
      joinSpec.link.targetKey
    )} from ${linkTable} as ${quoteIdentifier(linkAlias)} where ${clauses.join(
      " and "
    )} order by ${quoteIdentifier(linkAlias)}.${quoteIdentifier(
      joinSpec.link.targetKey
    )} limit 1)`
  )
}

function buildPivotLinkOrderSql(
  joinSpec: ResolvedCrossModuleJoinSpec,
  correlateSpec: CorrelateSpec,
  index: number,
  field: string,
  defaultSchema: string,
  withDeleted: boolean
): ReturnType<typeof raw> {
  const linkAlias = `cm_order_link_${index}`
  const linkTable = qualifyTable(
    joinSpec.link.schema,
    joinSpec.link.table,
    defaultSchema
  )
  const targetAlias = joinSpec.alias
  const targetTable = qualifyTable(
    joinSpec.target.schema,
    joinSpec.target.table,
    defaultSchema
  )
  const targetPrimaryKey = getTargetPrimaryKey(joinSpec)

  const clauses: string[] = [
    buildLinkCorrelationSql(joinSpec, correlateSpec, linkAlias),
    buildLinkToTargetJoinSql(joinSpec, linkAlias, targetAlias),
    buildLinkSoftDeleteSql(linkAlias, withDeleted),
    buildTargetSoftDeleteSql(targetAlias, withDeleted),
  ]

  /*
   * Currently links always use a pivot table, even for 1-to-1 relationships, and the checks
   * on them are done in the application layer. Because of that, we essentially suport a to-many
   * sorting behavior, which is not ideal.
   */
  return raw(
    `(select ${quoteIdentifier(targetAlias)}.${quoteIdentifier(
      field
    )} from ${linkTable} as ${quoteIdentifier(
      linkAlias
    )} inner join ${targetTable} as ${quoteIdentifier(
      targetAlias
    )} on true where ${clauses.join(" and ")} order by ${quoteIdentifier(
      targetAlias
    )}.${quoteIdentifier(targetPrimaryKey)} limit 1)`
  )
}

function buildNoLinkOrderSql(
  joinSpec: ResolvedCrossModuleJoinSpec,
  correlateSpec: CorrelateSpec,
  field: string,
  defaultSchema: string,
  withDeleted: boolean,
  linkType: Exclude<LinkType, "normal">
): ReturnType<typeof raw> {
  const targetAlias = joinSpec.alias
  const targetTable = qualifyTable(
    joinSpec.target.schema,
    joinSpec.target.table,
    defaultSchema
  )
  const targetPrimaryKey = getTargetPrimaryKey(joinSpec)

  const clauses: string[] = [
    buildTargetCorrelationSql(joinSpec, correlateSpec, targetAlias, linkType),
    buildTargetSoftDeleteSql(targetAlias, withDeleted),
  ]

  return raw(
    `(select ${quoteIdentifier(targetAlias)}.${quoteIdentifier(
      field
    )} from ${targetTable} as ${quoteIdentifier(
      targetAlias
    )} where ${clauses.join(" and ")} order by ${quoteIdentifier(
      targetAlias
    )}.${quoteIdentifier(targetPrimaryKey)} limit 1)`
  )
}

function getJoinSpecByAlias(
  crossModuleJoins: ResolvedCrossModuleJoinSpec[],
  alias: string
): { joinSpec: ResolvedCrossModuleJoinSpec; index: number } | undefined {
  const index = crossModuleJoins.findIndex((join) => join.alias === alias)
  if (index === -1) {
    return undefined
  }

  return {
    joinSpec: crossModuleJoins[index],
    index,
  }
}
