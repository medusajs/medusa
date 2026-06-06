import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250128132404 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "index_sync" ("id" text not null, "entity" text not null, "last_key" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "index_sync_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_index_sync_deleted_at" ON "index_sync" (deleted_at) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_index_sync_entity" ON "index_sync" (entity) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "index_sync" cascade;`)
  }
}
