import { createPsqlIndexStatementHelper } from "../create-psql-index-helper"

describe("createPsqlIndexStatementHelper", function () {
  it("should generate a simple index", function () {
    const options = {
      name: "index_name",
      tableName: "table_name",
      columns: "column_name",
    }

    const indexStatement = createPsqlIndexStatementHelper(options)
    expect(indexStatement).toEqual(
      `CREATE INDEX IF NOT EXISTS "${options.name}" ON "${options.tableName}" (${options.columns})`
    )
  })

  it("should generate a composite index", function () {
    const options = {
      name: "index_name",
      tableName: "table_name",
      columns: ["column_name_1", "column_name_2"],
    }

    const indexStatement = createPsqlIndexStatementHelper(options)
    expect(indexStatement).toEqual(
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
    expect(indexStatement).toEqual(
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
    expect(indexStatement).toEqual(
      `CREATE INDEX IF NOT EXISTS "${options.name}" ON "${
        options.tableName
      }" USING GIN (${options.columns.join(", ")}) WHERE ${options.where}`
    )
  })

  it("should generate unique constraint", function () {
    const options = {
      name: "index_name",
      tableName: "table_name",
      columns: ["column_name_1", "column_name_2"],
      unique: true,
      where: "column_name_1 IS NOT NULL",
    }

    const indexStatement = createPsqlIndexStatementHelper(options)
    expect(indexStatement).toEqual(
      `ALTER TABLE IF EXISTS "${options.tableName}" ADD CONSTRAINT "${
        options.name
      }" UNIQUE (${options.columns.join(", ")}) WHERE ${options.where}`
    )
  })
})
