import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { useCampaign } from "../../../hooks/api/campaigns"
import { AddCampaignPromotionsForm } from "./components"

export const AddCampaignPromotions = () => {
  const { id } = useParams()
  const { campaign, isError, error } = useCampaign(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {campaign && <AddCampaignPromotionsForm campaign={campaign} />}
    </RouteFocusModal>
  )
}
