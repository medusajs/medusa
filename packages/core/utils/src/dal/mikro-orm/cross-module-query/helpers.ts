import { CrossModuleJoinSpec } from "@medusajs/types"
import { Knex } from "@medusajs/deps/mikro-orm/knex"

export const DEFAULT_SCHEMA = "public"

export type SqlFragment = {
  sql: string
  bindings: Knex.RawBinding[]
}

export function qualifyTable(
  schema: string | undefined,
  table: string,
  defaultSchema: string = DEFAULT_SCHEMA
): string {
  const resolvedSchema = schema ?? defaultSchema ?? DEFAULT_SCHEMA
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
