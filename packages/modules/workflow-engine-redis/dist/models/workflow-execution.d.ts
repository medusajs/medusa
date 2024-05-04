import { TransactionState } from "@medusajs/orchestration";
import { OptionalProps } from "@mikro-orm/core";
type OptionalFields = "deleted_at";
export default class WorkflowExecution {
    [OptionalProps]?: OptionalFields;
    id: string;
    workflow_id: string;
    transaction_id: string;
    execution: Record<string, unknown> | null;
    context: Record<string, unknown> | null;
    state: TransactionState;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
//# sourceMappingURL=workflow-execution.d.ts.map