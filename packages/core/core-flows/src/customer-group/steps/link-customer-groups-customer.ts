import {
  ICustomerModuleService,
  LinkWorkflowInput,
} from "@zjedene-medusa/framework/types"
import { Modules, promiseAll } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const linkCustomerGroupsToCustomerStepId =
  "link-customers-to-customer-group"
/**
 * This step manages the customer groups of a customer.
 * 
 * @example
 * const data = linkCustomerGroupsToCustomerStep({
 *   id: "cus_123",
 *   add: ["cusgrp_123"],
 *   remove: ["cusgrp_456"]
 * })
 */
export const linkCustomerGroupsToCustomerStep = createStep(
  linkCustomerGroupsToCustomerStepId,
  async (data: LinkWorkflowInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    const toAdd = (data.add ?? []).map((customerGroupId) => {
      return {
        customer_group_id: customerGroupId,
        customer_id: data.id,
      }
    })

    const toRemove = (data.remove ?? []).map((customerGroupId) => {
      return {
        customer_group_id: customerGroupId,
        customer_id: data.id,
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
