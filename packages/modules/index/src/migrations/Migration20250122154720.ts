import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250122154720 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "index_metadata" ("id" text not null, "entity" text not null, "fields" text not null, "fields_hash" text not null, "status" text check ("status" in ('pending', 'processing', 'done', 'error')) not null default 'pending', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "index_metadata_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_index_metadata_deleted_at" ON "index_metadata" (deleted_at) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_index_metadata_entity" ON "index_metadata" (entity) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "index_metadata" cascade;`)
  }
}
