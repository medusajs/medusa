import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260903085616 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "search_index_version" ("id" text not null, "version" integer not null, "provider" text not null, "physical_name" text not null, "definition_hash" text not null, "status" text check ("status" in ('pending', 'building', 'ready', 'error')) not null default 'pending', "search_index_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "search_index_version_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_search_index_version_search_index_id" ON "search_index_version" ("search_index_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_search_index_version_deleted_at" ON "search_index_version" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_search_index_version_search_index_id_version" ON "search_index_version" ("search_index_id", "version") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "search_index_version" add constraint "search_index_version_search_index_id_foreign" foreign key ("search_index_id") references "search_index" ("id") on update cascade;`);

    this.addSql(`alter table if exists "search_index_sync" drop constraint if exists "search_index_sync_search_index_id_foreign";`);

    this.addSql(`alter table if exists "search_index" drop column if exists "provider", drop column if exists "status", drop column if exists "definition_hash";`);

    this.addSql(`alter table if exists "search_index" add column if not exists "active_version" integer null;`);

    this.addSql(`drop index if exists "IDX_search_index_sync_search_index_id";`);

    this.addSql(`alter table if exists "search_index_sync" rename column "search_index_id" to "search_index_version_id";`);
    this.addSql(`alter table if exists "search_index_sync" add constraint "search_index_sync_search_index_version_id_foreign" foreign key ("search_index_version_id") references "search_index_version" ("id") on update cascade;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_search_index_sync_search_index_version_id" ON "search_index_sync" ("search_index_version_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "search_index_sync" drop constraint if exists "search_index_sync_search_index_version_id_foreign";`);

    this.addSql(`drop table if exists "search_index_version" cascade;`);

    this.addSql(`alter table if exists "search_index" drop column if exists "active_version";`);

    this.addSql(`alter table if exists "search_index" add column if not exists "provider" text not null, add column if not exists "status" text check ("status" in ('pending', 'building', 'ready', 'error')) not null default 'pending', add column if not exists "definition_hash" text not null;`);

    this.addSql(`drop index if exists "IDX_search_index_sync_search_index_version_id";`);

    this.addSql(`alter table if exists "search_index_sync" rename column "search_index_version_id" to "search_index_id";`);
    this.addSql(`alter table if exists "search_index_sync" add constraint "search_index_sync_search_index_id_foreign" foreign key ("search_index_id") references "search_index" ("id") on update cascade;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_search_index_sync_search_index_id" ON "search_index_sync" ("search_index_id") WHERE deleted_at IS NULL;`);
  }

}
