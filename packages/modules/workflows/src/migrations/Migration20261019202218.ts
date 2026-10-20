import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261019202218 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "workflow_outbox" ("id" text not null, "group_id" text not null, "run_id" text not null, "step_id" text null, "attempt" integer null, "status" text not null default 'staged', "message" jsonb not null, "claimed_by" text null, "claimed_until" timestamptz null, "attempts" integer not null default 0, "last_error" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "workflow_outbox_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_outbox_deleted_at" ON "workflow_outbox" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_outbox_group_id" ON "workflow_outbox" ("group_id");`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_outbox_run_id" ON "workflow_outbox" ("run_id");`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_outbox_ready" ON "workflow_outbox" ("id") WHERE status = 'ready' AND deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_outbox_staged" ON "workflow_outbox" ("created_at") WHERE status = 'staged' AND deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_outbox_dead" ON "workflow_outbox" ("updated_at") WHERE status = 'dead' AND deleted_at IS NULL;`);

    this.addSql(`create table if not exists "workflow_run" ("id" text not null, "workflow_id" text not null, "transaction_id" text not null, "status" text not null, "durability" text not null, "definition_hash" text not null, "input" jsonb null, "context" jsonb null, "metadata" jsonb null, "result" jsonb null, "errors" jsonb null, "flags" jsonb null, "parent_run_id" text null, "parent_step_id" text null, "idempotent" boolean not null default false, "retention_ms" text null, "lease_owner" text null, "lease_token" text null, "lease_expires_at" timestamptz null, "cancel_requested_at" timestamptz null, "deadline_at" timestamptz null, "retain_until" timestamptz null, "finished_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "workflow_run_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_run_deleted_at" ON "workflow_run" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_workflow_run_active_transaction" ON "workflow_run" ("workflow_id", "transaction_id") WHERE status NOT IN ('succeeded', 'compensated', 'cancelled', 'failed') AND deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_run_transaction" ON "workflow_run" ("workflow_id", "transaction_id", "created_at");`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_run_parent" ON "workflow_run" ("parent_run_id") WHERE parent_run_id IS NOT NULL AND deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_run_lease" ON "workflow_run" ("lease_expires_at") WHERE status IN ('running', 'compensating') AND deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_run_retain_until" ON "workflow_run" ("retain_until") WHERE retain_until IS NOT NULL AND deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_run_lease_owner" ON "workflow_run" ("lease_owner") WHERE lease_owner IS NOT NULL AND deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_run_created_at" ON "workflow_run" ("created_at");`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_run_updated_at" ON "workflow_run" ("updated_at");`);

    this.addSql(`create table if not exists "workflow_schedule" ("workflow_id" text not null, "cron" text null, "interval_ms" text null, "concurrency" text not null default 'forbid', "number_of_executions" integer null, "remaining" integer null, "catch_up" boolean not null default true, "definition_hash" text not null, "next_fire_at" timestamptz null, "last_transaction_id" text null, "last_seen_at" timestamptz not null, "claimed_by" text null, "claimed_until" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "workflow_schedule_pkey" primary key ("workflow_id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_schedule_deleted_at" ON "workflow_schedule" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_schedule_next_fire_at" ON "workflow_schedule" ("next_fire_at") WHERE next_fire_at IS NOT NULL AND deleted_at IS NULL;`);

    this.addSql(`create table if not exists "workflow_step" ("run_id" text not null, "step_id" text not null, "status" text not null, "attempt" integer not null default 0, "has_output" boolean not null default false, "output" jsonb null, "compensate_input" jsonb null, "error" jsonb null, "skip_reason" text null, "pending_failure" jsonb null, "started_at" timestamptz null, "finished_at" timestamptz null, "owner" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "workflow_step_pkey" primary key ("run_id", "step_id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_step_deleted_at" ON "workflow_step" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_step_owner" ON "workflow_step" ("owner") WHERE status = 'waiting' AND owner IS NOT NULL AND deleted_at IS NULL;`);

    this.addSql(`create table if not exists "workflow_timer" ("id" text not null, "kind" text not null, "run_id" text not null, "step_id" text null, "attempt" integer null, "workflow_id" text not null, "definition_hash" text not null, "due_at" timestamptz not null, "generation" integer not null default 1, "claimed_by" text null, "claimed_until" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "workflow_timer_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_timer_deleted_at" ON "workflow_timer" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_timer_workflow_due_at" ON "workflow_timer" ("workflow_id", "due_at");`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_timer_run_kind" ON "workflow_timer" ("run_id", "kind");`);

    this.addSql(`create table if not exists "workflow_worker" ("id" text not null, "mode" text not null, "started_at" timestamptz not null, "heartbeat_at" timestamptz not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "workflow_worker_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_worker_deleted_at" ON "workflow_worker" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workflow_worker_heartbeat_at" ON "workflow_worker" ("heartbeat_at");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "workflow_outbox" cascade;`);

    this.addSql(`drop table if exists "workflow_run" cascade;`);

    this.addSql(`drop table if exists "workflow_schedule" cascade;`);

    this.addSql(`drop table if exists "workflow_step" cascade;`);

    this.addSql(`drop table if exists "workflow_timer" cascade;`);

    this.addSql(`drop table if exists "workflow_worker" cascade;`);
  }

}
