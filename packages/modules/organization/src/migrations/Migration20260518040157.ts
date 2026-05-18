import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260518040157 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "organization" drop constraint if exists "organization_code_unique";`);
    this.addSql(`create table if not exists "organization" ("id" text not null, "name" text not null, "code" text not null, "parent_id" text null, "org_type" text check ("org_type" in ('brand_bu', 'operation', 'department')) not null, "status" text check ("status" in ('active', 'inactive')) not null default 'active', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "organization_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_organization_code_unique" ON "organization" ("code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_organization_deleted_at" ON "organization" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_organization_parent_id" ON "organization" ("parent_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "organization" cascade;`);
  }

}
