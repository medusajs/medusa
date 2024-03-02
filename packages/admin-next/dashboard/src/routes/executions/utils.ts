import { AdminGetWorkflowExecutionsParams } from "@medusajs/medusa"

export const adminExecutionKey = {
  detail: (id: string) => ["workflow_executions", "detail", id],
  list: (query?: AdminGetWorkflowExecutionsParams) => [
    "workflow_executions",
    "list",
    { query },
  ],
}
