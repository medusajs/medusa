import { Migration } from "@mikro-orm/migrations"

export class Migration20230929122253 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "money_amount" ("id" text not null, "currency_code" text not null, "amount" numeric not null, "min_quantity" numeric null, "max_quantity" numeric null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "money_amount_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "price_set" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "price_set_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "price" ("id" text not null, "title" text, "price_set_id" text not null, "money_amount_id" text not null, "raw_amount" jsonb not null, "rules_count" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "price_pkey" primary key ("id"));'
    )

    this.addSql(
      'alter table "price" add constraint "price_money_amount_id_unique" unique ("money_amount_id");'
    )

    this.addSql(
      'create table "rule_type" ("id" text not null, "name" text not null, "rule_attribute" text not null, "default_priority" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rule_type_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "price_set_rule_type" ("id" text not null, "price_set_id" text not null, "rule_type_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "price_set_rule_type_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "price_rule" ("id" text not null, "price_set_id" text not null, "rule_type_id" text not null, "value" text not null, "priority" integer not null default 0, "price_id" text not null, "price_list_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "price_rule_pkey" primary key ("id"));'
    )

    this.addSql(
      'alter table "price" add constraint "price_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "price" add constraint "price_money_amount_id_foreign" foreign key ("money_amount_id") references "money_amount" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "price_set_rule_type" add constraint "price_set_rule_type_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "price_set_rule_type" add constraint "price_set_rule_type_rule_type_id_foreign" foreign key ("rule_type_id") references "rule_type" ("id") on update cascade;'
    )

    this.addSql(
      'alter table "price_rule" add constraint "price_rule_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "price_rule" add constraint "price_rule_rule_type_id_foreign" foreign key ("rule_type_id") references "rule_type" ("id") on update cascade;'
    )
    this.addSql(
      'alter table "price_rule" add constraint "price_rule_price_id_foreign" foreign key ("price_id") references "price" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'create table if not exists "price_list" ("id" text not null, "status" text check ("status" in (\'active\', \'draft\')) not null default \'draft\', "starts_at" timestamptz null, "ends_at" timestamptz null, "rules_count" integer not null default 0, constraint "price_list_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "price_list_rule" ("id" text not null, "rule_type_id" text not null, "price_list_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "price_list_rule_pkey" primary key ("id"));'
    )

    this.addSql(
      'alter table "price_list_rule" add constraint "price_list_rule_rule_type_id_foreign" foreign key ("rule_type_id") references "rule_type" ("id") on update cascade;'
    )
    this.addSql(
      'alter table "price_list_rule" add constraint "price_list_rule_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade;'
    )

    this.addSql('alter table "price" add column "price_list_id" text null;')

    this.addSql('alter table "price_rule" drop column "price_list_id";')

    this.addSql(
      'create table "price_list_rule_value" ("id" text not null, "value" text not null, "price_list_rule_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "price_list_rule_value_pkey" primary key ("id"));'
    )

    this.addSql(
      'alter table "price_list_rule_value" add constraint "price_list_rule_value_price_list_rule_id_foreign" foreign key ("price_list_rule_id") references "price_list_rule" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      `ALTER TABLE price_list
          ADD COLUMN IF NOT EXISTS rules_count integer not null default 0`
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
      'CREATE INDEX IF NOT EXISTS "IDX_money_amount_currency_code" ON "money_amount" (currency_code) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_money_amount_deleted_at" ON "money_amount" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_list_deleted_at" ON "price_list" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_set_deleted_at" ON "price_set" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_price_set_id" ON "price" (price_set_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_money_amount_id" ON "price" (money_amount_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_price_list_id" ON "price" (price_list_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_deleted_at" ON "price" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_rule_type_rule_attribute" ON "rule_type" (rule_attribute) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_rule_type_deleted_at" ON "rule_type" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_set_rule_type_price_set_id" ON "price_set_rule_type" (price_set_id) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_set_rule_type_rule_type_id" ON "price_set_rule_type" (rule_type_id) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_set_rule_type_deleted_at" ON "price_set_rule_type" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_rule_price_set_id" ON "price_rule" (price_set_id) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_rule_rule_type_id" ON "price_rule" (rule_type_id) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_rule_price_id_unique" ON "price_rule" (price_id) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_rule_deleted_at" ON "price_rule" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_list_rule_rule_type_id_unique" ON "price_list_rule" (rule_type_id) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_list_rule_price_list_id" ON "price_list_rule" (price_list_id) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_list_rule_deleted_at" ON "price_list_rule" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_list_rule_value_price_list_rule_id" ON "price_list_rule_value" (price_list_rule_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_list_rule_value_deleted_at" ON "price_list_rule_value" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )

    this.addSql(
      'alter table if exists "price_list" drop column if exists "name";'
    )

    this.addSql(
      'alter table if exists "price" add constraint "price_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table if exists "price_rule" drop constraint if exists "price_rule_rule_type_id_foreign";'
    )

    this.addSql(
      'alter table if exists "price_rule" add constraint "price_rule_rule_type_id_foreign" foreign key ("rule_type_id") references "rule_type" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table if exists "price_rule" drop constraint if exists "price_rule_rule_type_id_foreign";'
    )

    this.addSql(
      'alter table if exists "price_list_rule" drop constraint if exists "price_list_rule_price_list_id_foreign";'
    )

    this.addSql(
      'alter table if exists "price_rule" add constraint "price_rule_rule_type_id_foreign" foreign key ("rule_type_id") references "rule_type" ("id") on update cascade;'
    )

    this.addSql(
      'alter table if exists "price_list_rule" add constraint "price_list_rule_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table if exists "price_set_rule_type" drop constraint if exists "price_set_rule_type_rule_type_id_foreign";'
    )

    this.addSql(
      'alter table if exists "price_set_rule_type" add constraint "price_set_rule_type_rule_type_id_foreign" foreign key ("rule_type_id") references "rule_type" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table if exists "price" drop constraint if exists "price_money_amount_id_foreign";'
    )

    this.addSql(
      'alter table if exists "price" add column if not exists "amount" numeric not null, add column "min_quantity" numeric null, add column "max_quantity" numeric null;'
    )

    this.addSql(
      'alter table if exists "price" drop constraint if exists "price_money_amount_id_unique";'
    )

    this.addSql('drop index if exists "IDX_price_money_amount_id";')

    this.addSql(
      'alter table if exists "price" rename column "money_amount_id" to "currency_code";'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_price_currency_code" ON "price" (currency_code) WHERE deleted_at IS NULL;'
    )
  }
}
