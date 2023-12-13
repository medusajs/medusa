import { Migration } from "@mikro-orm/migrations"

export class Migration20231212134238 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "price_set_money_amount" add column if not exists "created_at" timestamptz not null default now(), add column if not exists "updated_at" timestamptz not null default now(), add column if not exists "deleted_at" timestamptz null;'
    )
    this.addSql(
      'create index if not exists "IDX_price_set_money_amount_deleted_at" on "price_set_money_amount" ("deleted_at");'
    )

    this.addSql(
      'alter table "price_rule" add column if not exists "created_at" timestamptz not null default now(), add column if not exists "updated_at" timestamptz not null default now(), add column if not exists "deleted_at" timestamptz null;'
    )
    this.addSql(
      'create index if not exists "IDX_price_rule_deleted_at" on "price_rule" ("deleted_at");'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_price_set_money_amount_deleted_at";')
    this.addSql(
      'alter table "price_set_money_amount" drop column if exists "created_at";'
    )
    this.addSql(
      'alter table "price_set_money_amount" drop column if exists "updated_at";'
    )
    this.addSql(
      'alter table "price_set_money_amount" drop column if exists "deleted_at";'
    )

    this.addSql('drop index if exists "IDX_price_rule_deleted_at";')
    this.addSql('alter table "price_rule" drop column if exists "created_at";')
    this.addSql('alter table "price_rule" drop column if exists "updated_at";')
    this.addSql('alter table "price_rule" drop column if exists "deleted_at";')
  }
}
