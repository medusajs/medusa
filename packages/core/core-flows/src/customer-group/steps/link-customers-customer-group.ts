import {
  ICustomerModuleService,
  LinkWorkflowInput,
} from "@zjedene-medusa/framework/types"
import { Modules, promiseAll } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const linkCustomersToCustomerGroupStepId =
  "link-customers-to-customer-group"
/**
 * This step manages the customers in a customer group.
 * 
 * @example
 * const data = linkCustomersToCustomerGroupStep({
 *   id: "cusgrp_123",
 *   add: ["cus_123"],
 *   remove: ["cus_456"]
 * })
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
