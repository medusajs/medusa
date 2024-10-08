import { Migration } from "@mikro-orm/migrations"

export class Migration20240621145944 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "store_currency" ("id" text not null, "currency_code" text not null, "is_default" boolean not null default false, "store_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "store_currency_pkey" primary key ("id"));'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_store_currency_deleted_at" ON "store_currency" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'alter table if exists "store_currency" add constraint "store_currency_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table if exists "store" drop column if exists "supported_currency_codes";'
    )
    this.addSql(
      'alter table if exists "store" drop column if exists "default_currency_code";'
    )
  }
}
