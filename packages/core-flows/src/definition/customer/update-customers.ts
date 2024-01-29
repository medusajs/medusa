import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CustomerDTO,
  FilterableCustomerProps,
  ICustomerModuleService,
  CustomerUpdateableFields,
} from "@medusajs/types"
import {
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  createStep,
  StepResponse,
} from "@medusajs/workflows-sdk"

type UpdateCustomerStepInput = {
  selector: FilterableCustomerProps
  update: CustomerUpdateableFields
}

const updateCustomerStepId = "update-customer"
const updateCustomersStep = createStep(
  updateCustomerStepId,
  async (data: UpdateCustomerStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])
    const prevCustomers = await service.list(data.selector, {
      select: selects,
      relations,
    })

    const customers = await service.update(data.selector, data.update)

    return new StepResponse(customers, prevCustomers)
  },
  async (prevCustomers, { container }) => {
    if (!prevCustomers) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await promiseAll(
      prevCustomers.map((c) =>
        service.update(c.id, {
          first_name: c.first_name,
          last_name: c.last_name,
          email: c.email,
          phone: c.phone,
          metadata: c.metadata,
        })
      )
    )
  }
)

type WorkflowInput = UpdateCustomerStepInput

export const updateCustomersWorkflowId = "update-customers"
export const updateCustomersWorkflow = createWorkflow(
  updateCustomersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerDTO[]> => {
    return updateCustomersStep(input)
  }
)
