import {
  ICustomerModuleService,
  LinkWorkflowInput,
} from "@medusajs/framework/types"
import { Modules, promiseAll } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const linkCustomersToCustomerGroupStepId =
  "link-customers-to-customer-group"
/**
 * This step creates one or more links between customer and customer group records.
 */
export const linkCustomersToCustomerGroupStep = createStep(
  linkCustomersToCustomerGroupStepId,
  async (data: LinkWorkflowInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    const toAdd = (data.add ?? []).map((customerId) => {
      return {
        customer_id: customerId,
        customer_group_id: data.id,
      }
    })

    const toRemove = (data.remove ?? []).map((customerId) => {
      return {
        customer_id: customerId,
        customer_group_id: data.id,
      }
    })

    const promises: Promise<any>[] = []
    if (toAdd.length) {
      promises.push(service.addCustomerToGroup(toAdd))
    }
    if (toRemove.length) {
      promises.push(service.removeCustomerFromGroup(toRemove))
    }
    await promiseAll(promises)

    return new StepResponse(void 0, { toAdd, toRemove })
  },
  async (prevData, { container }) => {
    if (!prevData) {
      return
    }
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    if (prevData.toAdd.length) {
      await service.removeCustomerFromGroup(prevData.toAdd)
    }
    if (prevData.toRemove.length) {
      await service.addCustomerToGroup(prevData.toRemove)
    }
  }
)
