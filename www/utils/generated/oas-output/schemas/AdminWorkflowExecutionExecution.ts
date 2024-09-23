/**
 * @schema AdminWorkflowExecutionExecution
 * type: object
 * description: The workflow execution's steps details.
 * x-schemaName: AdminWorkflowExecutionExecution
 * required:
 *   - steps
 * properties:
 *   steps:
 *     type: object
 *     description: The execution's steps. Each object key is a step ID, and the value is the object whose properties are shown below.
 *     required:
 *       - id
 *       - invoke
 *       - definition
 *       - compensate
 *       - depth
 *       - startedAt
 *     additionalProperties:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           title: id
 *           description: The step's ID.
 *         invoke:
 *           type: object
 *           description: The state of the step's invokation function.
 *           x-schemaName: WorkflowExecutionFn
 *         definition:
 *           type: object
 *           description: The step's definition details.
 *           x-schemaName: WorkflowExecutionDefinition
 *         compensate:
 *           type: object
 *           description: The state of the step's compensation function.
 *           x-schemaName: WorkflowExecutionFn
 *         depth:
 *           type: number
 *           title: depth
 *           description: The step's depth in the workflow's execution.
 *         startedAt:
 *           type: number
 *           title: startedAt
 *           description: The timestamp the step started executing.
 * 
*/

