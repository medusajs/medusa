import { CrossModuleJoinSpec } from "@medusajs/types"
import { Knex } from "@medusajs/deps/mikro-orm/knex"
import { MedusaError } from "../../../common"

export type SqlFragment = {
  sql: string
  bindings: Knex.RawBinding[]
}

export type ResolvedCrossModuleJoinSpec = CrossModuleJoinSpec & {
  alias: string
}

export function qualifyTable(
  schema: string | undefined,
  table: string,
  defaultSchema
): string {
  const resolvedSchema = schema ?? defaultSchema
  return `${quoteIdentifier(resolvedSchema)}.${quoteIdentifier(table)}`
}

export function buildJoinCorrelationSql(
  joinSpec: CrossModuleJoinSpec,
  linkAlias: string,
  correlateAlias: string,
  correlateKey: string
): string {
  return `${quoteIdentifier(linkAlias)}.${quoteIdentifier(
    joinSpec.link.sourceKey
  )} = ${quoteIdentifier(correlateAlias)}.${quoteIdentifier(correlateKey)}`
}

export function buildLinkToTargetJoinSql(
  linkAlias: string,
  targetAlias: string,
  linkTargetKey: string,
  targetPrimaryKey: string
): string {
  return `${quoteIdentifier(linkAlias)}.${quoteIdentifier(
    linkTargetKey
  )} = ${quoteIdentifier(targetAlias)}.${quoteIdentifier(targetPrimaryKey)}`
}

export function buildJoinSoftDeleteSql(
  linkAlias: string,
  targetAlias: string,
  withDeleted: boolean
): string {
  if (withDeleted) {
    return ""
  }

  return [
    `${quoteIdentifier(linkAlias)}."deleted_at" is null`,
    `${quoteIdentifier(targetAlias)}."deleted_at" is null`,
  ].join(" and ")
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
