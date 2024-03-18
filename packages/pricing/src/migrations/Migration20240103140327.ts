import { Migration } from "@mikro-orm/migrations"

export class Migration20240103140327 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "price_set_money_amount" add column "created_at" timestamptz not null default now(), add column "updated_at" timestamptz not null default now(), add column "deleted_at" timestamptz null;'
    )

    this.addSql(
      'create index "IDX_price_set_money_amount_deleted_at" on "price_set_money_amount" ("deleted_at");'
    )

    this.addSql(
      'alter table "price_rule" add column "created_at" timestamptz not null default now(), add column "updated_at" timestamptz not null default now(), add column "deleted_at" timestamptz null;'
    )
    this.addSql('alter table "price_rule" drop column "is_dynamic";')
    this.addSql(
      'create index "IDX_price_rule_deleted_at" on "price_rule" ("deleted_at");'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop index "IDX_price_set_money_amount_deleted_at";')
    this.addSql(
      'alter table "price_set_money_amount" drop column "created_at";'
    )
    this.addSql(
      'alter table "price_set_money_amount" drop column "updated_at";'
    )
    this.addSql(
      'alter table "price_set_money_amount" drop column "deleted_at";'
    )
    this.addSql(
      'alter table "price_rule" add column "is_dynamic" boolean not null default false;'
    )
    this.addSql('drop index "IDX_price_rule_deleted_at";')
    this.addSql('alter table "price_rule" drop column "created_at";')
    this.addSql('alter table "price_rule" drop column "updated_at";')
    this.addSql('alter table "price_rule" drop column "deleted_at";')
  }
}
