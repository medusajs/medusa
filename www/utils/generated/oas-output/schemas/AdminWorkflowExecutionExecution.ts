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
 *           properties:
 *             state:
 *               type: string
 *               description: The invokation step's state.
 *               enum:
 *                 - not_started
 *                 - invoking
 *                 - compensating
 *                 - done
 *                 - reverted
 *                 - failed
 *                 - dormant
 *                 - skipped
 *                 - skipped_failure
 *                 - timeout
 *             status:
 *               type: string
 *               description: The invokation step's state.
 *               enum:
 *                 - idle
 *                 - ok
 *                 - waiting_response
 *                 - temp_failure
 *                 - permanent_failure
 *           required:
 *             - state
 *             - status
 *         definition:
 *           type: object
 *           description: The step's definition details.
 *           x-schemaName: WorkflowExecutionDefinition
 *           properties:
 *             async:
 *               type: boolean
 *               title: async
 *               description: Whether the step is async.
 *             compensateAsync:
 *               type: boolean
 *               title: compensateAsync
 *               description: Whether the compensation function of the step is async.
 *             noCompensation:
 *               type: boolean
 *               title: noCompensation
 *               description: Whether the step doesn't have a compensation function.
 *             continueOnPermanentFailure:
 *               type: boolean
 *               title: continueOnPermanentFailure
 *               description: Whether the step continues executing even if its status is changed to failed.
 *             maxRetries:
 *               type: number
 *               title: maxRetries
 *               description: The maximum number of times to retry the step.
 *             noWait:
 *               type: boolean
 *               title: noWait
 *               description: Whether the workflow shouldn't wait for the step to finish before moving to the next step.
 *               default: false
 *             retryInterval:
 *               type: number
 *               title: retryInterval
 *               description: The interval in seconds between retry attempts when the step fails.
 *             retryIntervalAwaiting:
 *               type: number
 *               title: retryIntervalAwaiting
 *               description: The interval in seconds to retry a step even if its status is `waiting_response`.
 *             saveResponse:
 *               type: boolean
 *               title: saveResponse
 *               description: Whether the step's response is stored.
 *             timeout:
 *               type: number
 *               title: timeout
 *               description: The maximum time in seconds to wait for this step to complete. If the step exceeds this time, the step's state is changed to `timeout`, but the step continues executing.
 *         compensate:
 *           type: object
 *           description: The state of the step's compensation function.
 *           x-schemaName: WorkflowExecutionFn
 *           properties:
 *             state:
 *               type: string
 *               description: The compensation function's state.
 *               enum:
 *                 - not_started
 *                 - invoking
 *                 - compensating
 *                 - done
 *                 - reverted
 *                 - failed
 *                 - dormant
 *                 - skipped
 *                 - skipped_failure
 *                 - timeout
 *             status:
 *               type: string
 *               description: The compensation function's status.
 *               enum:
 *                 - idle
 *                 - ok
 *                 - waiting_response
 *                 - temp_failure
 *                 - permanent_failure
 *           required:
 *             - state
 *             - status
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

