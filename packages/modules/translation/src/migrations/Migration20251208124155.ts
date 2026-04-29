import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251208124155 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "translation" drop constraint if exists "translation_reference_id_locale_code_unique";`
    )
    this.addSql(
      `alter table if exists "locale" drop constraint if exists "locale_code_unique";`
    )
    this.addSql(
      `create table if not exists "locale" ("id" text not null, "code" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "locale_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_locale_deleted_at" ON "locale" ("deleted_at") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_locale_code_unique" ON "locale" ("code") WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `create table if not exists "translation" ("id" text not null, "reference_id" text not null, "reference" text not null, "locale_code" text not null, "translations" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "translation_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_translation_deleted_at" ON "translation" ("deleted_at") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_translation_reference_id_locale_code_unique" ON "translation" ("reference_id", "locale_code") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_translation_reference_id_reference_locale_code" ON "translation" ("reference_id", "reference", "locale_code") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_translation_reference_locale_code" ON "translation" ("reference", "locale_code") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_translation_reference_id_reference" ON "translation" ("reference_id", "reference") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_translation_locale_code" ON "translation" ("locale_code") WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "locale" cascade;`)

    this.addSql(`drop table if exists "translation" cascade;`)
  }
}
