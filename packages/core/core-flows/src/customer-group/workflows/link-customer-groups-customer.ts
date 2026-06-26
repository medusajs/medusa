import type { LinkWorkflowInput } from "@medusajs/framework/types"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { linkCustomerGroupsToCustomerStep } from "../steps"

/**
 * The data to manage the customer groups of a customer.
 *
 * @property id - The ID of the customer to manage its groups.
 * @property add - The IDs of the customer groups to add the customer to.
 * @property remove - The IDs of the customer groups to remove the customer from.
 */
export type LinkCustomerGroupsToCustomerWorkflowInput = LinkWorkflowInput

export const linkCustomerGroupsToCustomerWorkflowId =
  "link-customer-groups-to-customer"
/**
 * This workflow manages the customer groups a customer is in. It's used by the
 * [Manage Groups of Customer Admin API Route](https://docs.medusajs.com/api/admin#customers_postcustomersidcustomergroups).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * manage the customer groups of a customer in your custom flow.
 *
 * @example
 * const { result } = await linkCustomerGroupsToCustomerWorkflow(container)
 * .run({
 *   input: {
 *     id: "cus_123",
 *     add: ["cusgrp_123"],
 *     remove: ["cusgrp_456"]
 *   }
 * })
 *
 * @summary
 *
 * Manage groups of a customer.
 */
export const linkCustomerGroupsToCustomerWorkflow = createWorkflow(
  linkCustomerGroupsToCustomerWorkflowId,
  (
    input: WorkflowData<LinkCustomerGroupsToCustomerWorkflowInput>
  ): WorkflowData<void> => {
    linkCustomerGroupsToCustomerStep(input)
  }
)
