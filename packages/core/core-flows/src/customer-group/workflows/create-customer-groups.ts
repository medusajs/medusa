import {
  CustomerGroupDTO,
  CreateCustomerGroupDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createCustomerGroupsStep } from "../steps"

/**
 * The data to create customer groups.
 */
export type CreateCustomerGroupsWorkflowInput = {
  /**
   * The customer groups to create.
   */
  customersData: CreateCustomerGroupDTO[]
}

/**
 * The created customer groups.
 */
export type CreateCustomerGroupsWorkflowOutput = CustomerGroupDTO[]

export const createCustomerGroupsWorkflowId = "create-customer-groups"
/**
 * This workflow creates one or more customer groups. It's used by the
 * [Create Customer Group Admin API Route](https://docs.medusajs.com/api/admin/customer-groups/create-customer-group).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to 
 * create customer groups within your custom flows. For example, you can create customer groups to segregate
 * customers by age group or purchase habits.
 * 
 * @example
 * const { result } = await createCustomerGroupsWorkflow(container)
 * .run({
 *   input: {
 *     customersData: [
 *       {
 *         name: "VIP"
 *       }
 *     ]
 *   }
 * })
 * 
 * @summary
 * 
 * Create one or more customer groups.
 */
export const createCustomerGroupsWorkflow = createWorkflow(
  createCustomerGroupsWorkflowId,
  (
    input: WorkflowData<CreateCustomerGroupsWorkflowInput>
  ): WorkflowResponse<CreateCustomerGroupsWorkflowOutput> => {
    return new WorkflowResponse(createCustomerGroupsStep(input.customersData))
  }
)
