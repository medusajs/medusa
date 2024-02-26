import { useAdminAddLocationToSalesChannel } from "medusa-react"
import { RouteFocusModal } from "../../../components/route-modal"

export const LocationAddSalesChannels = () => {
  const { mutateAsync } = useAdminAddLocationToSalesChannel() // TODO: We need a batch mutation instead of this to avoid multiple requests

  return <RouteFocusModal></RouteFocusModal>
}
