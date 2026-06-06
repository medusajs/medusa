import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"
import { ulid } from "ulid"

export class Migration20250505092459 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "workflow_execution" drop constraint if exists "workflow_execution_workflow_id_transaction_id_run_id_unique";`
    )
    this.addSql(
      `drop index if exists "IDX_workflow_execution_workflow_id_transaction_id_unique";`
    )
    this.addSql(
      `alter table if exists "workflow_execution" drop constraint if exists "PK_workflow_execution_workflow_id_transaction_id";`
    )

    this.addSql(
      `alter table if exists "workflow_execution" add column if not exists "run_id" text not null default '${ulid()}';`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_workflow_execution_workflow_id_transaction_id_run_id_unique" ON "workflow_execution" (workflow_id, transaction_id, run_id) WHERE deleted_at IS NULL;`
    )
    /*
     * We mistakenly named this migration differently in the workflow engines; this has caused issues with the migrations. Switching between engines will fail because the primary key is attempted to be set twice.
     * The issue happens in the following scenario:
     * 1. In memory engine is used
     * 2. Migration is run
     * 3. Primary is key added
     * 3. Redis engine is used
     * 4. Migration is run
     * 5. Same primary key is attempted to be set again
     * 6. Migration fails
     *
     * The same scenario can happen if you go from Redis to In memory.
     *
     * With this fix, we ensure the primary key is only ever set once.
     */
    this.addSql(
      `alter table if exists "workflow_execution" drop constraint if exists "workflow_execution_pkey";`
    )
    this.addSql(
      `alter table if exists "workflow_execution" add constraint "workflow_execution_pkey" primary key ("workflow_id", "transaction_id", "run_id");`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop index if exists "IDX_workflow_execution_workflow_id_transaction_id_run_id_unique";`
    )
    this.addSql(
      `alter table if exists "workflow_execution" drop constraint if exists "workflow_execution_pkey";`
    )
    this.addSql(
      `alter table if exists "workflow_execution" drop column if exists "run_id";`
    )

    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_workflow_execution_workflow_id_transaction_id_unique" ON "workflow_execution" (workflow_id, transaction_id) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `alter table if exists "workflow_execution" add constraint "workflow_execution_pkey" primary key ("workflow_id", "transaction_id");`
    )
  }
}
