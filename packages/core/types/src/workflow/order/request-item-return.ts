import { CreateReturnItem } from "./create-return-order"

export interface RequestItemReturnWorkflowInput {
  return_id: string
  items: CreateReturnItem[]
}
