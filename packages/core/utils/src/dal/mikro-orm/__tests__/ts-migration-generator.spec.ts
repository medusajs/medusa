import { TSMigrationGenerator } from "../mikro-orm-create-connection"

function unwrapSql(sql: string) {
  return sql.match(/this.addSql\('(.*?)'\)/)?.[1]
}

describe("TSMigrationGenerator", () => {
  it('should add "if not exists" to "create table" statements', () => {
    const sql = "create table my_table (id int)"
    const result = unwrapSql(
      TSMigrationGenerator.prototype.createStatement(sql, 0)
    )
    expect(result).toBe("create table if not exists my_table (id int)")
  })

  it('should add "if exists" to "alter table" statements as well as to the add column', () => {
    const sql = "alter table my_table add column name varchar(100)"
    const result = unwrapSql(
      TSMigrationGenerator.prototype.createStatement(sql, 0)
    )
    expect(result).toBe(
      "alter table if exists my_table add column if not exists name varchar(100)"
    )
  })

  it('should add "if exists" to "alter table" statements as well as to the drop column', () => {
    const sql = "alter table my_table drop column name"
    const result = unwrapSql(
      TSMigrationGenerator.prototype.createStatement(sql, 0)
    )
    expect(result).toBe(
      "alter table if exists my_table drop column if exists name"
    )
  })

  it('should add "if exists" to "alter table" statements as well as to the alter column', () => {
    const sql = "alter table my_table alter column name"
    const result = unwrapSql(
      TSMigrationGenerator.prototype.createStatement(sql, 0)
    )
    expect(result).toBe(
      "alter table if exists my_table alter column if exists name"
    )
  })

  it('should add "if not exists" to "create index" statements', () => {
    const sql = "create index idx_name on my_table(name)"
    const result = unwrapSql(
      TSMigrationGenerator.prototype.createStatement(sql, 0)
    )
    expect(result).toBe("create index if not exists idx_name on my_table(name)")
  })

  it('should add "if exists" to "drop index" statements', () => {
    const sql = "drop index idx_name"
    const result = unwrapSql(
      TSMigrationGenerator.prototype.createStatement(sql, 0)
    )
    expect(result).toBe("drop index if exists idx_name")
  })

  it('should add "if not exists" to "create unique index" statements', () => {
    const sql = "create unique index idx_unique_name on my_table(name)"
    const result = unwrapSql(
      TSMigrationGenerator.prototype.createStatement(sql, 0)
    )
    expect(result).toBe(
      "create unique index if not exists idx_unique_name on my_table(name)"
    )
  })

  it('should add "if exists" to "drop unique index" statements', () => {
    const sql = "drop unique index idx_unique_name"
    const result = unwrapSql(
      TSMigrationGenerator.prototype.createStatement(sql, 0)
    )
    expect(result).toBe("drop unique index if exists idx_unique_name")
  })

  it('should add "if not exists" to "add column" statements', () => {
    const sql = "add column name varchar(100)"
    const result = unwrapSql(
      TSMigrationGenerator.prototype.createStatement(sql, 0)
    )
    expect(result).toBe("add column if not exists name varchar(100)")
  })

  it('should add "if exists" to "drop column" statements', () => {
    const sql = "drop column name"
    const result = unwrapSql(
      TSMigrationGenerator.prototype.createStatement(sql, 0)
    )
    expect(result).toBe("drop column if exists name")
  })

  it('should add "if exists" to "alter column" statements', () => {
    const sql = "alter column name"
    const result = unwrapSql(
      TSMigrationGenerator.prototype.createStatement(sql, 0)
    )
    expect(result).toBe("alter column if exists name")
  })

  it('should add "if exists" to "drop constraint" statements', () => {
    const sql = "drop constraint fk_name"
    const result = unwrapSql(
      TSMigrationGenerator.prototype.createStatement(sql, 0)
    )
    expect(result).toBe("drop constraint if exists fk_name")
  })
})
