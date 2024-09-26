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
 *     properties:
 *       invoke:
 *         type: object
 *         description: The datum's invoke.
 *         required:
 *           - output
 *         additionalProperties:
 *           type: object
 *           properties:
 *             output:
 *               type: object
 *               description: The invoke's output.
 *               required:
 *                 - output
 *                 - compensateInput
 *               properties:
 *                 output: {}
 *                 compensateInput: {}
 *       payload: {}
 *     required:
 *       - invoke
 *   compensate:
 *     type: object
 *     description: The context's compensate.
 *   errors:
 *     type: array
 *     description: The context's errors.
 *     items:
 *       type: object
 *       description: The error's details.
 *       properties:
 *         error:
 *           type: object
 *           description: The error's details.
 *         action:
 *           type: string
 *           title: action
 *           description: The error's action.
 *         handlerType:
 *           type: string
 *           title: handlerType
 *           description: The error's handler type.
 *       required:
 *         - error
 *         - action
 *         - handlerType
 * 
*/

