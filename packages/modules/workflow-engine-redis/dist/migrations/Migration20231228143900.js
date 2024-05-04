"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20231221104256 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20231221104256 extends migrations_1.Migration {
    async up() {
        this.addSql(`
      CREATE TABLE IF NOT EXISTS workflow_execution
        (
            id character varying NOT NULL,
            workflow_id character varying NOT NULL,
            transaction_id character varying NOT NULL,
            execution jsonb NULL,
            context jsonb NULL,
            state character varying NOT NULL,
            created_at timestamp WITHOUT time zone NOT NULL DEFAULT Now(),
            updated_at timestamp WITHOUT time zone NOT NULL DEFAULT Now(),
            deleted_at timestamp WITHOUT time zone NULL,
            CONSTRAINT "PK_workflow_execution_workflow_id_transaction_id" PRIMARY KEY ("workflow_id", "transaction_id")
        );
        
        CREATE UNIQUE INDEX IF NOT EXISTS "IDX_workflow_execution_id" ON "workflow_execution" ("id");
        CREATE INDEX IF NOT EXISTS "IDX_workflow_execution_workflow_id" ON "workflow_execution" ("workflow_id") WHERE deleted_at IS NULL;
        CREATE INDEX IF NOT EXISTS "IDX_workflow_execution_transaction_id" ON "workflow_execution" ("transaction_id") WHERE deleted_at IS NULL;
        CREATE INDEX IF NOT EXISTS "IDX_workflow_execution_state" ON "workflow_execution" ("state") WHERE deleted_at IS NULL;
      `);
    }
    async down() {
        this.addSql(`
        DROP INDEX "IDX_workflow_execution_id";
        DROP INDEX "IDX_workflow_execution_workflow_id";
        DROP INDEX "IDX_workflow_execution_transaction_id";
        DROP INDEX "IDX_workflow_execution_state";

        DROP TABLE IF EXISTS workflow_execution;
      `);
    }
}
exports.Migration20231221104256 = Migration20231221104256;
