import {
  CreateCustomerAddressDTO,
  UpdateCustomerAddressDTO,
  FilterableCustomerAddressProps,
  ICustomerModuleService,
} from "@medusajs/types"
import { createStep } from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { unsetForCreate, unsetForUpdate } from "./utils"
import { isDefined } from "@medusajs/utils"

type StepInput = {
  create?: CreateCustomerAddressDTO[]
  update?: {
    selector: FilterableCustomerAddressProps
    update: UpdateCustomerAddressDTO
  }
}

export const maybeUnsetDefaultShippingAddressesStepId =
  "maybe-unset-default-shipping-customer-addresses"
export const maybeUnsetDefaultShippingAddressesStep = createStep(
  maybeUnsetDefaultShippingAddressesStepId,
  async (data: StepInput, { container }) => {
    const customerModuleService = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
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
      ModuleRegistrationName.CUSTOMER
    )

    await customerModuleService.updateAddresses(
      { id: addressesToSet },
      { is_default_shipping: true }
    )
  }
)
