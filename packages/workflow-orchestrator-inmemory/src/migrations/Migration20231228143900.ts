import { Migration } from "@mikro-orm/migrations"

export class Migration20231221104256 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `
      CREATE TABLE IF NOT EXISTS workflow_execution
        (
            id character varying NOT NULL,
            created_at timestamp WITHOUT time zone NOT NULL DEFAULT Now(),
            updated_at timestamp WITHOUT time zone NOT NULL DEFAULT Now(),
            deleted_at timestamp WITHOUT time zone NULL,
            workflow_id character varying NOT NULL,
            transaction_id character varying NOT NULL,
            definition jsonb NULL,
            context jsonb NULL,
            state character varying NOT NULL,
            CONSTRAINT "PK_workflow_execution_id" PRIMARY KEY ("id")
        );
        
        CREATE INDEX IF NOT EXISTS "IDX_workflow_execution_workflow_id" ON "workflow_execution" ("workflow_id") WHERE deleted_at IS NULL;
        CREATE INDEX IF NOT EXISTS "IDX_workflow_execution_transaction_id" ON "workflow_execution" ("transaction_id") WHERE deleted_at IS NULL;
        CREATE INDEX IF NOT EXISTS "IDX_workflow_execution_state" ON "workflow_execution" ("state") WHERE deleted_at IS NULL;
        CREATE UNIQUE INDEX IF NOT EXISTS "IDX_workflow_execution_workflow_id_transaction_id_unique" ON "workflow_execution" ("workflow_id", "transaction_id") WHERE deleted_at IS NULL;
      `
    )
  }

  async down(): Promise<void> {
    this.addSql(
      `
        DROP INDEX "IDX_workflow_execution_workflow_id";
        DROP INDEX "IDX_workflow_execution_transaction_id";
        DROP INDEX "IDX_workflow_execution_state";
        DROP INDEX "IDX_workflow_execution_workflow_id_transaction_id_unique";

        DROP TABLE IF EXISTS workflow_execution;
      `
    )
  }
}
