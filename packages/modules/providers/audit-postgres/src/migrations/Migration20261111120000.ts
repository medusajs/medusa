import { Migration } from "@medusajs/framework/mikro-orm/migrations"

/**
 * Creates the `audit_log` table. Rows are only inserted, read, and pruned past
 * retention, so there is no `updated_at` or `deleted_at`. The indexes cover the
 * three read paths: by time, by actor, and by resource, each newest first.
 */
export class Migration20261111120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "audit_log" (
        "id" text not null,
        "started_at" timestamptz not null,
        "ended_at" timestamptz not null,
        "actor_type" text check ("actor_type" in ('user', 'api_key', 'customer', 'system', 'anonymous')) not null,
        "actor_id" text null,
        "impersonator_id" text null,
        "action" text not null,
        "resource_type" text null,
        "resource_id" text null,
        "outcome" text check ("outcome" in ('succeeded', 'denied', 'failed')) not null,
        "request" jsonb null,
        "request_data" jsonb null,
        "response_data" jsonb null,
        "metadata" jsonb null,
        constraint "audit_log_pkey" primary key ("id")
      );
    `)

    this.addSql(
      `create index if not exists "IDX_audit_log_started_at" on "audit_log" ("started_at" desc, "id" desc);`
    )
    this.addSql(
      `create index if not exists "IDX_audit_log_actor_started_at" on "audit_log" ("actor_id", "started_at" desc);`
    )
    this.addSql(
      `create index if not exists "IDX_audit_log_resource_started_at" on "audit_log" ("resource_type", "resource_id", "started_at" desc);`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "audit_log" cascade;`)
  }
}
