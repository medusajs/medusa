import { Drawer, Heading } from "@medusajs/ui"
import { useAdminGiftCard } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { EditGiftCardForm } from "./components/edit-gift-card-form"

export const GiftCardEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const { gift_card, isLoading, isError, error } = useAdminGiftCard(id!)

  const handleSuccessfulSubmit = () => {
    onOpenChange(false, true)
  }

  if (isError) {
    throw error
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Heading>{t("giftCards.editGiftCard")}</Heading>
        </Drawer.Header>
        {!isLoading && gift_card && (
          <EditGiftCardForm
            giftCard={gift_card}
            onSuccessfulSubmit={handleSuccessfulSubmit}
            subscribe={subscribe}
          />
        )}
      </Drawer.Content>
    </Drawer>
  )
}
