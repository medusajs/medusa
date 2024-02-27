import { Migration } from "@mikro-orm/migrations"

export class Migration20231101232834 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "price_list_rule_value" ("id" text not null, "value" text not null, "price_list_rule_id" text not null, constraint "price_list_rule_value_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_price_list_rule_price_list_rule_value_id" on "price_list_rule_value" ("price_list_rule_id");'
    )

    this.addSql(
      'alter table "price_list_rule_value" add constraint "price_list_rule_value_price_list_rule_id_foreign" foreign key ("price_list_rule_id") references "price_list_rule" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      `ALTER TABLE price_list
          ADD COLUMN IF NOT EXISTS rules_count integer not null default 0`
    )

    this.addSql(
      'alter table "price_set_money_amount" drop constraint "price_set_money_amount_price_list_id_foreign";'
    )

    this.addSql(
      'alter table "price_set_money_amount" add constraint "price_set_money_amount_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "price_list" add column if not exists "title" text, add column if not exists "name" text, add column if not exists "description" text not null, add column if not exists "type" text check ("type" in (\'sale\', \'override\')) not null default \'sale\', add column if not exists "created_at" timestamptz not null default now(), add column if not exists "updated_at" timestamptz not null default now(), add column if not exists "deleted_at" timestamptz null;'
    )

    this.addSql(`
        UPDATE "price_list"
        SET title = name
    `)

    this.addSql(`alter table "price_list" alter column "title" set not null `)

    this.addSql(
      'create index if not exists "IDX_price_list_deleted_at" on "price_list" ("deleted_at");'
    )

    this.addSql(
      'alter table "price_list_rule" drop constraint if exists "IDX_price_list_rule_rule_type_id_price_list_id_unique"'
    )

    this.addSql(
      'alter table "price_list_rule" add constraint "IDX_price_list_rule_rule_type_id_price_list_id_unique" unique ("price_list_id", "rule_type_id");'
    )

    this.addSql(
      'alter table "money_amount" add column if not exists "created_at" timestamptz not null default now(), add column if not exists "updated_at" timestamptz not null default now(), add column if not exists "deleted_at" timestamptz null;'
    )

    this.addSql(
      'create index if not exists "IDX_money_amount_deleted_at" on "money_amount" ("deleted_at");'
    )

    this.addSql(
      'alter table "price_set_money_amount" add constraint "price_set_money_amount_money_amount_id_unique" unique ("money_amount_id");'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "price_list_rule_value" cascade;')

    this.addSql(`ALTER TABLE price_list DROP COLUMN IF EXISTS rules_count`)

    this.addSql('alter table "price_list" drop column if exists "title";')

    this.addSql('alter table "price_list" drop column if exists "description";')

    this.addSql('alter table "price_list" drop column if exists "type";')

    this.addSql(
      'alter table "price_set_money_amount" drop constraint "price_set_money_amount_price_list_id_foreign";'
    )

    this.addSql(
      'alter table "price_set_money_amount" add constraint "price_set_money_amount_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade on delete set null;'
    )

    this.addSql('drop index if exists "IDX_price_list_deleted_at";')

    this.addSql('alter table "price_list" drop column if exists "title";')

    this.addSql('alter table "price_list" drop column if exists "description";')

    this.addSql('alter table "price_list" drop column if exists "type";')

    this.addSql('alter table "price_list" drop column if exists "created_at";')

    this.addSql('alter table "price_list" drop column if exists "updated_at";')

    this.addSql('alter table "price_list" drop column if exists "deleted_at";')

    this.addSql(
      'alter table "price_list_rule" drop constraint if exists "IDX_price_list_rule_rule_type_id_price_list_id_unique";'
    )

    this.addSql('drop index if exists "IDX_money_amount_deleted_at";')

    this.addSql(
      'alter table "money_amount" drop column if exists "created_at";'
    )

    this.addSql(
      'alter table "money_amount" drop column if exists "updated_at";'
    )

    this.addSql(
      'alter table "money_amount" drop column if exists "deleted_at";'
    )

    this.addSql(
      'alter table "price_set_money_amount" drop constraint if exists "price_set_money_amount_money_amount_id_unique";'
    )
  }
}
