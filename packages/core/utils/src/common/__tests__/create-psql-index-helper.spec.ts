import { createPsqlIndexStatementHelper } from "../create-psql-index-helper"

describe("createPsqlIndexStatementHelper", function () {
  it("should generate a simple index", function () {
    const options = {
      name: "index_name",
      tableName: "table_name",
      columns: "column_name",
    }

    const indexStatement = createPsqlIndexStatementHelper(options)
    expect(indexStatement + "").toEqual(
      `CREATE INDEX IF NOT EXISTS "${options.name}" ON "${options.tableName}" (${options.columns})`
    )
  })

  it("should generate a simple index and auto compose its name", function () {
    const options = {
      tableName: "table_name",
      columns: "column_name",
    }

    const indexStatement = createPsqlIndexStatementHelper(options)
    expect(indexStatement + "").toEqual(
      `CREATE INDEX IF NOT EXISTS "IDX_table_name_column_name" ON "${options.tableName}" (${options.columns})`
    )
  })

  it("should generate a composite index", function () {
    const options = {
      name: "index_name",
      tableName: "table_name",
      columns: ["column_name_1", "column_name_2"],
    }

    const indexStatement = createPsqlIndexStatementHelper(options)
    expect(indexStatement.expression).toEqual(
      `CREATE INDEX IF NOT EXISTS "${options.name}" ON "${
        options.tableName
      }" (${options.columns.join(", ")})`
    )
  })

  it("should generate an index with where clauses", function () {
    const options = {
      name: "index_name",
      tableName: "table_name",
      columns: ["column_name_1", "column_name_2"],
      where: "column_name_1 IS NOT NULL",
    }

    const indexStatement = createPsqlIndexStatementHelper(options)
    expect(indexStatement.expression).toEqual(
      `CREATE INDEX IF NOT EXISTS "${options.name}" ON "${
        options.tableName
      }" (${options.columns.join(", ")}) WHERE ${options.where}`
    )
  })

  it("should generate an index with where clauses and index type", function () {
    const options = {
      name: "index_name",
      tableName: "table_name",
      columns: ["column_name_1", "column_name_2"],
      type: "GIN",
      where: "column_name_1 IS NOT NULL",
    }

    const indexStatement = createPsqlIndexStatementHelper(options)
    expect(indexStatement.toString()).toEqual(
      `CREATE INDEX IF NOT EXISTS "${options.name}" ON "${
        options.tableName
      }" USING GIN (${options.columns.join(", ")}) WHERE ${options.where}`
    )
  })

  it("should generate unique constraint", function () {
    const options = {
      tableName: "table_name",
      columns: ["column_name_1", "column_name_2"],
      unique: true,
      where: "column_name_1 IS NOT NULL",
    }

    const indexStatement = createPsqlIndexStatementHelper(options)
    expect(indexStatement.expression).toEqual(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_table_name_column_name_1_column_name_2_unique" ON "${
        options.tableName
      }" (${options.columns.join(", ")}) WHERE ${options.where}`
    )
  })

  it("should generate index on an explicit pg schema", function () {
    const options = {
      name: "index_name",
      tableName: "public.table_name",
      columns: "column_name",
    }

    const indexStatement = createPsqlIndexStatementHelper(options)
    expect(indexStatement + "").toEqual(
      `CREATE INDEX IF NOT EXISTS "${options.name}" ON "public"."table_name" (${options.columns})`
    )
  })

  it("generate index name from table name when using explicit pg schema", function () {
    const options = {
      tableName: "public.table_name",
      columns: "column_name",
    }

    const indexStatement = createPsqlIndexStatementHelper(options)
    expect(indexStatement + "").toEqual(
      `CREATE INDEX IF NOT EXISTS "IDX_table_name_column_name" ON "public"."table_name" (${options.columns})`
    )
  })

  it("should generate index when table name was previously formatted to allow pg schema name", function () {
    const options = {
      name: "index_name",
      tableName: 'public"."table_name',
      columns: "column_name",
    }

    const indexStatement = createPsqlIndexStatementHelper(options)
    expect(indexStatement + "").toEqual(
      `CREATE INDEX IF NOT EXISTS "${options.name}" ON "public"."table_name" (${options.columns})`
    )
  })
})
