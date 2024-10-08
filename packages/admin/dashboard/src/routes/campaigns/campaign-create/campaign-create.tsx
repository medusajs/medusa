import { RouteFocusModal } from "../../../components/modals"
import { CreateCampaignForm } from "./components/create-campaign-form"

export const CampaignCreate = () => {
  return (
    <RouteFocusModal>
      <CreateCampaignForm />
    </RouteFocusModal>
  )
}
