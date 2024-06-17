export function generatePostgresAlterColummnIfExistStatement(
  tableName: string,
  columns: string[],
  alterExpression: string
) {
  let script = `
    DO $$
    DECLARE
        current_column text;
    BEGIN`

  columns.forEach((column) => {
    script += `
        current_column := '${column}';
        IF EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = '${tableName}' 
            AND column_name = current_column
        ) THEN
            EXECUTE format('ALTER TABLE %I ALTER COLUMN %I ${alterExpression}', '${tableName}', current_column);
        ELSE
            RAISE NOTICE 'Column % does not exist or alteration condition not met.', current_column;
        END IF;`
  })

  script += `
    END$$;
    `

  return script
}
