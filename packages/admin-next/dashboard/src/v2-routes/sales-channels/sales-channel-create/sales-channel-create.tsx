import { RouteFocusModal } from "../../../components/route-modal"
import { CreateSalesChannelForm } from "../../../modules/sales-channels/sales-channel-create/components/create-sales-channel-form"

export const SalesChannelCreate = () => {
  return (
    <RouteFocusModal>
      <CreateSalesChannelForm />
    </RouteFocusModal>
  )
}
