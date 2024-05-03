import {
  UpdateCustomerAddressDTO,
  FilterableCustomerAddressProps,
  ICustomerModuleService,
} from "@medusajs/types"
import { StepResponse } from "@medusajs/workflows-sdk"

export const unsetForUpdate = async (
  data: {
    selector: FilterableCustomerAddressProps
    update: UpdateCustomerAddressDTO
  },
  customerService: ICustomerModuleService,
  field: "is_default_billing" | "is_default_shipping"
) => {
  if (!data.update[field]) {
    return new StepResponse(void 0)
  }

  const affectedCustomers = await customerService.listAddresses(data.selector, {
    select: ["id", "customer_id"],
  })

  const customerIds = affectedCustomers.map((address) => address.customer_id)

  const customerDefaultAddresses = await customerService.listAddresses({
    customer_id: customerIds,
    [field]: true,
  })

  await customerService.updateAddresses(
    { customer_id: customerIds, [field]: true },
    { [field]: false }
  )

  return new StepResponse(
    void 0,
    customerDefaultAddresses.map((address) => address.id)
  )
}
