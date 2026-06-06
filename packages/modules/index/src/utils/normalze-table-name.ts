import { compressName } from "@zjedene-medusa/framework/utils"

export function normalizeTableName(name: string): string {
  return compressName(name.toLowerCase(), 58).replace(/[^a-z0-9_]/g, "_")
}

export function getPivotTableName(tableName: string) {
  const compressedName = normalizeTableName(tableName)
  return `cat_pivot_${compressedName}`
}
