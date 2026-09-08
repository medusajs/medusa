import { raw } from "@medusajs/deps/mikro-orm/core"
import { Knex } from "@medusajs/deps/mikro-orm/knex"
import { isObject, MedusaError } from "../../../common"
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
  SqlFragment,
} from "./helpers"

export type JoinSqlContext = {
  linkAliasCounter: { value: number }
  childrenByParent: Map<string, ResolvedCrossModuleJoinSpec[]>
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
      const inArraySql = buildInArraySql(column, value, false)
      if (inArraySql) {
        clauses.push(inArraySql.sql)
        bindings.push(...inArraySql.bindings)
      }
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
  joinSpec: ResolvedCrossModuleJoinSpec,
  childrenByParent: Map<string, ResolvedCrossModuleJoinSpec[]>
): boolean {
  if (hasTargetFilters(joinSpec)) {
    return true
  }

  const children = childrenByParent.get(joinSpec.alias) ?? []
  return children.some((child) => joinRequiresFilter(child, childrenByParent))
}

export function buildExistsFilter(
  joinSpec: ResolvedCrossModuleJoinSpec,
  correlateSpec: CorrelateSpec,
  context: JoinSqlContext
): Record<string, unknown> {
  const fragment = buildExistsSql(joinSpec, correlateSpec, context)

  return {
    [raw(fragment.sql, fragment.bindings)]: [],
  }
}

function buildExistsSql(
  joinSpec: ResolvedCrossModuleJoinSpec,
  correlateSpec: CorrelateSpec,
  context: JoinSqlContext
): SqlFragment {
  const linkType = inferLinkType(joinSpec, correlateSpec)
  const targetPrimaryKey = getTargetPrimaryKey(joinSpec)

  // An optimization for filters that only apply on the target's primary key, useful to support these filters on non-DB external modules
  const onlyTargetIdFilters =
    !!joinSpec.target.filters &&
    Object.keys(joinSpec.target.filters).length === 1 &&
    joinSpec.target.filters[targetPrimaryKey] !== undefined
  if (onlyTargetIdFilters && linkType === "pivot") {
    return buildTargetIdOnlyExistsSql(joinSpec, correlateSpec, context)
  }

  if (linkType === "pivot") {
    return buildPivotLinkExistsSql(joinSpec, correlateSpec, context)
  } else {
    return buildNoLinkExistsSql(joinSpec, correlateSpec, context, linkType)
  }
}

function buildTargetIdOnlyExistsSql(
  joinSpec: ResolvedCrossModuleJoinSpec,
  correlateSpec: CorrelateSpec,
  context: JoinSqlContext
): SqlFragment {
  const targetPrimaryKey = getTargetPrimaryKey(joinSpec)
  const linkAlias = nextLinkAlias(context)
  const linkTable = qualifyTable(
    joinSpec.link.schema,
    joinSpec.link.table,
    context.defaultSchema
  )

  const bindings: Knex.RawBinding[] = []
  const clauses: string[] = [
    buildLinkCorrelationSql(joinSpec, correlateSpec, linkAlias),
    buildLinkSoftDeleteSql(linkAlias, context.withDeleted),
  ]

  const linkFilters = buildFilterSql(linkAlias, {
    [joinSpec.link.targetKey]: joinSpec.target.filters?.[targetPrimaryKey],
  })
  clauses.push(linkFilters.sql)
  bindings.push(...linkFilters.bindings)

  const sql = `exists (select 1 from ${linkTable} as ${quoteIdentifier(
    linkAlias
  )} where ${clauses.filter(Boolean).join(" and ")})`

  return { sql, bindings }
}

function buildPivotLinkExistsSql(
  joinSpec: ResolvedCrossModuleJoinSpec,
  correlateSpec: CorrelateSpec,
  context: JoinSqlContext
): SqlFragment {
  const linkAlias = nextLinkAlias(context)
  const linkTable = qualifyTable(
    joinSpec.link.schema,
    joinSpec.link.table,
    context.defaultSchema
  )
  const targetAlias = joinSpec.alias
  const targetTable = qualifyTable(
    joinSpec.target.schema,
    joinSpec.target.table,
    context.defaultSchema
  )

  const bindings: Knex.RawBinding[] = []
  const clauses: string[] = [
    buildLinkCorrelationSql(joinSpec, correlateSpec, linkAlias),
    buildLinkToTargetJoinSql(joinSpec, linkAlias, targetAlias),
    buildLinkSoftDeleteSql(linkAlias, context.withDeleted),
    buildTargetSoftDeleteSql(targetAlias, context.withDeleted),
  ]

  const targetFilters = getTargetFilters(joinSpec, targetAlias, context)
  clauses.push(...targetFilters.clauses)
  bindings.push(...targetFilters.bindings)

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

function buildNoLinkExistsSql(
  joinSpec: ResolvedCrossModuleJoinSpec,
  correlateSpec: CorrelateSpec,
  context: JoinSqlContext,
  linkType: Exclude<LinkType, "normal">
): SqlFragment {
  const targetAlias = joinSpec.alias
  const targetTable = qualifyTable(
    joinSpec.target.schema,
    joinSpec.target.table,
    context.defaultSchema
  )

  const bindings: Knex.RawBinding[] = []
  const clauses: string[] = [
    buildTargetCorrelationSql(joinSpec, correlateSpec, targetAlias, linkType),
    buildTargetSoftDeleteSql(targetAlias, context.withDeleted),
  ]

  const targetFilters = getTargetFilters(joinSpec, targetAlias, context)
  clauses.push(...targetFilters.clauses)
  bindings.push(...targetFilters.bindings)

  let sql = `exists (select 1 from ${targetTable} as ${quoteIdentifier(
    targetAlias
  )} where ${clauses.filter(Boolean).join(" and ")})`

  return { sql, bindings }
}

function getTargetFilters(
  joinSpec: ResolvedCrossModuleJoinSpec,
  targetAlias: string,
  context: JoinSqlContext
) {
  const targetPrimaryKey = getTargetPrimaryKey(joinSpec)
  const bindings: Knex.RawBinding[] = []
  const clauses: string[] = []

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

    const nested = buildExistsSql(
      child,
      {
        table: joinSpec.target.table,
        alias: targetAlias,
        key: targetPrimaryKey,
      },
      context
    )

    if (nested.sql) {
      clauses.push(nested.sql)
      bindings.push(...nested.bindings)
    }
  }

  return { clauses, bindings }
}

function nextLinkAlias(context: JoinSqlContext): string {
  return `cm_link_${context.linkAliasCounter.value++}`
}

function hasTargetFilters(joinSpec: ResolvedCrossModuleJoinSpec): boolean {
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
      const inArraySql = buildInArraySql(column, values, false)
      if (!inArraySql) {
        return "1 = 0"
      }
      bindings.push(...inArraySql.bindings)
      return inArraySql.sql
    }
    case "$nin": {
      const values = (value as Knex.RawBinding[]) ?? []
      const inArraySql = buildInArraySql(column, values, true)
      if (!inArraySql) {
        return undefined
      }
      bindings.push(...inArraySql.bindings)
      return inArraySql.sql
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
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid operator: ${operator}`
      )
  }
}

function buildInArraySql(
  column: string,
  values: Knex.RawBinding[],
  negated: boolean
): SqlFragment | undefined {
  if (!values.length) {
    return negated ? undefined : { sql: "1 = 0", bindings: [] }
  }

  // Use `any(array[...])` so MikroORM's formatQuery inlines values as
  // `array['a','b']` instead of the invalid `any('a','b')` from a single array
  // binding with `any(?)`.
  const placeholders = values.map(() => "?").join(", ")
  const arraySql = `array[${placeholders}]`
  const sql = negated
    ? `not (${column} = any(${arraySql}))`
    : `${column} = any(${arraySql})`

  return {
    sql,
    bindings: values,
  }
}
