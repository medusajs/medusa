import { FindParams } from "../../common"

export interface AdminGetWorkflowExecutionsParams extends FindParams {
  transaction_id?: string | string[]
  workflow_id?: string | string[]
}
