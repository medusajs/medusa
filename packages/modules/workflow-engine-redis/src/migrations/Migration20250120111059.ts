import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250120111059 extends Migration {

  async up(): Promise<void> {
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_workflow_execution_workflow_id_transaction_id_unique" ON "workflow_execution" (workflow_id, transaction_id) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_workflow_execution_workflow_id_transaction_id_unique";');
  }

}
