import {
  CreateCustomerAddressDTO,
  FilterableCustomerAddressProps,
  ICustomerModuleService,
  UpdateCustomerAddressDTO,
} from "@medusajs/framework/types"
import { Modules, isDefined } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"
import { unsetForCreate, unsetForUpdate } from "./utils"

export type MaybeUnsetDefaultShippingAddressesStepInput = {
  create?: CreateCustomerAddressDTO[]
  update?: {
    selector: FilterableCustomerAddressProps
    update: UpdateCustomerAddressDTO
  }
}

export const maybeUnsetDefaultShippingAddressesStepId =
  "maybe-unset-default-shipping-customer-addresses"
/**
 * This step unsets the `is_default_shipping` property of one or more addresses.
 */
export const maybeUnsetDefaultShippingAddressesStep = createStep(
  maybeUnsetDefaultShippingAddressesStepId,
  async (data: MaybeUnsetDefaultShippingAddressesStepInput, { container }) => {
    const customerModuleService = container.resolve<ICustomerModuleService>(
      Modules.CUSTOMER
    )
    if (isDefined(data.create)) {
      return unsetForCreate(
        data.create,
        customerModuleService,
        "is_default_shipping"
      )
    }

    if (isDefined(data.update)) {
      return unsetForUpdate(
        data.update,
        customerModuleService,
        "is_default_shipping"
      )
    }

    throw new Error("Invalid step input")
  },
  async (addressesToSet, { container }) => {
    if (!addressesToSet?.length) {
      return
    }

    const customerModuleService = container.resolve<ICustomerModuleService>(
      Modules.CUSTOMER
    )

    await customerModuleService.updateCustomerAddresses(
      { id: addressesToSet },
      { is_default_shipping: true }
    )
  }
)
