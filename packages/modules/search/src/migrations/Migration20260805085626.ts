import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260805085626 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "search_index" ("id" text not null, "name" text not null, "provider" text not null, "status" text check ("status" in ('pending', 'building', 'ready', 'error')) not null default 'pending', "definition_hash" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "search_index_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_search_index_deleted_at" ON "search_index" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_search_index_name" ON "search_index" ("name") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "search_index_sync" ("id" text not null, "job_id" text null, "status" text check ("status" in ('pending', 'processing', 'done', 'failed', 'canceled')) not null default 'pending', "filters" jsonb null, "last_key" text null, "documents_synced" integer not null default 0, "started_at" timestamptz null, "completed_at" timestamptz null, "error" text null, "search_index_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "search_index_sync_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_search_index_sync_search_index_id" ON "search_index_sync" ("search_index_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_search_index_sync_deleted_at" ON "search_index_sync" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_search_index_sync_job_id" ON "search_index_sync" ("job_id") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "search_index_sync" add constraint "search_index_sync_search_index_id_foreign" foreign key ("search_index_id") references "search_index" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "search_index_sync" drop constraint if exists "search_index_sync_search_index_id_foreign";`);

    this.addSql(`drop table if exists "search_index" cascade;`);

    this.addSql(`drop table if exists "search_index_sync" cascade;`);
  }

}
