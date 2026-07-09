import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260615151246 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "layout_configuration" drop constraint if exists "layout_configuration_zone_unique";`);
    this.addSql(`alter table if exists "layout_configuration" drop constraint if exists "layout_configuration_zone_user_id_unique";`);
    this.addSql(`create table if not exists "layout_configuration" ("id" text not null, "zone" text not null, "user_id" text null, "is_system_default" boolean not null default false, "configuration" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "layout_configuration_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_layout_configuration_deleted_at" ON "layout_configuration" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_layout_configuration_zone_user_id_unique" ON "layout_configuration" ("zone", "user_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_layout_configuration_zone_unique" ON "layout_configuration" ("zone") WHERE is_system_default = true AND deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "layout_configuration" cascade;`);
  }

}
