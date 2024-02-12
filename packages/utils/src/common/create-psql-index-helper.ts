/**
 * Create a PSQL index statement
 * @param name The name of the index
 * @param tableName The name of the table
 * @param columns The columns to index
 * @param type The type of index (e.g GIN, GIST, BTREE, etc)
 * @param where The where clause
 * @param unique If the index should be a unique index
 *
 * @example
 * createPsqlIndexStatementHelper({
 *   name: "idx_user_email",
 *   tableName: "user",
 *   columns: "email",
 *   type: "btree",
 *   where: "email IS NOT NULL"
 * });
 *
 * // CREATE INDEX IF NOT EXISTS idx_user_email ON user USING btree (email) WHERE email IS NOT NULL;
 *
 * createPsqlIndexStatementHelper({
 *   name: "idx_user_email",
 *   tableName: "user",
 *   columns: "email"
 * });
 *
 * // CREATE INDEX IF NOT EXISTS idx_user_email ON user (email);
 *
 */
export function createPsqlIndexStatementHelper({
  name,
  tableName,
  columns,
  type,
  where,
  unique,
}: {
  name: string
  tableName: string
  columns: string | string[]
  type?: string
  where?: string
  unique?: boolean
}) {
  columns = Array.isArray(columns) ? columns.join(", ") : columns
  const typeStr = type ? ` USING ${type}` : ""
  const optionsStr = where ? ` WHERE ${where}` : ""

  if (!unique) {
    return `CREATE INDEX IF NOT EXISTS "${name}" ON "${tableName}"${typeStr} (${columns})${optionsStr}`
  } else {
    return `ALTER TABLE IF EXISTS "${tableName}" ADD CONSTRAINT "${name} UNIQUE"(${columns})`
  }
}
