import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260127081758 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "property_label" drop constraint if exists "property_label_entity_property_unique";`
    )
    this.addSql(
      `create table if not exists "property_label" ("id" text not null, "entity" text not null, "property" text not null, "label" text not null, "description" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "property_label_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_property_label_deleted_at" ON "property_label" ("deleted_at") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_property_label_entity_property_unique" ON "property_label" ("entity", "property") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_property_label_entity" ON "property_label" ("entity") WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `alter table if exists "view_configuration" alter column "name" type text using ("name"::text);`
    )
    this.addSql(
      `alter table if exists "view_configuration" alter column "name" drop not null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "property_label" cascade;`)

    this.addSql(
      `alter table if exists "view_configuration" alter column "name" type text using ("name"::text);`
    )
    this.addSql(
      `alter table if exists "view_configuration" alter column "name" set not null;`
    )
  }
}
