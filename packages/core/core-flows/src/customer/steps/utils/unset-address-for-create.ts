import {
  CreateCustomerAddressDTO,
  ICustomerModuleService,
} from "@medusajs/framework/types"
import { StepResponse } from "@medusajs/framework/workflows-sdk"

export const unsetForCreate = async (
  data: CreateCustomerAddressDTO[],
  customerService: ICustomerModuleService,
  field: "is_default_billing" | "is_default_shipping"
) => {
  const customerIds = data.reduce<string[]>((acc, curr) => {
    if (curr[field]) {
      acc.push(curr.customer_id)
    }
    return acc
  }, [])

  const customerDefaultAddresses = await customerService.listCustomerAddresses({
    customer_id: customerIds,
    [field]: true,
  })

  await customerService.updateCustomerAddresses(
    { customer_id: customerIds, [field]: true },
    { [field]: false }
  )

  return new StepResponse(
    void 0,
    customerDefaultAddresses.map((address) => address.id)
  )
}
