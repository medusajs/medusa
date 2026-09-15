import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260702120000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `alter table if exists "price_list_rule" add column if not exists "operator" text check ("operator" in ('in', 'nin'));`
    )
    this.addSql(
      `update "price_list_rule" set "operator" = 'in' where "operator" is null;`
    )
    this.addSql(
      `alter table "price_list_rule" alter column "operator" set not null, alter column "operator" set default 'in';`
    )
    this.addSql(
      'create index if not exists "IDX_price_list_rule_operator" on "price_list_rule" ("operator") where deleted_at is null;'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_price_list_rule_operator";')
    this.addSql(
      'alter table if exists "price_list_rule" drop column if exists "operator";'
    )
  }
}
