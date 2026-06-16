import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteCustomerGroupStep } from "../steps"

/**
 * The data to delete customer groups.
 */
export type DeleteCustomerGroupsWorkflowInput = { 
  /**
   * The IDs of the customer groups to delete.
   */
  ids: string[]
}

export const deleteCustomerGroupsWorkflowId = "delete-customer-groups"
/**
 * This workflow deletes one or more customer groups. It's used by the
 * [Delete Customer Group Admin API Route](https://docs.medusajs.com/api/admin#customer-groups_deletecustomergroupsid).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * delete customer groups within your custom flows.
 * 
 * @example
 * const { result } = await deleteCustomerGroupsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["cusgrp_123"]
 *   }
 * })
 * 
 * @summary
 * 
 * Delete one or more customer groups.
 */
export const deleteCustomerGroupsWorkflow = createWorkflow(
  deleteCustomerGroupsWorkflowId,
  (
    input: WorkflowData<DeleteCustomerGroupsWorkflowInput>
  ): WorkflowData<void> => {
    deleteCustomerGroupStep(input.ids)
  }
)
