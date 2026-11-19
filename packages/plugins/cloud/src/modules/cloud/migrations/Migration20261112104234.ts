import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20261112104234 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "cloud_announcement_preference" ("id" text not null, "security" boolean not null default true, "feature" boolean not null default true, "cloud" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cloud_announcement_preference_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_cloud_announcement_preference_deleted_at" ON "cloud_announcement_preference" ("deleted_at") WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cloud_announcement_preference" cascade;`)
  }
}
