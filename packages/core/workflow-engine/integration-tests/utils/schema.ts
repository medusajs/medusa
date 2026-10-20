/**
 * The tables the Postgres store reads and writes, for tests and benchmarks.
 * Medusa creates them with the workflows module's migration, which this
 * mirrors.
 */
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS "workflow_outbox" (
  "id" text NOT NULL,
  "group_id" text NOT NULL,
  "run_id" text NOT NULL,
  "step_id" text NULL,
  "attempt" integer NULL,
  "status" text NOT NULL DEFAULT 'staged',
  "message" jsonb NOT NULL,
  "claimed_by" text NULL,
  "claimed_until" timestamptz NULL,
  "attempts" integer NOT NULL DEFAULT 0,
  "last_error" jsonb NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz NULL,
  CONSTRAINT "workflow_outbox_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "IDX_workflow_outbox_deleted_at"
  ON "workflow_outbox" ("deleted_at") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_workflow_outbox_group_id"
  ON "workflow_outbox" ("group_id");
CREATE INDEX IF NOT EXISTS "IDX_workflow_outbox_run_id"
  ON "workflow_outbox" ("run_id");
CREATE INDEX IF NOT EXISTS "IDX_workflow_outbox_ready"
  ON "workflow_outbox" ("id")
  WHERE status = 'ready' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_workflow_outbox_staged"
  ON "workflow_outbox" ("created_at")
  WHERE status = 'staged' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_workflow_outbox_dead"
  ON "workflow_outbox" ("updated_at")
  WHERE status = 'dead' AND deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS "workflow_run" (
  "id" text NOT NULL,
  "workflow_id" text NOT NULL,
  "transaction_id" text NOT NULL,
  "status" text NOT NULL,
  "durability" text NOT NULL,
  "definition_hash" text NOT NULL,
  "input" jsonb NULL,
  "context" jsonb NULL,
  "metadata" jsonb NULL,
  "result" jsonb NULL,
  "errors" jsonb NULL,
  "flags" jsonb NULL,
  "parent_run_id" text NULL,
  "parent_step_id" text NULL,
  "idempotent" boolean NOT NULL DEFAULT false,
  "retention_ms" text NULL,
  "lease_owner" text NULL,
  "lease_token" text NULL,
  "lease_expires_at" timestamptz NULL,
  "cancel_requested_at" timestamptz NULL,
  "deadline_at" timestamptz NULL,
  "retain_until" timestamptz NULL,
  "finished_at" timestamptz NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz NULL,
  CONSTRAINT "workflow_run_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "IDX_workflow_run_deleted_at"
  ON "workflow_run" ("deleted_at") WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_workflow_run_active_transaction"
  ON "workflow_run" ("workflow_id", "transaction_id")
  WHERE status NOT IN ('succeeded', 'compensated', 'cancelled', 'failed')
    AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_workflow_run_transaction"
  ON "workflow_run" ("workflow_id", "transaction_id", "created_at");
CREATE INDEX IF NOT EXISTS "IDX_workflow_run_parent"
  ON "workflow_run" ("parent_run_id")
  WHERE parent_run_id IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_workflow_run_lease"
  ON "workflow_run" ("lease_expires_at")
  WHERE status IN ('running', 'compensating') AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_workflow_run_retain_until"
  ON "workflow_run" ("retain_until")
  WHERE retain_until IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_workflow_run_lease_owner"
  ON "workflow_run" ("lease_owner")
  WHERE lease_owner IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_workflow_run_created_at"
  ON "workflow_run" ("created_at");
CREATE INDEX IF NOT EXISTS "IDX_workflow_run_updated_at"
  ON "workflow_run" ("updated_at");

CREATE TABLE IF NOT EXISTS "workflow_schedule" (
  "workflow_id" text NOT NULL,
  "cron" text NULL,
  "interval_ms" text NULL,
  "concurrency" text NOT NULL DEFAULT 'forbid',
  "number_of_executions" integer NULL,
  "remaining" integer NULL,
  "catch_up" boolean NOT NULL DEFAULT true,
  "definition_hash" text NOT NULL,
  "next_fire_at" timestamptz NULL,
  "last_transaction_id" text NULL,
  "last_seen_at" timestamptz NOT NULL,
  "claimed_by" text NULL,
  "claimed_until" timestamptz NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz NULL,
  CONSTRAINT "workflow_schedule_pkey" PRIMARY KEY ("workflow_id")
);
CREATE INDEX IF NOT EXISTS "IDX_workflow_schedule_deleted_at"
  ON "workflow_schedule" ("deleted_at") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_workflow_schedule_next_fire_at"
  ON "workflow_schedule" ("next_fire_at")
  WHERE next_fire_at IS NOT NULL AND deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS "workflow_step" (
  "run_id" text NOT NULL,
  "step_id" text NOT NULL,
  "status" text NOT NULL,
  "attempt" integer NOT NULL DEFAULT 0,
  "has_output" boolean NOT NULL DEFAULT false,
  "output" jsonb NULL,
  "compensate_input" jsonb NULL,
  "error" jsonb NULL,
  "skip_reason" text NULL,
  "pending_failure" jsonb NULL,
  "started_at" timestamptz NULL,
  "finished_at" timestamptz NULL,
  "owner" text NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz NULL,
  CONSTRAINT "workflow_step_pkey" PRIMARY KEY ("run_id", "step_id")
);
CREATE INDEX IF NOT EXISTS "IDX_workflow_step_deleted_at"
  ON "workflow_step" ("deleted_at") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_workflow_step_owner"
  ON "workflow_step" ("owner")
  WHERE status = 'waiting' AND owner IS NOT NULL AND deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS "workflow_timer" (
  "id" text NOT NULL,
  "kind" text NOT NULL,
  "run_id" text NOT NULL,
  "step_id" text NULL,
  "attempt" integer NULL,
  "workflow_id" text NOT NULL,
  "definition_hash" text NOT NULL,
  "due_at" timestamptz NOT NULL,
  "generation" integer NOT NULL DEFAULT 1,
  "claimed_by" text NULL,
  "claimed_until" timestamptz NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz NULL,
  CONSTRAINT "workflow_timer_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "IDX_workflow_timer_deleted_at"
  ON "workflow_timer" ("deleted_at") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_workflow_timer_workflow_due_at"
  ON "workflow_timer" ("workflow_id", "due_at");
CREATE INDEX IF NOT EXISTS "IDX_workflow_timer_run_kind"
  ON "workflow_timer" ("run_id", "kind");

CREATE TABLE IF NOT EXISTS "workflow_worker" (
  "id" text NOT NULL,
  "mode" text NOT NULL,
  "started_at" timestamptz NOT NULL,
  "heartbeat_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz NULL,
  CONSTRAINT "workflow_worker_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "IDX_workflow_worker_deleted_at"
  ON "workflow_worker" ("deleted_at") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_workflow_worker_heartbeat_at"
  ON "workflow_worker" ("heartbeat_at");
`

export async function applySchema(client: {
  query(sql: string): Promise<unknown>
}): Promise<void> {
  await client.query(SCHEMA_SQL)
}
