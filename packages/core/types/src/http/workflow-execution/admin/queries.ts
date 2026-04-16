import { OperatorMap } from "../../.."
import { FindParams, SelectParams } from "../../common"

export interface AdminGetWorkflowExecutionsParams extends FindParams {
  /**
   * Filter using a search query.
   */
  q?: string
  /**
   * Filter by the ID of the transaction to retrieve workflow executions for a specific transaction.
   */
  transaction_id?: string | string[]
  /**
   * Filter by the ID of the workflow to retrieve workflow executions for a specific workflow.
   */
  workflow_id?: string | string[]
  /**
   * Filter by the state of the workflow execution.
   */
  state?: string | string[]
  /**
   * Filter by the creation date of the workflow execution.
   */
  created_at?: OperatorMap<string>
}

export interface AdminGetWorkflowExecutionDetailsParams extends SelectParams {}
