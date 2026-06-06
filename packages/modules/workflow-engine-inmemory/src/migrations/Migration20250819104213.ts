import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250819104213 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_workflow_execution_run_id" ON "workflow_execution" (run_id) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_workflow_execution_run_id";`)
  }
}
