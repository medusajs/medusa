import { Heading } from "@medusajs/ui"
import { useAdminGiftCard } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditGiftCardForm } from "./components/edit-gift-card-form"

export const GiftCardEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { gift_card, isLoading, isError, error } = useAdminGiftCard(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("giftCards.editGiftCard")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && gift_card && <EditGiftCardForm giftCard={gift_card} />}
    </RouteDrawer>
  )
}
