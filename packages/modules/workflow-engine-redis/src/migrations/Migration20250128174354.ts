import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250128174354 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "workflow_execution" add column if not exists "retention_time" integer null;`
    )
    this.addSql(`
      UPDATE workflow_execution
      SET retention_time = (
        SELECT COALESCE(
          (execution->'options'->>'retentionTime')::integer, 
          0
        )
      )
      WHERE execution->'options' ? 'retentionTime';
    `)
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "workflow_execution" drop column if exists "retention_time";`
    )
  }
}
