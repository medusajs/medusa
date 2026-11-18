import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20261112093536 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "audit_log" ("id" text not null, "started_at" timestamptz not null, "ended_at" timestamptz not null, "actor_type" text check ("actor_type" in ('user', 'api_key', 'customer', 'system', 'anonymous')) not null, "actor_id" text null, "impersonator_id" text null, "action" text not null, "resource_type" text null, "resource_id" text null, "outcome" text check ("outcome" in ('succeeded', 'denied', 'failed')) not null, "request" jsonb null, "request_data" jsonb null, "response_data" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "audit_log_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_log_deleted_at" ON "audit_log" ("deleted_at") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_log_started_at" ON "audit_log" ("started_at") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_log_actor_id_started_at" ON "audit_log" ("actor_id", "started_at") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_log_resource_type_resource_id_started_at" ON "audit_log" ("resource_type", "resource_id", "started_at") WHERE deleted_at IS NULL;`
    )
  }
}
