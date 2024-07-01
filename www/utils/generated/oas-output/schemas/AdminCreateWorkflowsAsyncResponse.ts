/**
 * @schema AdminCreateWorkflowsAsyncResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminCreateWorkflowsAsyncResponse
 * required:
 *   - transaction_id
 *   - step_id
 * properties:
 *   transaction_id:
 *     type: string
 *     title: transaction_id
 *     description: The workflows execution's transaction id.
 *   step_id:
 *     type: string
 *     title: step_id
 *     description: The workflows execution's step id.
 *   response: {}
 *   compensate_input: {}
 *   action:
 *     type: string
 *     enum:
 *       - invoke
 *       - compensate
 * 
*/

