/**
 * @schema WorkflowExecutionFn
 * type: object
 * description: The state of the step's invokation function.
 * x-schemaName: WorkflowExecutionFn
 * required:
 *   - state
 *   - status
 * properties:
 *   state:
 *     type: string
 *     description: The invokation step's state.
 *     enum:
 *       - failed
 *       - not_started
 *       - invoking
 *       - compensating
 *       - done
 *       - reverted
 *       - dormant
 *       - skipped
 *       - skipped_failure
 *       - timeout
 *   status:
 *     type: string
 *     description: The invokation step's state.
 *     enum:
 *       - idle
 *       - ok
 *       - waiting_response
 *       - temp_failure
 *       - permanent_failure
 * 
*/

