import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251202184737 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "store_locale" ("id" text not null, "locale_code" text not null, "is_default" boolean not null default false, "store_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "store_locale_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_store_locale_store_id" ON "store_locale" ("store_id") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_store_locale_deleted_at" ON "store_locale" ("deleted_at") WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `alter table if exists "store_locale" add constraint "store_locale_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "store_locale" cascade;`)
  }
}
