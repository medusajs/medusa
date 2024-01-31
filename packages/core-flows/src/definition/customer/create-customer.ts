import {
  CreateCustomerDTO,
  CustomerDTO,
  UpdateAuthUserDTO,
} from "@medusajs/types"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { createCustomerStep } from "../../handlers/customer"
import { updateAuthUserStep } from "../../handlers/auth/update-auth-user"
import { createCustomersWorkflowId } from "../../customer"

type WorkflowInput = { customersData: CreateCustomerDTO[]; authUserId: string }

const transformationStep = createStep(
  "transform-customer-data-for-auth-user-update",
  async (data: { customer: CustomerDTO[]; authUserId: string }, context) => {
    const update: UpdateAuthUserDTO[] = [
      {
        id: data.authUserId,
        app_metadata: { customer_id: data.customer[0].id },
      },
    ]

    return new StepResponse(update)
  }
)

export const createCustomersWorkflowsId = "create-customers"
export const createCustomersWorkflows = createWorkflow(
  createCustomersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerDTO[]> => {
    const customer = createCustomerStep(input.customersData)

    const update = transformationStep({
      customer,
      authUserId: input.authUserId,
    })

    updateAuthUserStep(update)

    return customer
  }
)
