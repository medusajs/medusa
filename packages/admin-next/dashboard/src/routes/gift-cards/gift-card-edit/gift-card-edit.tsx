import { Drawer, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"

export const GiftCardEdit = () => {
  const { id } = useParams()
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const { t } = useTranslation()

  const handleSuccessfulSubmit = () => {
    onOpenChange(false, true)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Heading>{t("giftCards.editGiftCard")}</Heading>
        </Drawer.Header>
      </Drawer.Content>
    </Drawer>
  )
}
