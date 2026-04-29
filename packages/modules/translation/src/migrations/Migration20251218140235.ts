import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251218140235 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "translation_settings" drop constraint if exists "translation_settings_entity_type_unique";`
    )
    this.addSql(
      `create table if not exists "translation_settings" ("id" text not null, "entity_type" text not null, "fields" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "translation_settings_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_translation_settings_deleted_at" ON "translation_settings" ("deleted_at") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_translation_settings_entity_type_unique" ON "translation_settings" ("entity_type") WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "translation_settings" cascade;`)
  }
}
