import { CreateDraftOrderAddressDetails } from "./create-draft-order-address-details"
import { CreateDraftOrderCustomerDetails } from "./create-draft-order-customer-details"
import { CreateDraftOrderItemsDetails } from "./create-draft-order-existing-items-details"
import { CreateDraftOrderRegionDetails } from "./create-draft-order-region-details"

export const CreateDraftOrderDetails = () => {
  return (
    <div>
      <CreateDraftOrderRegionDetails />
      <CreateDraftOrderCustomerDetails />
      <CreateDraftOrderItemsDetails />
      <CreateDraftOrderAddressDetails />
    </div>
  )
}
