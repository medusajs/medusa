import {
  CustomerDTO,
  CreateCustomerDTO,
  ICustomerModuleService,
} from "@medusajs/types"
import {
  StepResponse,
  createStep,
  WorkflowData,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

const createCustomersStepId = "create-customers"
const createCustomersStep = createStep(
  createCustomersStepId,
  async (data: CreateCustomerDTO[], { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const createdCustomers = await service.create(data)

    return new StepResponse(
      createdCustomers,
      createdCustomers.map((createdCustomers) => createdCustomers.id)
    )
  },
  async (createdCustomerIds, { container }) => {
    if (!createdCustomerIds?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.delete(createdCustomerIds)
  }
)

type WorkflowInput = { customersData: CreateCustomerDTO[] }

export const createCustomersWorkflowId = "create-customers"
export const createCustomersWorkflow = createWorkflow(
  createCustomersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerDTO[]> => {
    return createCustomersStep(input.customersData)
  }
)
