import {
  CustomerGroupUpdatableFields,
  FilterableCustomerGroupProps,
  ICustomerModuleService,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to update customer groups.
 */
export type UpdateCustomerGroupStepInput = {
  /**
   * The filters to select the customer groups to update.
   */
  selector: FilterableCustomerGroupProps
  /**
   * The data to update in the customer groups.
   */
  update: CustomerGroupUpdatableFields
}

export const updateCustomerGroupStepId = "update-customer-groups"
/**
 * This step updates one or more customer groups.
 * 
 * @example
 * const data = updateCustomerGroupsStep({
 *   selector: {
 *     id: "cusgrp_123"
 *   },
 *   update: {
 *     name: "VIP"
 *   }
 * })
 */
export const updateCustomerGroupsStep = createStep(
  updateCustomerGroupStepId,
  async (data: UpdateCustomerGroupStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])
    const prevCustomerGroups = await service.listCustomerGroups(data.selector, {
      select: selects,
      relations,
    })

    const customers = await service.updateCustomerGroups(
      data.selector,
      data.update
    )

    return new StepResponse(customers, prevCustomerGroups)
  },
  async (prevCustomerGroups, { container }) => {
    if (!prevCustomerGroups) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    await promiseAll(
      prevCustomerGroups.map((c) =>
        service.updateCustomerGroups(c.id, {
          name: c.name,
          metadata: c.metadata,
        })
      )
    )
  }
)
