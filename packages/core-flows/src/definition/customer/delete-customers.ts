import { ICustomerModuleService } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  createStep,
  StepResponse,
} from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

type DeleteCustomerStepInput = string[]

const deleteCustomerStepId = "delete-customer"
const deleteCustomerStep = createStep(
  deleteCustomerStepId,
  async (ids: DeleteCustomerStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.softDelete(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevCustomers, { container }) => {
    if (!prevCustomers) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.restore(prevCustomers)
  }
)

type WorkflowInput = { ids: DeleteCustomerStepInput }

export const deleteCustomersWorkflowId = "delete-customers"
export const deleteCustomersWorkflow = createWorkflow(
  deleteCustomersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteCustomerStep(input.ids)
  }
)
