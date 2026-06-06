import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250717162007 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "user_preference" drop constraint if exists "user_preference_user_id_key_unique";`);
    this.addSql(`create table if not exists "user_preference" ("id" text not null, "user_id" text not null, "key" text not null, "value" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "user_preference_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_user_preference_deleted_at" ON "user_preference" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_preference_user_id_key_unique" ON "user_preference" (user_id, key) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_user_preference_user_id" ON "user_preference" (user_id) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "view_configuration" ("id" text not null, "entity" text not null, "name" text null, "user_id" text null, "is_system_default" boolean not null default false, "configuration" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "view_configuration_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_view_configuration_deleted_at" ON "view_configuration" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_view_configuration_entity_user_id" ON "view_configuration" (entity, user_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_view_configuration_entity_is_system_default" ON "view_configuration" (entity, is_system_default) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_view_configuration_user_id" ON "view_configuration" (user_id) WHERE deleted_at IS NULL;`);
  }

}
