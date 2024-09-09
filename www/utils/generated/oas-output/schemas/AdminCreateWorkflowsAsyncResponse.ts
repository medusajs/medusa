/**
 * @schema AdminCreateWorkflowsAsyncResponse
 * type: object
 * description: The details of changing a workflow execution's step status.
 * x-schemaName: AdminCreateWorkflowsAsyncResponse
 * required:
 *   - transaction_id
 *   - step_id
 * properties:
 *   transaction_id:
 *     type: string
 *     title: transaction_id
 *     description: The workflows execution's transaction ID.
 *   step_id:
 *     type: string
 *     title: step_id
 *     description: The ID of the step whose status was changed.
 *   response:
 *     description: Sets the step's response. It accepts any type.
 *   compensate_input:
 *     description: Sets the compensation function's input. It accepts any response.
 *   action:
 *     type: string
 *     description: Whether to invoke or compensate the step.
 *     enum:
 *       - invoke
 *       - compensate
 * 
*/

