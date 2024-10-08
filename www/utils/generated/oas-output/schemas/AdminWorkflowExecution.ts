/**
 * @schema AdminWorkflowExecution
 * type: object
 * description: The workflows execution's details.
 * x-schemaName: AdminWorkflowExecution
 * required:
 *   - id
 *   - workflow_id
 *   - transaction_id
 *   - execution
 *   - context
 *   - state
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The workflow execution's ID.
 *   workflow_id:
 *     type: string
 *     title: workflow_id
 *     description: The ID of the workflow.
 *   transaction_id:
 *     type: string
 *     title: transaction_id
 *     description: The workflow execution's transaction ID.
 *   execution:
 *     $ref: "#/components/schemas/AdminWorkflowExecutionExecution"
 *   context:
 *     $ref: "#/components/schemas/WorkflowExecutionContext"
 *   state:
 *     type: string
 *     description: The workflow execution's state.
 *     enum:
 *       - not_started
 *       - invoking
 *       - waiting_to_compensate
 *       - compensating
 *       - done
 *       - reverted
 *       - failed
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the workflow execution was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the workflow execution was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the workflow execution was deleted.
 * 
*/

