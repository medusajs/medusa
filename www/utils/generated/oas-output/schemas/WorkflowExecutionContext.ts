/**
 * @schema WorkflowExecutionContext
 * type: object
 * description: The workflow execution's context.
 * x-schemaName: WorkflowExecutionContext
 * required:
 *   - compensate
 *   - errors
 * properties:
 *   data:
 *     type: object
 *     description: The context's data.
 *   compensate:
 *     type: object
 *     description: The context's compensate.
 *   errors:
 *     type: array
 *     description: The context's errors.
 *     items:
 *       type: object
 *       description: The error's errors.
 * 
*/

