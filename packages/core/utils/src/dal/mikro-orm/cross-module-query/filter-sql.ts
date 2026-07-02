import { CrossModuleJoinSpec } from "@medusajs/types"
import { raw } from "@medusajs/deps/mikro-orm/core"
import { Knex } from "@medusajs/deps/mikro-orm/knex"
import { isObject } from "../../../common"
import {
  buildJoinCorrelationSql,
  buildJoinSoftDeleteSql,
  buildLinkToTargetJoinSql,
  qualifyTable,
  quoteIdentifier,
  SqlFragment,
} from "./helpers"

export type JoinSqlContext = {
  linkAliasCounter: { value: number }
  childrenByParent: Map<string, CrossModuleJoinSpec[]>
  defaultSchema: string
  withDeleted: boolean
}

export function buildFilterSql(
  alias: string,
  filters: Record<string, any>
): SqlFragment {
  const clauses: string[] = []
  const bindings: Knex.RawBinding[] = []

  for (const [key, value] of Object.entries(filters)) {
    if (key === "$and" && Array.isArray(value)) {
      for (const condition of value) {
        const nested = buildFilterSql(alias, condition)
        // Skip conditions that produced no SQL to avoid emitting `()`.
        if (!nested.sql) {
          continue
        }
        clauses.push(`(${nested.sql})`)
        bindings.push(...nested.bindings)
      }
      continue
    }

    if (key === "$or" && Array.isArray(value)) {
      const nestedClauses: string[] = []
      const nestedBindings: Knex.RawBinding[] = []
      for (const condition of value) {
        const nested = buildFilterSql(alias, condition)
        // Skip conditions that produced no SQL to avoid emitting empty
        // groups like `()`, which are invalid SQL.
        if (!nested.sql) {
          continue
        }
        nestedClauses.push(`(${nested.sql})`)
        nestedBindings.push(...nested.bindings)
      }
      // An empty (or fully-undefined) `$or` places no constraint at all.
      if (!nestedClauses.length) {
        continue
      }
      clauses.push(`(${nestedClauses.join(" or ")})`)
      bindings.push(...nestedBindings)
      continue
    }

    const column = `${quoteIdentifier(alias)}.${quoteIdentifier(key)}`

    if (value === null) {
      clauses.push(`${column} is null`)
      continue
    }

    if (value === undefined) {
      continue
    }

    if (Array.isArray(value)) {
      const placeholders = value.map(() => "?").join(", ")
      clauses.push(`${column} in (${placeholders})`)
      bindings.push(...value)
      continue
    }

    if (isObject(value)) {
      const operatorKeys = Object.keys(value).filter((operator) =>
        operator.startsWith("$")
      )

      if (operatorKeys.length) {
        for (const [operator, operatorValue] of Object.entries(value)) {
          const operatorSql = buildOperatorSql(
            column,
            operator,
            operatorValue,
            bindings
          )
          if (operatorSql) {
            clauses.push(operatorSql)
          }
        }
        continue
      }
    }

    clauses.push(`${column} = ?`)
    bindings.push(value as Knex.RawBinding)
  }

  return {
    sql: clauses.join(" and "),
    bindings,
  }
}

export function joinRequiresFilter(
  joinSpec: CrossModuleJoinSpec,
  childrenByParent: Map<string, CrossModuleJoinSpec[]>
): boolean {
  if (hasTargetFilters(joinSpec)) {
    return true
  }

  const children = childrenByParent.get(joinSpec.alias) ?? []
  return children.some((child) => joinRequiresFilter(child, childrenByParent))
}

export function buildExistsFilter(
  joinSpec: CrossModuleJoinSpec,
  correlateAlias: string,
  correlateKey: string,
  context: JoinSqlContext
): Record<string, unknown> {
  const fragment = buildExistsSql(
    joinSpec,
    correlateAlias,
    correlateKey,
    context
  )

  return {
    [raw(fragment.sql, fragment.bindings)]: [],
  }
}

function buildExistsSql(
  joinSpec: CrossModuleJoinSpec,
  correlateAlias: string,
  correlateKey: string,
  context: JoinSqlContext
): SqlFragment {
  const linkAlias = nextLinkAlias(context)
  const targetAlias = joinSpec.alias
  const linkTable = qualifyTable(
    joinSpec.link.schema,
    joinSpec.link.table,
    context.defaultSchema
  )
  const targetTable = qualifyTable(
    joinSpec.target.schema,
    joinSpec.target.table,
    context.defaultSchema
  )
  const targetPrimaryKey = joinSpec.target.primaryKey ?? "id"

  const bindings: Knex.RawBinding[] = []
  const clauses = [
    buildJoinCorrelationSql(joinSpec, linkAlias, correlateAlias, correlateKey),
    buildLinkToTargetJoinSql(
      linkAlias,
      targetAlias,
      joinSpec.link.targetKey,
      targetPrimaryKey
    ),
    buildJoinSoftDeleteSql(linkAlias, targetAlias, context.withDeleted),
  ]

  if (hasTargetFilters(joinSpec)) {
    const targetFilters = buildFilterSql(
      targetAlias,
      joinSpec.target.filters as Record<string, any>
    )
    clauses.push(targetFilters.sql)
    bindings.push(...targetFilters.bindings)
  }

  const children = context.childrenByParent.get(joinSpec.alias) ?? []
  for (const child of children) {
    if (!joinRequiresFilter(child, context.childrenByParent)) {
      continue
    }

    const nested = buildExistsSql(child, targetAlias, targetPrimaryKey, context)

    if (nested.sql) {
      clauses.push(nested.sql)
      bindings.push(...nested.bindings)
    }
  }

  const sql = `exists (select 1 from ${linkTable} as ${quoteIdentifier(
    linkAlias
  )} inner join ${targetTable} as ${quoteIdentifier(
    targetAlias
  )} on true where ${clauses.filter(Boolean).join(" and ")})`

  return {
    sql,
    bindings,
  }
}

function nextLinkAlias(context: JoinSqlContext): string {
  return `cm_link_${context.linkAliasCounter.value++}`
}

function hasTargetFilters(joinSpec: CrossModuleJoinSpec): boolean {
  return (
    !!joinSpec.target.filters && Object.keys(joinSpec.target.filters).length > 0
  )
}

function buildOperatorSql(
  column: string,
  operator: string,
  value: unknown,
  bindings: Knex.RawBinding[]
): string | undefined {
  switch (operator) {
    case "$eq":
      if (value === null) {
        return `${column} is null`
      }
      bindings.push(value as Knex.RawBinding)
      return `${column} = ?`
    case "$ne":
      if (value === null) {
        return `${column} is not null`
      }
      bindings.push(value as Knex.RawBinding)
      return `${column} <> ?`
    case "$in": {
      const values = (value as Knex.RawBinding[]) ?? []
      if (!values.length) {
        return "1 = 0"
      }
      const placeholders = values.map(() => "?").join(", ")
      bindings.push(...values)
      return `${column} in (${placeholders})`
    }
    case "$nin": {
      const values = (value as Knex.RawBinding[]) ?? []
      if (!values.length) {
        return undefined
      }
      const placeholders = values.map(() => "?").join(", ")
      bindings.push(...values)
      return `${column} not in (${placeholders})`
    }
    case "$gt":
      bindings.push(value as Knex.RawBinding)
      return `${column} > ?`
    case "$gte":
      bindings.push(value as Knex.RawBinding)
      return `${column} >= ?`
    case "$lt":
      bindings.push(value as Knex.RawBinding)
      return `${column} < ?`
    case "$lte":
      bindings.push(value as Knex.RawBinding)
      return `${column} <= ?`
    case "$like":
      bindings.push(value as Knex.RawBinding)
      return `${column} like ?`
    case "$ilike":
      bindings.push(value as Knex.RawBinding)
      return `${column} ilike ?`
    case "$is":
      if (value === null) {
        return `${column} is null`
      }
      bindings.push(value as Knex.RawBinding)
      return `${column} is ?`
    default:
      if (OPERATOR_MAP[operator]) {
        bindings.push(value as Knex.RawBinding)
        return `${column} ${OPERATOR_MAP[operator]} ?`
      }
      return undefined
  }
}

const OPERATOR_MAP: Record<string, string> = {
  $eq: "=",
  $ne: "!=",
  $in: "in",
  $nin: "not in",
  $gt: ">",
  $gte: ">=",
  $lt: "<",
  $lte: "<=",
  $like: "like",
  $ilike: "ilike",
  $is: "is",
}
