import { Knex } from "@medusajs/deps/mikro-orm/knex"
import { CrossModuleJoinSpec } from "@medusajs/types"
import { MedusaError } from "../../../common"

export type SqlFragment = {
  sql: string
  bindings: Knex.RawBinding[]
}

export type ResolvedCrossModuleJoinSpec = CrossModuleJoinSpec & {
  alias: string
}

export type CorrelateSpec = {
  table: string
  alias: string
  key: string
}

export type LinkType =
  | "pivot" // The link between the source and target is through a pivot table
  | "source" // The source table has a column referencing the target table's key
  | "target" // The target table has a column referencing the source table's key

export function inferLinkType(
  joinSpec: CrossModuleJoinSpec,
  correlateSpec: CorrelateSpec
): LinkType {
  if (
    joinSpec.link.schema === joinSpec.target.schema &&
    joinSpec.link.table === joinSpec.target.table &&
    joinSpec.link.targetKey === (joinSpec.target.primaryKey ?? "id")
  ) {
    return "target"
  }

  if (
    joinSpec.link.table === correlateSpec.table &&
    joinSpec.link.sourceKey === correlateSpec.key
  ) {
    return "source"
  }

  return "pivot"
}

export function qualifyTable(
  schema: string | undefined,
  table: string,
  defaultSchema
): string {
  const resolvedSchema = schema ?? defaultSchema
  return `${quoteIdentifier(resolvedSchema)}.${quoteIdentifier(table)}`
}

export function getTargetPrimaryKey(joinSpec: CrossModuleJoinSpec): string {
  return joinSpec.target.primaryKey ?? "id"
}

export function buildLinkCorrelationSql(
  joinSpec: CrossModuleJoinSpec,
  correlateSpec: CorrelateSpec,
  linkAlias: string
): string {
  return `${quoteIdentifier(linkAlias)}.${quoteIdentifier(
    joinSpec.link.sourceKey
  )} = ${quoteIdentifier(correlateSpec.alias)}.${quoteIdentifier(
    correlateSpec.key
  )}`
}

export function buildTargetCorrelationSql(
  joinSpec: CrossModuleJoinSpec,
  correlateSpec: CorrelateSpec,
  targetAlias: string,
  linkType: Exclude<LinkType, "normal">
): string {
  if (linkType === "target") {
    return `${quoteIdentifier(targetAlias)}.${quoteIdentifier(
      joinSpec.link.sourceKey
    )} = ${quoteIdentifier(correlateSpec.alias)}.${quoteIdentifier(
      correlateSpec.key
    )}`
  }

  if (linkType === "source") {
    return `${quoteIdentifier(targetAlias)}.${quoteIdentifier(
      getTargetPrimaryKey(joinSpec)
    )} = ${quoteIdentifier(correlateSpec.alias)}.${quoteIdentifier(
      joinSpec.link.targetKey
    )}`
  }

  return ""
}

export function buildLinkToTargetJoinSql(
  joinSpec: CrossModuleJoinSpec,
  linkAlias: string,
  targetAlias: string
): string {
  return `${quoteIdentifier(linkAlias)}.${quoteIdentifier(
    joinSpec.link.targetKey
  )} = ${quoteIdentifier(targetAlias)}.${quoteIdentifier(
    getTargetPrimaryKey(joinSpec)
  )}`
}

export function buildLinkSoftDeleteSql(
  linkAlias: string,
  withDeleted: boolean
): string {
  if (withDeleted) {
    return ""
  }

  return `${quoteIdentifier(linkAlias)}."deleted_at" is null`
}

export function buildTargetSoftDeleteSql(
  targetAlias: string,
  withDeleted: boolean
): string {
  if (withDeleted) {
    return ""
  }

  return `${quoteIdentifier(targetAlias)}."deleted_at" is null`
}

export function quoteIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`
}

export function resolveCrossModuleJoins(
  crossModuleJoins: CrossModuleJoinSpec[]
): ResolvedCrossModuleJoinSpec[] {
  assertValidCrossModuleJoins(crossModuleJoins)

  const usedBaseAliases = new Map<string, number>()

  return crossModuleJoins.map((join) => {
    const baseAlias = join.target.table
    const usageCount = usedBaseAliases.get(baseAlias) ?? 0
    usedBaseAliases.set(baseAlias, usageCount + 1)
    const alias =
      usageCount === 0 ? baseAlias : `${baseAlias}_${usageCount + 1}`

    return {
      ...join,
      alias,
    }
  })
}

function assertValidCrossModuleJoins(
  crossModuleJoins: CrossModuleJoinSpec[]
): void {
  const targetTables = new Set<string>()

  for (const join of crossModuleJoins) {
    if (targetTables.has(join.target.table)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Duplicate cross-module join target table "${join.target.table}". Each join must target a unique table.`
      )
    }

    targetTables.add(join.target.table)
  }

  for (const join of crossModuleJoins) {
    if (!join.parent) {
      continue
    }

    if (join.parent === join.target.table) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cross-module join for "${join.target.table}" cannot be its own parent.`
      )
    }

    if (!targetTables.has(join.parent)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cross-module join for "${join.target.table}" references unknown parent target table "${join.parent}".`
      )
    }
  }
}
