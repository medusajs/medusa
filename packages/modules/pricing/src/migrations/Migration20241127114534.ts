import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20241127114534 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `alter table if exists "price_rule" add column if not exists "operator" text check ("operator" in ('gte', 'lte', 'gt', 'lt', 'eq'));`
    )
    this.addSql(
      `update "price_rule" set "operator" = 'eq' where "operator" is null;`
    )
    this.addSql(
      `alter table "price_rule" alter column "operator" set not null, alter column "operator" set default 'eq';`
    )
    this.addSql(
      'create index if not exists "IDX_price_rule_operator" on "price_rule" ("operator");'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_price_rule_operator";')
    this.addSql(
      'alter table if exists "price_rule" drop column if exists "operator";'
    )
  }
}
